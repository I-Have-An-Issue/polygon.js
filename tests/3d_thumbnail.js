const { username, password } = require("../creds.json")
const Polygon = require("../src")
const client = new Polygon.Client(username, password)

;(async () => {
    if (!(await client.login())) return console.log(`[x] Login failed!`)
    console.log(`[✓] Login success: ${client.username} (${client.id})`)

    console.log(`[?] Waiting 5 seconds.`)
    await new Promise(resolve => setTimeout(resolve, 5000))

    const model = await client.three_d()
    model ? console.log(`[✓] Model: https://polygoncdn.pizzaboxer.xyz/${model.obj}`) : console.log(`[x] Model failed!`)

    await client.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()