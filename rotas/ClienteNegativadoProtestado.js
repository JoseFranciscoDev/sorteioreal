const express = require("express");
const router = express.Router();
const {uploadArquivos} = require("../middlewares//Uploads.js");
const ClienteNegativadoProtesto = require("../controle/ClienteNegativadoProtestado.js");
const lerArquvio = require("../utilitarios/LerArquivo.js");

const clienteNegativadoProtesto = new ClienteNegativadoProtesto();


router.post("/negativados", uploadArquivos.array("arquivos", 1),
                             (req, res) => clienteNegativadoProtesto.uploads(req, res));




module.exports = router;

