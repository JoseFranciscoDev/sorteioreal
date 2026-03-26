const express = require("express");
const router = express.Router();
const  upload = require("../middlewares/Uploads.js");
const UploadsController = require("../controle/UploadsController.js");
const UploadsService = require("../services/UploadsService.js"); 
const UploadsDao = require("../modelo/UploadsDao.js");
const conexao = require("../databases/conexao.js");
const conexaoAWS = require("../databases/ConexaoNerusAWS");

const uploadsDao = new UploadsDao(conexao, conexaoAWS);

const uploadsService = new UploadsService(uploadsDao);

const uploadsController = new UploadsController(uploadsService);



router.get("/produtos", (req, res) => uploadsController.listarProdutos(req, res));
router.get("/produtos/:codigo", (req, res) => uploadsController.detalhesProduto(req, res));
router.post("/uploads", upload.array("imagens", 10), (req, res) => uploadsController.uploads(req, res));
router.get("/uploads", (req, res) => uploadsController.uploadsImagens(req, res));


module.exports = router;


