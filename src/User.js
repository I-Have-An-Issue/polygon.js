const { polygon, cdn } = require("./modules/polygon")
const cheerio = require("cheerio")

/**
 * Represents a Project Polygon user.
 */
class User {
    /**
     * @param {string} username 
     * @param {number} id 
     */
    constructor(username, id) { 
        /**
         * @type {string}
         */
        this.username = username
        /**
         * @type {number}
         */
        this.id = id
    }

    /**
     * Get the 2D thumbnail of the user.
     * @returns {Promise<boolean|string>}
     */
    thumbnail() {
        return new Promise((resolve, reject) => {
            polygon.get(`/user?id=${this.id}`).then((response) => {
                if (response.status !== 200) return resolve(false)
                const $ = cheerio.load(response.data)
                resolve($(`img[class="img-fluid"]`).attr("data-src"))
            }).catch(e => reject(e))
        })
    }

    /**
     * Returns an object containing paths to access the user's 3D files on Polygon's CDN.
     * @author https://github.com/kickturn
     * @returns {Promise<boolean|object>}
     */
    three_d() {
        return new Promise((resolve, reject) => {
            polygon.get(`/avatar-thumbnail-3d/json?userId=${this.id}`).then((response) => {
                if (response.status !== 200) return resolve(false)
                polygon.get(response.data.Url).then((res) => {
                    resolve(res.data)
                }).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    }

    /**
     * Returns the raw OBJ of the user's model.
     * @author https://github.com/kickturn
     * @returns {Promise<boolean|string>}
     */
    obj() {
        return new Promise((resolve, reject) => {
            this.three_d().then((response) => {
                cdn.get(response.obj).then((res) => {
                    resolve(res.data)
                }).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    }

    /**
     * Returns the raw MTL of the user's model.
     * @author https://github.com/kickturn
     * @returns {Promise<boolean|string>}
     */
    mtl() {
        return new Promise((resolve, reject) => {
            this.three_d().then((response) => {
                cdn.get(response.mtl).then((res) => {
                    resolve(res.data)
                }).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    }

    /**
     * Returns the user's Blurb.
     * @returns {Promise<boolean|string>}
     */
    getBlurb() {
        return new Promise((resolve, reject) => {
            polygon.get(`/user?id=${this.id}`).then((response) => {
                if (response.status !== 200) return resolve(false)
                const $ = cheerio.load(response.data)
                const blurb = $(`p[class="text-break"]`).text()
                resolve(blurb)
            }).catch(e => reject(e))
        })
    }
}

module.exports = User