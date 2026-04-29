const { BASE_URL } = require("../configs.json");
const NavBar = require("../utilitarios/NavBar.js");
const ConciliacaoDao = require("../modelo/ConciliacaoDao.js");
const fs = require("fs");
const path = require("path");


function nullifyEmpty(obj) {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v])
    );
}

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
        const cobrador = req.session.usuario.codigo
        const veiculos = await ConciliacaoDao.getVeiculos()
        const rotas = await ConciliacaoDao.getRotas()
        res.render("conciliacao/cadastroVisita.njk", { modulos, BASE_URL, cobrador, veiculos, rotas });
    }

    static async cadastroVisitaPost(req, res) {
        try {
            const dados = nullifyEmpty(req.body);

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

        // Dados Mockados
        const veiculos = await ConciliacaoDao.getVeiculos()
        console.log(veiculos)

        const visitas = [
            { id: 1, data: "15/04/2026", cobrador: "João Silva", saida: "08:00", retorno: "12:00", veiculo: "ABC-1234", totalCorridas: 3 },
            { id: 2, data: "15/04/2026", cobrador: "Maria Souza", saida: "13:30", retorno: "18:00", veiculo: "XYZ-9876", totalCorridas: 5 }
        ];

        res.render("conciliacao/visualizarVisitas.njk", { modulos, BASE_URL, veiculos, visitas });
    }

    static visualizarCorridas(req, res) {
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
    }
}

module.exports = Conciliacao;