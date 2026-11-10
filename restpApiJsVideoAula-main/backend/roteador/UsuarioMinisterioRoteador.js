const express = require("express");
const Controle = require("../controle/UsuarioMinisterioControle");
const Middleware = require("../middleware/UsuarioMinisterioMiddleware");
const JwtMiddleware = require("../middleware/JwtMiddleware");

module.exports = class UsuarioMinisterioRoteador {
    constructor() {
        this._router = express.Router();
        this._controle = new Controle();
        this._middleware = new Middleware();
        this._jwtMiddleware = new JwtMiddleware();
    }

    criarRotas = () => {
        this.router.use(this.jwtMiddleware.validar_token_acesso,
            this.jwtMiddleware.validar_perfil_administrador);
        this.router.post("/", this.middleware.validar_dados, this.controle.criar);
        this.router.get("/", this.controle.listar);
        this.router.get("/:id_usuarios_ministerios", this.middleware.validar_id, this.controle.buscar);
        this.router.put("/:id_usuarios_ministerios", this.middleware.validar_id,
            this.middleware.validar_dados, this.controle.atualizar);
        this.router.delete("/:id_usuarios_ministerios", this.middleware.validar_id, this.controle.remover);
        return this.router;
    }

    get router() { return this._router; }
    get controle() { return this._controle; }
    get middleware() { return this._middleware; }
    get jwtMiddleware() { return this._jwtMiddleware; }
}
