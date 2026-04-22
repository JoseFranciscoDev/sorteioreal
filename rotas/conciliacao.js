const express = require("express");
const router = express.Router();
const NavBar = require("../utilitarios/NavBar");
const { BASE_URL } = require("../configs.json")


router.get("/conciliacao/cadastro/veiculos", (req, res) => {
    const modulos = NavBar.getModulos()
    res.render("conciliacao/cadastroVeiculos.njk", { modulos, BASE_URL });
})

router.get("/conciliacao/cadastro/visita", (req, res) => {
    const modulos = NavBar.getModulos()
    const cobrador = req.session.usuario.codigo;
    res.render("conciliacao/cadastroVisita.njk", { modulos, BASE_URL, cobrador });
})

router.get("/conciliacao/cadastro/corrida", (req, res) => {
    const modulos = NavBar.getModulos()
    res.render("conciliacao/cadastroCorrida.njk", { modulos, BASE_URL });
})

router.post("/conciliacao/cadastro/visita", (req, res) => {
    console.log(req.body)
    res.send(req.body);
})

router.get("/conciliacao/visualizar", (req, res) => {
    const modulos = NavBar.getModulos();
    
    // Dados Mockados
    const veiculos = [
        { id: 1, placa: "ABC-1234", modelo: "Honda CG 160", tipo: "Moto", kmAtual: "12.500" },
        { id: 2, placa: "XYZ-9876", modelo: "Fiat Uno M", tipo: "Carro", kmAtual: "145.000" }
    ];

    const visitas = [
        { id: 1, data: "15/04/2026", cobrador: "João Silva", saida: "08:00", retorno: "12:00", veiculo: "ABC-1234", totalCorridas: 3 },
        { id: 2, data: "15/04/2026", cobrador: "Maria Souza", saida: "13:30", retorno: "18:00", veiculo: "XYZ-9876", totalCorridas: 5 }
    ];

    res.render("conciliacao/visualizarVisitas.njk", { modulos, BASE_URL, veiculos, visitas });
});

router.get("/conciliacao/visitas/:id/corridas", (req, res) => {
    const modulos = NavBar.getModulos();
    const visitaId = req.params.id;

    // Dados Mockados
    const visita = { id: visitaId, data: "15/04/2026", cobrador: "João Silva", veiculo: "ABC-1234" };

    const corridas = [
        { id: 101, horario: "08:30", cliente: "Cod: 12345", endereco: "Rua das Flores, 123", encontrado: "Sim", renegociado: "Não", pagou: "Não", valor: "0,00" },
        { id: 102, horario: "09:15", cliente: "Cod: 67890", endereco: "Av. Principal, 456", encontrado: "Sim", renegociado: "Sim", pagou: "Sim", valor: "150,00" },
        { id: 103, horario: "10:00", cliente: "Cod: 54321", endereco: "Beco Escuro, 78", encontrado: "Não", renegociado: "Não", pagou: "Não", valor: "0,00" },
    ];

    res.render("conciliacao/visualizarCorridas.njk", { modulos, BASE_URL, visita, corridas });
});

module.exports = router;