const { username, password } = require("./creds.json")
const Polygon = require("../src")
const client = new Polygon.Client(username, password)

const status = "Dis is pretty cool"

;(async () => {
    if (!(await client.login())) return console.log(`[x] Login failed!`)
    const info = await client.info()
    console.log(`[✓] Login success: ${info.username} (${info.id})`)

    console.log(`[?] Setting status to: ${status}`)
    await client.setStatus(status)

    await client.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()