const { username, password } = require("./creds.json")
const Polygon = require("../src")
const user = new Polygon.User(username, password)

;(async () => {
    if (!(await user.login())) return console.log(`[x] Login failed!`)
    const info = await user.info()
    console.log(`[✓] Login success: ${info.username} (${info.id})`)

    const balance = await user.currency()
    balance ? console.log(`[✓] ${balance} Pizzas`) : console.log(`[x] Cannot get balance!`)

    await user.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()