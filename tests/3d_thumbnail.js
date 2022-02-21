const { username, password } = require("./creds.json")
const Polygon = require("../src")
const client = new Polygon.Client(username, password)

;(async () => {
    if (!(await client.login())) return console.log(`[x] Login failed!`)
    console.log(`[✓] Login success: ${client.username} (${client.id})`)

    console.log(`[?] Waiting 5 seconds.`)
    await new Promise(resolve => setTimeout(resolve, 5000))

    const model = await client.three_d()
    model ? console.log(`[✓] Model: https://polygoncdn.pizzaboxer.xyz/${model.obj}`) : console.log(`[x] Model failed!`)

    const obj = await client.obj()
    obj ? console.log(`[✓] OBJ!`) : console.log(`[x] OBJ failed!`)

    const mtl = await client.mtl()
    mtl ? console.log(`[✓] MTL!`) : console.log(`[x] MTL failed!`)

    await client.logout() ? console.log(`[✓] Logout success!`) : console.log(`[x] Logout failed!`)
})()