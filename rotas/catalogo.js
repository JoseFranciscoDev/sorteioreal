const express = require("express");
const router = express.Router();
router.get("/catalogo", (req, res) => {
    res.json({ "msg": "Ola mundo" })
});

module.exports = router;


