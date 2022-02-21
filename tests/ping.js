const { username, password } = require("./creds.json")
const Polygon = require("../src")
const client = new Polygon.User(username, password)

;(async () => {
    if (!(await client.login())) return console.log(`[x] Login failed!`)
    console.log(`[✓] Login success: ${client.username} (${client.id})`)

    console.log(`[?] Waiting 5 seconds.`)
    await new Promise(resolve => setTimeout(resolve, 5000))

    const ping = await client.ping()
    ping ? console.log(`[✓] Friend requests: ${ping.friendRequests}`) : console.log(`[x] Ping failed!`)

    await client.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()