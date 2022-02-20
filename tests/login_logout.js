const { username, password } = require("./creds.json")
const Polygon = require("../src")
const user = new Polygon.User(username, password)

;(async () => {
    if (!(await user.login())) return console.log(`[x] Login failed!`)
    const info = await user.info()
    console.log(`[✓] Login success: ${info.username} (${info.id}), ${info.currency} Pizzas`)

    console.log(`[?] Waiting 5 seconds.`)
    await new Promise(resolve => setTimeout(resolve, 5000))

    const ping = await user.ping()
    ping ? console.log(`[✓] Friend requests: ${ping.friendRequests}`) : console.log(`[x] Ping failed!`)

    await user.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()