/**
 * Please use Polygon.Client() instead of Polygon.User()
 * @deprecated
 */
class User {
    constructor() {
        throw new Error("Please use Polygon.Client() instead of Polygon.User()")
    }
}

module.exports = {
    Client: require("./Client"),
    User
}