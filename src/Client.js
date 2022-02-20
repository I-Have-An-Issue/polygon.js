const User = require("./User")
const { polygon, api } = require("./modules/polygon")
const cheerio = require("cheerio")

class Client extends User {
    #_credentials
    constructor(username, password) {
        super()
        this.#_credentials = { username, password }
        this.username = username
        this.id = null
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
                if (response.status !== 302) return resolve(false)

                polygon.get("/user").then((response) => {
                    if (response.status !== 200) return resolve(false)
                    const $ = cheerio.load(response.data)
                    const link = $(`a[class="nav-link mr-2"]`)
                    this.id = new URL(`https://polygon.pizzaboxer.xyz${link.attr("href")}`).searchParams.get("ID")
                    resolve(true)
                }).catch(e => reject(e))
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

    currency() {
        return new Promise(async (resolve, reject) => {
            api.get("/currency/balance").then((response) => {
                if (response.status !== 200) return resolve(false)
                resolve(response.data[Object.keys(response.data)[0]])
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

module.exports = Client