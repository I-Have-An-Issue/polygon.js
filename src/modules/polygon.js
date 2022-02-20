const axios = require("axios")
const axiosDefaults = require("axios/lib/defaults")
const cheerio = require("cheerio")
const parse_cookie = require("./set-cookie-parser")

let csrf = false
let session = false

const options = {
    headers: { "User-Agent": `polygon.js/${require("../../package.json").version} (https://github.com/I-Have-An-Issue/polygon.js)` },
    validateStatus: false,
    maxRedirects: 0
}

const polygon = axios.create(Object.assign(options, {
    baseURL: "https://polygon.pizzaboxer.xyz",
    transformResponse: [(data) => {
        const $ = cheerio.load(data)
        const content = $(`meta[name="polygon-csrf"]`).attr("content")
        if (content) csrf = content
        return data
    }, ...axiosDefaults.transformResponse],
}))

polygon.interceptors.request.use((config) => {
    if (csrf) config.headers["x-polygon-csrf"] = csrf
    if (session) config.headers["Cookie"] = `polygon_session=${session}`
    return config
}, (error) => { return Promise.reject(error) })

polygon.interceptors.response.use(async (response) => {
    const cookie = parse_cookie(response.headers["set-cookie"])
    const value = cookie.find(_ => _.name == "polygon_session")?.value
    if (value) session = value
    return response
}, (error) => { return Promise.reject(error) })

const api = axios.create(Object.assign(options, { baseURL: "https://polygonapi.pizzaboxer.xyz" }))

api.interceptors.request.use((config) => {
    if (session) config.headers["Cookie"] = `polygon_session=${session}`
    return config
}, (error) => { return Promise.reject(error) })

module.exports = { polygon, api }