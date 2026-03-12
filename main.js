const express = require("express");
const app = express();
const {PORT,BASE_URL} = require("./configs.json");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const path = require("path");
const routerIndex = require("./rotas/index.js");
const routerHome = require("./rotas/home.js");
const routerPedido = require("./rotas/pedido.js");
const routerCupom = require("./rotas/cupom.js");
const UsuarioDao = require("./modelo/UsuariosDao.js");
const CupomDao = require("./modelo/CupomDao.js");
const CuponsClientesDao = require("./modelo/CuponsClientesDao.js");
const cors = require("cors");

app.use(cors({
    origen: "*"
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
    name:"real_bingo",
    secret:"shopping_real_real_bingo",
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(express.static(path.resolve(__dirname,"./public")));

nunjucks.configure(path.resolve(__dirname,"./views"),{autoescape:true, express:app});

app.use(BASE_URL,routerIndex);
app.use(BASE_URL,routerHome);
app.use(BASE_URL,routerPedido);
app.use(BASE_URL,routerCupom);
















app.listen(PORT, async ()=>{
    await UsuarioDao.criarTabela();
    await CupomDao.criarTabela();
    await CuponsClientesDao.criarTabela();
    console.log("Servidor rodando na porta: " + PORT);
});









