const express = require("express");
const router = express.Router();
const { uploadArquivos } = require("../middlewares//Uploads.js");
const ClienteNegativadoProtesto = require("../controle/ClienteNegativadoProtestado.js");


const clienteNegativadoProtesto = new ClienteNegativadoProtesto();


router.get("/conciliacao/negativados", (req, res) => clienteNegativadoProtesto.listarNegativados(req, res));

router.post("/conciliacao/negativados", uploadArquivos.array("arquivos", 1),
    (req, res) => clienteNegativadoProtesto.uploads(req, res));




module.exports = router;

