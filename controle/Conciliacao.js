const { BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar.js");
const ConciliacaoDao = require("../modelo/ConciliacaoDao.js");
const ClienteNerusDao = require("../modelo/ClienteNerusDao.js")
const fs = require("fs");
const path = require("path");
const NullSeVazio = require("../utilitarios/NullSeVazio.js")
const Data = require("../utilitarios/Data.js")

class Conciliacao {

    static cadastroVeiculos(req, res) {
        const modulos = NavBar.getModulos();
        res.render("conciliacao/cadastroVeiculos.njk", { modulos, BASE_URL });
    }
    static async cadastroVeiculosPost(req, res) {
        const modulos = NavBar.getModulos();
        console.log(req.body)
        const novoVeiculo = {
            nome: req.body.nomeVeiculo,
            modelo: req.body.modelo,
            cor: req.body.cor,
            placa: req.body.placa,
            chassi: req.body.chassi
        };
        try {
            await ConciliacaoDao.setVeiculo(novoVeiculo);
            res.redirect(`${BASE_URL}/conciliacao/cadastro/veiculos`);
        } catch (erro) {
            console.error("[Conciliacao] Erro ao cadastrar veículo:", erro.message);
            res.render("conciliacao/cadastroVeiculos.njk", {
                modulos,
                BASE_URL,
                erro: "Não foi possível cadastrar o veículo. Verifique se placa, chassi ou nome já estão cadastrados."
            });
        }
    }


    static async cadastroRota(req, res) {
        const mensagem = req.query.mensagem;
        const modulos = NavBar.getModulos();
        return res.render("conciliacao/cadastroRota.njk", { modulos, BASE_URL, mensagem });
    }

    static async cadastroRotaPost(req, res) {
        const novaRota = req.body
        novaRota.codigoCobrador = req.session.usuario.usuario
        try {
            await ConciliacaoDao.setRota(novaRota)
            return res.redirect("rota");
        }
        catch (erro) {
            if (erro.code == 'ER_DUP_ENTRY') {
                const mensagem = "Rota de mesmo nome cadastrada"
                return res.redirect(BASE_URL + "/conciliacao/cadastro/rota?mensagem=" + mensagem)
            }
            return res.redirect(BASE_URL + "/conciliacao/cadastro/rota?mensagem=" + erro)
        }
    }

    static async cadastroVisita(req, res) {
        const modulos = NavBar.getModulos();
        const cobrador = req.session.usuario.codigo;
        const mensagem = req.query.mensagem;
        console.log(mensagem)
        const veiculos = await ConciliacaoDao.getVeiculos();
        const rotas = await ConciliacaoDao.getRotas();
        res.render("conciliacao/cadastroVisita.njk", { modulos, BASE_URL, cobrador, veiculos, rotas });
    }

    static async cadastroVisitaPost(req, res) {
        try {
            const dados = NullSeVazio(req.body);
            const resultado = await ConciliacaoDao.setVisita(dados);
            const visitaId = resultado.insertId;

            const arquivos = req.files

            const fotoResidArquivo = arquivos?.foto_resid?.[0] ?? null;
            const fotoDocArquivo = arquivos?.foto_doc?.[0] ?? null;

            let fotoResidenciaUrl = null;
            let fotoDocUrl = null;

            if (fotoResidArquivo || fotoDocArquivo) {
                const pastaDestino = path.resolve("public", "visitas", visitaId.toString());
                if (!fs.existsSync(pastaDestino)) {
                    fs.mkdirSync(pastaDestino, { recursive: true });
                }

                if (fotoResidArquivo) {
                    const destino = path.resolve(pastaDestino, fotoResidArquivo.filename);
                    fs.renameSync(fotoResidArquivo.path, destino);
                    fotoResidenciaUrl = `visitas/${visitaId}/${fotoResidArquivo.filename}`;
                }

                if (fotoDocArquivo) {
                    const destino = path.resolve(pastaDestino, fotoDocArquivo.filename);
                    fs.renameSync(fotoDocArquivo.path, destino);
                    fotoDocUrl = `visitas/${visitaId}/${fotoDocArquivo.filename}`;
                }
                await ConciliacaoDao.updateFotosVisita(visitaId, { fotoResidenciaUrl, fotoDocUrl });
            }
            if (req.body.pg_contrato) {
                const novoPagamento = {
                    contrato: req.body.pg_contrato,
                    codigoVisita: visitaId,
                    parcelas: req.body.pg_parcelas,
                    valor: req.body.pg_valor
                };
                ConciliacaoDao.setPagamento(novoPagamento);
            }
            if (req.body.nc_contrato) {
                const renegociacao = {
                    codigoVisita: visitaId,
                    contrato: req.body.nc_contrato,
                    parcelas: req.body.nc_parcelas,
                    valor: req.body.nc_valor
                }
                ConciliacaoDao.setRenegociacao(renegociacao);
            }

            return res.redirect("visita?mensagem=Visita Cadastrada");

        } catch (erro) {
            console.log(erro);
            console.log(req.body);
            return res.redirect("visita?mensagem=Erro: " + erro);
        }
    }

    static async visualizar(req, res) {
        const modulos = NavBar.getModulos();
        const { page = 1, porPagina = 10 } = req.query
        const offset = (page - 1) * porPagina
        const veiculos = await ConciliacaoDao.getVeiculos()

        const rotas = await ConciliacaoDao.getRotas(offset, porPagina)
        res.render("conciliacao/visualizarRotas.njk", { modulos, BASE_URL, veiculos, rotas });
    }

    static async visualizarVisitas(req, res) {
        const modulos = NavBar.getModulos();
        const rotaId = req.params.codigo;

        const visitas = await ConciliacaoDao.getVisitasPorCodigoRota(rotaId);
        const codigosClientes = visitas.map(visita => visita.codigoCliente);
        const clientes = await ClienteNerusDao.getClientes(codigosClientes);

        const clienteMap = new Map();
        clientes.forEach(cliente => {
            clienteMap.set(cliente.codigo, cliente);
        });

        visitas.forEach(visita => {
            const cliente = clienteMap.get(visita.codigoCliente);
            if (cliente) {
                visita.nomeCliente = cliente.nome;
            }
        });
        res.render("conciliacao/visualizarVisitas.njk", { modulos, BASE_URL, visitas, rotaId });
    }

    static async detalheVisita(req, res) {
        const modulos = NavBar.getModulos();
        const codigoVisita = req.params.codigo;

        const visita = await ConciliacaoDao.getVisitaPorCodigo(codigoVisita);
        visita.data = Data.dataParaTexto(visita.data)
        if (!visita) {
            return res.status(404).render("erro404ou500.njk", { modulos, BASE_URL });
        }

        const clientes = await ClienteNerusDao.getClientes([visita.codigoCliente]);
        if (clientes && clientes.length > 0) {
            visita.nomeCliente = clientes[0].nome;
        }

        res.render("conciliacao/detalheVisita.njk", { modulos, BASE_URL, visita });
    }
}

module.exports = Conciliacao;