const express = require("express");
const router = express.Router();
const  upload = require("../middlewares/Uploads.js");
const UploadsController = require("../controle/UploadsController.js");
const UploadsService = require("../services/UploadsService.js"); 
const UploadsDao = require("../modelo/UploadsDao.js");
const conexao = require("../databases/conexao.js");

const uploadsDao = new UploadsDao(conexao);

const uploadsService = new UploadsService(uploadsDao);

const uploadsController = new UploadsController(uploadsService);

router.post("/uploads", upload.array("imagens", 10), (req, res)=> uploadsController.uploads(req, res));
router.get("/uploads", (req, res)=> uploadsController.uploadsImagens(req, res));


module.exports = router;


