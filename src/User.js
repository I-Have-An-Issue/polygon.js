const { polygon, api, cdn } = require("./modules/polygon")
const cheerio = require("cheerio")
const { removeClass } = require("cheerio/lib/api/attributes")

class User {
    constructor(username, id) { 
        this.username = username
        this.id = id
    }

    thumbnail() {
        return new Promise((resolve, reject) => {
            polygon.get(`/user?id=${this.id}`).then((response) => {
                if (response.status !== 200) return resolve(false)
                const $ = cheerio.load(response.data)
                resolve($(`img[class="img-fluid"]`).attr("data-src"))
            }).catch(e => reject(e))
        })
    }

    three_d() {
        return new Promise((resolve, reject) => {
            polygon.get(`/avatar-thumbnail-3d/json?userId=${this.id}`).then((response) => {
                if (response.status !== 200) return resolve(false)
                polygon.get(response.data.Url).then((res) => {
                    resolve(res.data);
                }).catch(e => reject(e))
            }).catch(e => reject(e))
        })
    }

    obj() {
        return new Promise((resolve, reject) => {
            this.three_d().then((response) => {
                cdn.get(response.obj).then((res) => {
                    resolve(res.data);
                }).catch(e => reject(e))
            }).catch(e => reject(e));
        })
    }

    mtl() {
        return new Promise((resolve, reject) => {
            this.three_d().then((response) => {
                cdn.get(response.mtl).then((res) => {
                    resolve(res.data);
                }).catch(e => reject(e))
            }).catch(e => reject(e));
        })
    }
}

module.exports = User