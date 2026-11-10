const Evento = require("../modelo/Evento");

module.exports = class EventoControle {
    criar = async (request, response) => {
        try {
            const evento = this.preencher(new Evento(), request.body.evento);
            await evento.create();
            return response.status(201).send({
                status: true, msg: "Evento cadastrado", id_evento: evento.id_evento
            });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao cadastrar evento" });
        }
    }

    listar = async (request, response) => this.ler(request, response, false);
    buscar = async (request, response) => this.ler(request, response, true);

    ler = async (request, response, porId) => {
        try {
            const evento = new Evento();
            if (porId) evento.id_evento = request.params.id_evento;
            const dados = porId ? await evento.readById() : await evento.readAll();
            if (porId && dados.length === 0) {
                return response.status(404).send({ status: false, msg: "Evento não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Executado com sucesso", dados });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao consultar eventos" });
        }
    }

    atualizar = async (request, response) => {
        try {
            const evento = this.preencher(new Evento(), request.body.evento);
            evento.id_evento = request.params.id_evento;
            if (!(await evento.update())) {
                return response.status(404).send({ status: false, msg: "Evento não encontrado ou sem alterações" });
            }
            return response.status(200).send({ status: true, msg: "Evento atualizado" });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao atualizar evento" });
        }
    }

    remover = async (request, response) => {
        try {
            const evento = new Evento();
            evento.id_evento = request.params.id_evento;
            if (!(await evento.delete())) {
                return response.status(404).send({ status: false, msg: "Evento não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Evento removido" });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao remover evento" });
        }
    }

    preencher = (evento, dados) => {
        evento.titulo = dados.titulo;
        evento.descricao = dados.descricao;
        evento.data_evento = dados.data_evento;
        evento.local_evento = dados.local_evento;
        evento.limite_vagas = dados.limite_vagas;
        evento.status_evento = dados.status_evento;
        return evento;
    }
}
