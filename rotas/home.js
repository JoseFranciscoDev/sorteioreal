const express = require("express");
const router = express.Router();
const Home = require("../controle/Home.js");
router.get("/home",Home.index);
router.get("/home/sair",Home.sair);

module.exports = router;


