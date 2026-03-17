class CatalogoController {
    
    constructor(catalogoService) {
        this.catalogoService = catalogoService;
    }
    
    async uploadImagens(req, res) {
        try {
            const codigoProduto = req.body.codigo_produto;
            const usuario = req.session.usuario;
            const arquivos = req.files;
            
            
            if(!usuario) return res.redirect("/login");
            
            
            if (!codigoProduto) {
                return res.render("catalogo", {
                    erro: "Codigo do produto é obrigatorio"
                });
            }
            
            
            if (!arquivos || arquivos.length == 0) {
                return res.render("catalogo", {
                    erro: "Nenhuma imagem enviada"
                });
            }
            
            
            await this.catalogoService.uploadImagens(
                    codigoProduto, usuario, arquivos);
            
            
            return res.redirect("/catalogo");
        } catch(erro) {
            
            console.error(erro);
            
            return res.render("catalogo", {
                erro: "Erro ao enviar imagens"
            });
        }
        
    }
}


module.exports = CatalogoController;