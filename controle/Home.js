const { BASE_URL } = require("../configs.json");
const Usuario = require("../modelo/UsuariosDao.js");
class Home {
    static urls() {
        return [
            {
                url: `${BASE_URL}/home/pedido`,
                clase: "bx bx-plus-circle icon",
                nome: "Modulo de Sorteio"
            },
            {
                url: `${BASE_URL}/home/sair`,
                clase: "bx bx-log-out icon",
                nome: "Sair"
            }
        ];

    }
    static urlsAdm() {
        const links = [
            {
                url: `${BASE_URL}/home/pedido`,
                clase: "bx bx-plus-circle icon",
                nome: "Modulo de Sorteio"
            },
            {
                url: `${BASE_URL}/home/relatorios`,
                clase: "bx bxs-pie-chart-alt-2 icon",
                nome: "Relatórios"
            },
            {
                url: `${BASE_URL}/home/blackList`,
                clase: "bx bx-block icon",
                nome: "Black List"
            },
            {
                url: `${BASE_URL}/administracao`,
                clase: "bx bxs-user icon",
                nome: "Administração"
            }
        ];

        const links2 = [
            {
                url: `${BASE_URL}/home/configuracoes`,
                clase: "bx bx-cog icon",
                nome: "Configurações"
            },
            {
                url: `${BASE_URL}/home/sair`,
                clase: "bx bx-log-out icon",
                nome: "Sair"
            }
        ];

        return { links, links2 };
    }
    static index(req, res) {
        console.log(req.session.usuario);
        if (!req.session.usuario.tipo) {
            const urls = Home.urls();
            res.render("home.html", { links: [urls[0]], links2: [urls[1]] });
        } else {
            const { links, links2 } = Home.urlsAdm();
            res.render("home.html", { links, links2 });
        }
    }

    static sair(req, res) {

        req.session = null;

        res.redirect(`${BASE_URL}/`);
    }
    static criarUsuario(req, res) {
        res.render("CriarUsuario.njk", { url: `${BASE_URL}/` });
    }

    static criarUsuarioPost(req, res) {
        if (!req.session.usuario.tipo) {
            res.redirect(`${BASE_URL}/`);
            const { nome, snome, email, senha, tipo } = req.body;
            const usuario = { nome, snome, email, senha, tipo };
            try {
                Usuario.setUsuario(usuario);
                res.redirect(`${BASE_URL}/`);
            } catch (erro) {
                res.render("CriarUsuario.njk", { url: `${BASE_URL}/`, mensagem: erro.message });
            }
        }
    }
}


module.exports = Home;


