const { BASE_URL, AUTORIZACAO } = require("../configs.json");
const Usuario = require("../modelo/UsuariosDao.js");
class Home {
    static urls() {
        return [
            {
                url: `${BASE_URL}/cliente`,
                clase: "bx bxs-user icon",
                nome: "Cadastro de Cliente"
            },
            {
                url: `${BASE_URL}/uploads`,
                clase: "bx bxs-image icon",
                nome: "Upload de Imagens"
            },
            {
                url: `${BASE_URL}/produtos`,
                clase: "bx bxs-image icon",
                nome: "Catalogo de Produtos"
            },
            {
                url: `${BASE_URL}/cliente/todos`,
                clase: "bx bxs-user icon",
                nome: "Clientes Cadastrados"
            },
            {
                url: `${BASE_URL}/home/sair`,
                clase: "bx bx-log-out icon",
                nome: "Sair"
            },
        ]
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
            },
            {
                url: `${BASE_URL}/cliente`,
                clase: "bx bxs-user icon",
                nome: "Cadastro de Cliente"
            },
            {
                url: `${BASE_URL}/cliente/todos`,
                clase: "bx bxs-user icon",
                nome: "Clientes Cadastrados"
            },
            {
                url: `${BASE_URL}/produtos`,
                clase: "bx bxs-image icon",
                nome: "Catalogo de Produtos"
            },
            {
                url: `${BASE_URL}/uploads`,
                clase: "bx bxs-image icon",
                nome: "Upload de Imagens"
            },
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
        if (req.session.usuario && req.session.usuario.tipo == AUTORIZACAO.normal) {
            const urls = Home.urls();
            res.render("home.html", { links: [urls[0], urls[3]], links2: [urls[4]] });
        }
        if (req.session.usuario && req.session.usuario.tipo == AUTORIZACAO.admin_vend) {
            const urls = Home.urls();
            res.render("home.html", { links: [urls[0], urls[1], urls[3]], links2: [urls[4]] });
        }
        if (req.session.usuario && req.session.usuario.tipo == AUTORIZACAO.admin) {
            const { links, links2 } = Home.urlsAdm();
            res.render("home.html", { links, links2 })
        }
        if (req.session.usuario && req.session.usuario.tipo == AUTORIZACAO.caixa) {
            const { links, links2 } = Home.urlsAdm();
            console.log(links)
            res.render("home.html", { links: [links[0], links[4], links[5]], links2: [links2[1]] })
        }
    }

    static sair(req, res) {

        req.session = null;

        res.redirect(`${BASE_URL}/`);
    }
    static criarUsuario(req, res) {
        res.render("CriarUsuario.njk", { url: `${BASE_URL}/` });
    }

    static async criarUsuarioPost(req, res) {
        if (!req.session.usuario || !req.session.usuario.tipo) {
            return res.redirect(`${BASE_URL}/`);
        }
        const { nome, snome, email, senha, tipo } = req.body;
        const usuario = { nome, snome, email, senha, tipo };
        try {
            await Usuario.setUsuario(usuario);
            res.redirect(`${BASE_URL}/administracao/usuarios`);
        } catch (erro) {
            res.render("CriarUsuario.njk", { url: `${BASE_URL}/`, mensagem: erro.message });
        }
    }
}


module.exports = Home;


