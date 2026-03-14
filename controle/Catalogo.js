const { BASE_URL } = require("../configs.json");

class Catalogo {
    static index(req, res) {
        res.render("catalogo.njk", { url: `${BASE_URL}/` });
    }
}

module.exports = Catalogo;