const express = require("express");
const router = express.Router();
const Autenticacao =require("../controle/Autenticacao.js");


router.get("/", Autenticacao.index);
router.post("/",Autenticacao.login);




module.exports = router;


