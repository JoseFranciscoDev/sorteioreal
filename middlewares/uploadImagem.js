const multer = require("multer");
const path = require("path");



const storage = multer.diskStorage({
    
    destination: (req, file, callback)=> {
        callback(null, "tmp/uploads");
        
    },
    
    filename: (req, file, callback) => {
        
        const extensao = path.extname(file.originalname);
        const nomeArquivo = Date.now() + extensao ;
        callback(null, nomeArquivo);
    }
});


const fileFilter = (req, file, callback) => {
    
       const tiposPermitidos = [
           "image/jpeg",
           "image/png",
           "image/jpg",
           "image/webp"
       ];
       
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

module.exports = upload;




