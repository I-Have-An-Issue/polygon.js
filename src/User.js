const { polygon, api } = require("./modules/polygon")
const cheerio = require("cheerio")

class User {
    #_credentials
    constructor(username, password, totp) {
        this.#_credentials = { username, password, totp }
    }

    #refreshCsrf() {
        return new Promise(resolve => {
            polygon.get("/home").then(() => resolve(true))
        })
    }

    login() {
        return new Promise((resolve, reject) => {
            const data = new URLSearchParams()
            data.append("username", this.#_credentials.username)
            data.append("password", this.#_credentials.password)

            polygon.post("/login", data).then((response) => {
                if (response.status == 302) return resolve(true)
                resolve(false)
            }).catch(e => reject(e))
        })
    }

    logout() {
        return new Promise(async (resolve, reject) => {
            polygon.get("/logout").then((response) => {
                if (response.status == 200) return resolve(true)
                resolve(false)
            }).catch(e => reject(e))
        })
    }

    setStatus(text) {
        return new Promise(async (resolve, reject) => {
            this.#refreshCsrf().then(() => {
                const data = new URLSearchParams()
                data.append("status", text)
    
                polygon.post("/api/account/update-status", data).then((response) => {
                    if (response.status !== 200) return resolve(false)
                    resolve(response.data.success)
                }).catch(e => reject(e))
            })
        })
    }

    info() {
        return new Promise(async (resolve, reject) => {
            let info = { username: "", id: 0, currency: 0 }

            polygon.get("/user").then((response) => {
                if (response.status !== 200) return resolve(false)
                const $ = cheerio.load(response.data)
                const link = $(`a[class="nav-link mr-2"]`)
                info.username = link.text()
                info.id = new URL(`https://polygon.pizzaboxer.xyz${link.attr("href")}`).searchParams.get("ID")
            }).catch(e => reject(e))

            api.get("/currency/balance").then((response) => {
                if (response.status !== 200) return resolve(false)
                info.currency = response.data[Object.keys(response.data)[0]]
                resolve(info)
            }).catch(e => reject(e))
        })
    }

    ping() {
        return new Promise(async (resolve, reject) => {
            this.#refreshCsrf().then(() => {
                polygon.post("/api/account/update-ping").then((response) => {
                    if (response.status !== 200) return resolve(false)
                    resolve({ success: response.data.success, friendRequests: response.data.friendRequests })
                }).catch(e => reject(e))
            })
        })
    }

    friendRequests() {
        return new Promise(async (resolve, reject) => {
            this.#refreshCsrf().then(() => {
                polygon.post("/api/account/update-ping").then((response) => {
                    if (response.status !== 200) return resolve(false)
                    resolve(response.data.friendRequests)
                }).catch(e => reject(e))
            })
        })
    }
}

module.exports = User