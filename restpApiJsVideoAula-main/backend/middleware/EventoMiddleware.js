module.exports = class EventoMiddleware {
    validar_dados = (request, response, next) => {
        const evento = request.body && request.body.evento;
        if (!evento || typeof evento !== "object"
            || typeof evento.titulo !== "string" || !evento.titulo.trim()
            || evento.titulo.length > 255
            || typeof evento.descricao !== "string" || !evento.descricao.trim()
            || evento.descricao.length > 255
            || typeof evento.data_evento !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(evento.data_evento)
            || typeof evento.local_evento !== "string" || !evento.local_evento.trim()
            || evento.local_evento.length > 255
            || evento.limite_vagas === "" || !Number.isInteger(Number(evento.limite_vagas))
            || Number(evento.limite_vagas) < 0
            || typeof evento.status_evento !== "string" || !evento.status_evento.trim()) {
            return response.status(400).send({ status: false, msg: "Dados de evento inválidos" });
        }
        const data = new Date(`${evento.data_evento}T00:00:00Z`);
        if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== evento.data_evento) {
            return response.status(400).send({ status: false, msg: "data_evento inválida" });
        }
        evento.limite_vagas = Number(evento.limite_vagas);
        return next();
    }

    validar_id = (request, response, next) => {
        if (!/^[1-9]\d*$/.test(request.params.id_evento)) {
            return response.status(400).send({ status: false, msg: "id_evento inválido" });
        }
        return next();
    }
}
