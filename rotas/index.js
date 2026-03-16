const express = require("express");
const router = express.Router();
const Autenticacao = require("../controle/Autenticacao.js");


router.get("/", Autenticacao.index);
router.post("/", Autenticacao.login);
router.get("/erro404", (req, res) => {
    res.render("erro404ou500.njk");
});



module.exports = router;


