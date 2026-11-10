module.exports = class UsuarioMinisterioMiddleware {
    validar_dados = (request, response, next) => {
        const vinculo = request.body && request.body.usuario_ministerio;
        if (!vinculo || !Number.isInteger(Number(vinculo.id_usuario)) || Number(vinculo.id_usuario) < 1
            || !Number.isInteger(Number(vinculo.id_ministerio)) || Number(vinculo.id_ministerio) < 1
            || typeof vinculo.funcao !== "string" || !vinculo.funcao.trim()
            || vinculo.funcao.length > 255
            || typeof vinculo.data_entrada !== "string"
            || !/^\d{4}-\d{2}-\d{2}$/.test(vinculo.data_entrada)) {
            return response.status(400).send({
                status: false, msg: "Informe id_usuario, id_ministerio, data_entrada (YYYY-MM-DD) e funcao válidos"
            });
        }
        const data = new Date(`${vinculo.data_entrada}T00:00:00Z`);
        if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== vinculo.data_entrada) {
            return response.status(400).send({ status: false, msg: "data_entrada inválida" });
        }
        vinculo.id_usuario = Number(vinculo.id_usuario);
        vinculo.id_ministerio = Number(vinculo.id_ministerio);
        return next();
    }

    validar_id = (request, response, next) => {
        if (!/^[1-9]\d*$/.test(request.params.id_usuarios_ministerios)) {
            return response.status(400).send({ status: false, msg: "id_usuarios_ministerios inválido" });
        }
        return next();
    }
}
