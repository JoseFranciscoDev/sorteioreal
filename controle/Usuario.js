const UsuarioDao = require("../modelo/UsuariosDao.js");
const {BASE_URL} = require("../configs");

class Usuario {
    
 static async  index(req, res) {
    
     res.render("index.html",{url:`${BASE_URL}/`, mensagem:""});
 }
 
 static async login(req,res) {
     try {
        const usuario = req.body;
        const [resultado] = await UsuarioDao.getUsuarios(usuario.nome);
        if (!resultado) {
            throw new Error("Usuario e Senha Incorretos!");
        }
        
        if (resultado.snome != usuario.nome || resultado.senha != usuario.senha) {
            
                throw new Error("Usuario e Senha Incorretos!");
            
        }
        req.session.usuario = {codigo:resultado.codigo, tipo: resultado.tipo};
       res.redirect(`${BASE_URL}/home`);
     }catch(erro) {
         res.render("index.html", {url:`${BASE_URL}/`, mensagem:erro.message});
     }
     
     
     
     
 }
    
    
}

module.exports = Usuario;


