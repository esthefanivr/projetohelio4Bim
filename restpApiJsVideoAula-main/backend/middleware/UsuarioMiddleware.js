module.exports = class UsuarioMiddleware {
    validar_nome = (request, response, next) => {
        const usuario = request.body && request.body.usuario;
        if (!usuario || typeof usuario.nome !== "string" || usuario.nome.trim().length < 3) {
            return response.status(400).send({
                status: false, msg: "Informe usuario.nome com pelo menos 3 caracteres"
            });
        }
        return next();
    }

    validar_dados = (request, response, next) => {
        const usuario = request.body && request.body.usuario;
        if (!usuario || typeof usuario !== "object"
            || typeof usuario.nome !== "string" || usuario.nome.trim().length < 3
            || typeof usuario.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)
            || usuario.nome.length > 255 || usuario.email.length > 255
            || typeof usuario.tipo_usuario !== "string" || !usuario.tipo_usuario.trim()
            || usuario.tipo_usuario.length > 255
            || (usuario.senha !== undefined && typeof usuario.senha !== "string")
            || (usuario.tel !== undefined && usuario.tel !== null
                && (typeof usuario.tel !== "string" || usuario.tel.length > 255))
            || (request.method === "POST" && (!usuario.senha || usuario.senha.length < 1))) {
            return response.status(400).send({ status: false, msg: "Dados de usuário inválidos" });
        }
        if (usuario.data_nasc && !/^\d{4}-\d{2}-\d{2}$/.test(usuario.data_nasc)) {
            return response.status(400).send({ status: false, msg: "data_nasc deve estar no formato YYYY-MM-DD" });
        }
        if (usuario.data_nasc) {
            const data = new Date(`${usuario.data_nasc}T00:00:00Z`);
            if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== usuario.data_nasc) {
                return response.status(400).send({ status: false, msg: "data_nasc inválida" });
            }
        }
        return next();
    }

    validar_login = (request, response, next) => {
        const usuario = request.body && request.body.usuario;
        if (!usuario || typeof usuario.email !== "string" || typeof usuario.senha !== "string") {
            return response.status(400).send({ status: false, msg: "Informe email e senha" });
        }
        return next();
    }

    validar_id = (request, response, next) => {
        if (!/^[1-9]\d*$/.test(request.params.id_usuarios)) {
            return response.status(400).send({ status: false, msg: "id_usuarios inválido" });
        }
        return next();
    }
}
