const multer = require("multer");
const path = require("path");
const {v4: uuid4 } = require("uuid");
const fs = require("fs");



function criarUpload(tiposPermitidos) {
    
    const storage = multer.diskStorage({
    
    destination: (req, file, callback)=> {
        
        const dir = "tmp/uploads";
        


        if (!fs.existsSync(dir)) {

            fs.mkdirSync(dir, {recursive: true});
        }
        
        callback(null, dir );
        
    },
    
    filename: (req, file, callback) => {
        
        const extensao = path.extname(file.originalname);
        const nomeArquivo = uuid4() + extensao ;
        callback(null, nomeArquivo);
    }
});


const fileFilter = (req, file, callback) => {
    
       /*const tiposPermitidos = [
           "image/jpeg",
           "image/png",
           "image/jpg",
           "image/webp"
       ];*/
       
       if (tiposPermitidos.includes(file.mimetype)) {
           
           callback(null, true);
           
       } else {
           
           callback(new Error("Tipo de arquivo não permitido"));
       }
}



const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 52 * 1024 * 1024
    }
});
    
   return upload; 
    
}


module.exports = criarUpload;




