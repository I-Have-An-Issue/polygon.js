const { username, password } = require("./creds.json")
const Polygon = require("../src")
const client = new Polygon.Client(username, password)

;(async () => {
    if (!(await client.login())) return console.log(`[x] Login failed!`)
    console.log(`[✓] Login success: ${client.username} (${client.id})`)

    console.log(`[?] Waiting 5 seconds.`)
    await new Promise(resolve => setTimeout(resolve, 5000))

    const thumb = await client.thumbnail()
    thumb ? console.log(`[✓] Thumbnail: ${thumb}`) : console.log(`[x] Thumbnail failed!`)

    await client.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()