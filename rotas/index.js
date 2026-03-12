const express = require("express");
const router = express.Router();
const Usuario =require("../controle/Usuario.js");


router.get("/", Usuario.index);
router.post("/",Usuario.login);




module.exports = router;


