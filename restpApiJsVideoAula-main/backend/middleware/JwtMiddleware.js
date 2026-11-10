const MeuTokenJWT = require("../modelo/MeuTokenJWT");


module.exports = class JwtMiddleware {

    validar_token_acesso = (request, response, next) => {
        const authorization = request.headers.authorization;

        const jwt = new MeuTokenJWT();

        const autorizado = jwt.validarToken(authorization);

        if (autorizado === true) {

            request.usuario = jwt.payload;
            return next();

        } else {
            const objResposta = {
                status: false,
                msg: "token inválido"
            }
            return response.status(401).send(objResposta);
        }
    }

    validar_perfil_administrador = (request, response, next) => {
        const perfil = request.usuario && (request.usuario.tipo_usuario || request.usuario.role);
        if (typeof perfil === "string" && ["ADM", "PASTOR"].includes(perfil.trim().toUpperCase())) {
            return next();
        }
        return response.status(403).send({
            status: false,
            msg: "Acesso permitido somente para ADM ou PASTOR"
        });
    }
}