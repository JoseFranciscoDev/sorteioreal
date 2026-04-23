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
const routerCliente = require("./rotas/cliente.js");
const routerConciliacao = require("./rotas/conciliacao.js");
const verificaConfig = require("./middlewares/verificaConfig.js");
const vericaEAdmin = require("./middlewares/vericaEAdmin.js");
const estaLogado = require("./middlewares/estaLogado.js");
const UsuarioDao = require("./modelo/UsuariosDao.js");
const CupomDao = require("./modelo/CupomDao.js");
const CuponsClientesDao = require("./modelo/CuponsClientesDao.js");
const ConciliacaoDao = require("./modelo/ConciliacaoDao.js")
const cors = require("cors");
const AbstractNerusAWS = require("./modelo/AbstractNerusAWS.js");
const conexaoLocal = require("./modelo/AbstractUsuarios.js");
const ClienteDao = require("./modelo/ClienteDao.js");
const UploadsDao = require("./modelo/UploadsDao.js");
const conexao = require("./databases/conexao.js");
const uploadRouter = require("./rotas/uploads.js");

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
app.use(BASE_URL, estaLogado, verificaConfig, routerCliente);

app.use(`${BASE_URL}/configuracoes`, vericaEAdmin, routerConfiguracoes);

app.use(BASE_URL, estaLogado, verificaConfig, routerHome);
app.use(BASE_URL, estaLogado, verificaConfig, routerPedido);
app.use(BASE_URL, estaLogado, verificaConfig, routerCupom);
app.use(`${BASE_URL}/administracao`, verificaConfig, routerAdministracao);
app.use(BASE_URL, estaLogado, verificaConfig, uploadRouter);
app.use(BASE_URL, estaLogado, routerConciliacao);

app.listen(PORT, async () => {
    await AbstractNerusAWS.connection();
    await conexaoLocal.connection();
    await UsuarioDao.criarTabela();
    await CupomDao.criarTabela();
    await CuponsClientesDao.criarTabela();
    await ClienteDao.criarTabela();
    await UploadsDao.criarTabela(conexao);
    await ConciliacaoDao.criarTodasTabelasConciliacao()
    console.log("Servidor rodando na porta: " + PORT);
});