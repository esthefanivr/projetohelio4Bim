const Usuario = require("../modelo/Usuario");

module.exports = class MinisterioMiddleware {
    validar_dados = async (request, response, next) => {
        const ministerio = request.body && request.body.ministerio;
        if (!ministerio || typeof ministerio !== "object"
            || typeof ministerio.nome !== "string" || ministerio.nome.trim().length < 3
            || ministerio.nome.length > 255
            || typeof ministerio.dia_reuniao !== "string" || !ministerio.dia_reuniao.trim()
            || ministerio.dia_reuniao.length > 255
            || (ministerio.descricao !== undefined && ministerio.descricao !== null
                && (typeof ministerio.descricao !== "string" || ministerio.descricao.length > 255))) {
            return response.status(400).send({ status: false, msg: "Dados de ministério inválidos" });
        }
        if (ministerio.id_coordenador !== undefined && ministerio.id_coordenador !== null
            && ministerio.id_coordenador !== "") {
            const id = Number(ministerio.id_coordenador);
            if (!Number.isInteger(id) || id < 1) {
                return response.status(400).send({ status: false, msg: "id_coordenador inválido" });
            }
            try {
                const usuario = new Usuario();
                usuario.id_usuarios = id;
                if (!(await usuario.isUsuarioById())) {
                    return response.status(400).send({ status: false, msg: "Coordenador informado não existe" });
                }
            } catch (error) {
                console.error(error);
                return response.status(500).send({ status: false, msg: "Erro ao validar coordenador" });
            }
        }
        return next();
    }

    validar_id = (request, response, next) => {
        if (!/^[1-9]\d*$/.test(request.params.id_ministerios)) {
            return response.status(400).send({ status: false, msg: "id_ministerios inválido" });
        }
        return next();
    }
}
