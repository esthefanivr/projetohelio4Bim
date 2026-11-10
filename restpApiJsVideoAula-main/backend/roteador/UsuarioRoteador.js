const express = require("express");
const UsuarioMiddleware = require("../middleware/UsuarioMiddleware");
const UsuarioControle = require("../controle/UsuarioControler");
const JwtMiddleware = require("../middleware/JwtMiddleware");

module.exports = class UsuarioRoteador {
    constructor() {
        this._router = express.Router();
        this._usuarioControle = new UsuarioControle();
        this._usuarioMiddleware = new UsuarioMiddleware();
        this._jwtMiddleware = new JwtMiddleware();
    }

    criarRotasUsuario = () => {
        this.router.post("/login", this.usuarioMiddleware.validar_login,
            this.usuarioControle.usuario_login_controle);
        this.router.use(this.jwtMiddleware.validar_token_acesso,
            this.jwtMiddleware.validar_perfil_administrador);
        this.router.post("/", this.usuarioMiddleware.validar_dados,
            this.usuarioControle.usuario_create_controle);
        this.router.get("/", this.usuarioControle.usuario_realAll_controle);
        this.router.get("/:id_usuarios", this.usuarioMiddleware.validar_id,
            this.usuarioControle.usuario_realById_controle);
        this.router.put("/:id_usuarios", this.usuarioMiddleware.validar_id,
            this.usuarioMiddleware.validar_dados, this.usuarioControle.usuario_update_controle);
        this.router.delete("/:id_usuarios", this.usuarioMiddleware.validar_id,
            this.usuarioControle.usuario_delete_controle);
        return this.router;
    }

    get router() { return this._router; }
    set router(value) { this._router = value; }
    get usuarioControle() { return this._usuarioControle; }
    set usuarioControle(value) { this._usuarioControle = value; }
    get usuarioMiddleware() { return this._usuarioMiddleware; }
    set usuarioMiddleware(value) { this._usuarioMiddleware = value; }
    get jwtMiddleware() { return this._jwtMiddleware; }
    set jwtMiddleware(value) { this._jwtMiddleware = value; }
}
