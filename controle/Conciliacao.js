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
        const retiradas = await ConciliacaoDao.getRetiradas();
        const rotas = await ConciliacaoDao.getRotas();
        res.render("conciliacao/cadastroVisita.njk", { modulos, BASE_URL, cobrador, retiradas, rotas, mensagem });
    }

    static async cadastroVisitaPost(req, res) {
        try {
            const dados = NullSeVazio(req.body);
            const resultado = await ConciliacaoDao.setVisita(dados);
            const visitaId = resultado.insertId;
            console.log(dados)
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
        const pagamentos = await ConciliacaoDao.getPagamentos()
        const pagamentosMap = new Map();
        const clienteMap = new Map();
        clientes.forEach(cliente => {
            clienteMap.set(cliente.codigo, cliente);
        });

        pagamentos.forEach(pagamento => {
            pagamentosMap.set(pagamento.codigoVisita, pagamento);
        });

        visitas.forEach(visita => {
            const cliente = clienteMap.get(visita.codigoCliente);
            const pagamento = pagamentosMap.get(visita.codigo)
            if (cliente) {
                visita.nomeCliente = cliente.nome;
            }
            if (pagamento) {
                visita.pagamento = pagamento.valor
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

    static async visualizarVisitasTabela(req, res) {
        const modulos = NavBar.getModulos();
        const rotaId = req.params.codigo;

        const visitas = await ConciliacaoDao.getVisitasCompletosPorRota(rotaId);
        const codigosClientes = visitas.map(v => v.codigoCliente);

        if (codigosClientes.length > 0) {
            const clientes = await ClienteNerusDao.getClientes(codigosClientes);
            const clienteMap = new Map();
            clientes.forEach(c => clienteMap.set(c.codigo, c));
            visitas.forEach(v => {
                const cliente = clienteMap.get(v.codigoCliente);
                if (cliente) v.nomeCliente = cliente.nome;
                v.data = Data.dataParaTexto(v.data);
            });
        }

        res.render("conciliacao/tabelaVisitas.njk", { modulos, BASE_URL, visitas, rotaId });
    }

    static async exportarVisitasCsv(req, res) {
        const rotaId = req.params.codigo;

        const visitas = await ConciliacaoDao.getVisitasCompletosPorRota(rotaId);
        const codigosClientes = visitas.map(v => v.codigoCliente);

        let clienteMap = new Map();
        if (codigosClientes.length > 0) {
            const clientes = await ClienteNerusDao.getClientes(codigosClientes);
            clientes.forEach(c => clienteMap.set(c.codigo, c));
        }

        const header = "CODIGO;CLIENTE;CODIGOCLIENTE;ENDERECO;DATA;SAIDA;CHEGADA;ENCONTRADO;RENEGOCIADO;PAGAMENTOVALOR;PAGAMENTOCONTRATO;PAGAMENTOPARCELAS;RENEGOCIACAOVALOR;RENEGOCIACAOCONTRATO;RENEGOCIACAOPARCELAS;OBSERVACOES";

        const linhas = visitas.map(v => {
            const nomeCliente = clienteMap.get(v.codigoCliente)?.nome || "Cliente não encontrado";
            const dataTexto = Data.dataParaTexto(v.data);
            return [
                v.codigo,
                `"${(nomeCliente).replace(/"/g, '""')}"`,
                v.codigoCliente,
                `"${(v.endereco || "").replace(/"/g, '""')}"`,
                dataTexto,
                v.saida || "",
                v.chegada || "",
                v.encontrado == 1 ? "Sim" : "Nao",
                v.renegociado == 1 ? "Sim" : "Nao",
                v.pagamentoValor ? (v.pagamentoValor / 100) : "",
                v.pagamentoContrato || "",
                v.pagamentoParcelas || "",
                v.renegociacaoValor || "",
                v.renegociacaoContrato || "",
                v.renegociacaoParcelas || "",
                `"${(v.observacoes || "").replace(/"/g, '""')}"`
            ].join(";");
        });

        const csv = [header, ...linhas].join("\n");
        console.log(csv)
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename=visitas_rota_${rotaId}.csv`);
        return res.send(csv);
    }

    static async cadastroRetirada(req, res) {
        const modulos = NavBar.getModulos();
        const mensagem = req.query.mensagem;
        const veiculos = await ConciliacaoDao.getVeiculos();
        res.render("conciliacao/cadastroRetirada.njk", { modulos, BASE_URL, veiculos, mensagem });
    }

    static async cadastroRetiradaPost(req, res) {
        const dados = req.body;
        const novaRetirada = {
            codigoVeiculo: dados.codigoVeiculo,
            data: dados.data,
            saida: dados.saida,
            chegada: dados.chegada,
            kmInicio: dados.kmInicio ?? 0
        };
        try {
            await ConciliacaoDao.setRetirada(novaRetirada);
            return res.redirect("retirada?mensagem=Retirada cadastrada com sucesso");
        } catch (erro) {
            console.error("[Conciliacao] Erro ao cadastrar retirada:", erro.message);
            return res.redirect("retirada?mensagem=Erro: " + erro.message);
        }
    }
}

module.exports = Conciliacao;