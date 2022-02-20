const { polygon, api } = require("./modules/polygon")
const cheerio = require("cheerio")

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
}

module.exports = User