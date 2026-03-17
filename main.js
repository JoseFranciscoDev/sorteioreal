const express = require("express");
const app = express();
const { PORT, BASE_URL } = require("./configs.json");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const path = require("path");
const routerIndex = require("./rotas/index.js");
const routerHome = require("./rotas/home.js");
const routerPedido = require("./rotas/pedido.js");
const routerCupom = require("./rotas/cupom.js");
const routerConfiguracoes = require("./rotas/configuracoes.js");
const routerAdministracao = require("./rotas/administracao.js");
const routerCatalogo = require("./rotas/catalogo.js");
const routerCliente = require("./rotas/cliente.js");
const verificaConfig = require("./middlewares/verificaConfig.js");
const UsuarioDao = require("./modelo/UsuariosDao.js");
const CupomDao = require("./modelo/CupomDao.js");
const CuponsClientesDao = require("./modelo/CuponsClientesDao.js");
const cors = require("cors");
const AbstractNerusAWS = require("./modelo/AbstractNerusAWS.js");
const conexaoLocal = require("./modelo/AbstractUsuarios.js");
const ProdutoImagemDao = require("./modelo/ProdutoImagemDao");
const ClienteDao = require("./modelo/ClienteDao.js");
const conexao = require("./databases/conexao.js");

app.use(cors({
    origen: "*"
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name: "real_bingo",
    secret: "shopping_real_real_bingo",
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(express.static(path.resolve(__dirname, "./public")));

nunjucks.configure(path.resolve(__dirname, "./views"), { autoescape: true, express: app });

app.use(BASE_URL, routerIndex);
app.use(BASE_URL, routerCliente);

app.use(BASE_URL, routerConfiguracoes);

app.use(BASE_URL, verificaConfig, routerHome);
app.use(BASE_URL, verificaConfig, routerPedido);
app.use(BASE_URL, verificaConfig, routerCupom);
app.use(BASE_URL, verificaConfig, routerAdministracao);
app.use(BASE_URL, routerCatalogo);

app.listen(PORT, async () => {
    const conn = await conexao();
    await AbstractNerusAWS.connection();
    await conexaoLocal.connection();
    await UsuarioDao.criarTabela();
    await CupomDao.criarTabela();
    await CuponsClientesDao.criarTabela();
    await ProdutoImagemDao.criarTabela(conn);
    await ClienteDao.criarTabela();
    console.log("Servidor rodando na porta: " + PORT);
});









