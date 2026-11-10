const express = require("express");
const MinisterioMiddleware = require("../middleware/MinisterioMiddleware");
const MinisterioControle = require("../controle/MinisterioControle");
const JwtMiddleware = require("../middleware/JwtMiddleware");

module.exports = class MinisterioRoteador {
    constructor() {
        this._router = express.Router();
        this._ministerioMiddleware = new MinisterioMiddleware();
        this._controleMinisterio = new MinisterioControle();
        this._jwtMiddleware = new JwtMiddleware();
    }

    criarRotasMinisterio = () => {
        this.router.use(this.jwtMiddleware.validar_token_acesso);
        this.router.get("/", this.controleMinisterio.ministerio_realAll_controle);
        this.router.get("/:id_ministerios", this.ministerioMiddleware.validar_id,
            this.controleMinisterio.ministerio_realById_controle);
        this.router.post("/", this.jwtMiddleware.validar_perfil_administrador,
            this.ministerioMiddleware.validar_dados,
            this.controleMinisterio.ministerio_create_controle);
        this.router.put("/:id_ministerios", this.ministerioMiddleware.validar_id,
            this.jwtMiddleware.validar_perfil_administrador,
            this.ministerioMiddleware.validar_dados, this.controleMinisterio.ministerio_update_controle);
        this.router.delete("/:id_ministerios", this.ministerioMiddleware.validar_id,
            this.jwtMiddleware.validar_perfil_administrador,
            this.controleMinisterio.ministerio_delete_controle);
        return this.router;
    }

    get router() { return this._router; }
    set router(value) { this._router = value; }
    get controleMinisterio() { return this._controleMinisterio; }
    set controleMinisterio(value) { this._controleMinisterio = value; }
    get ministerioMiddleware() { return this._ministerioMiddleware; }
    set ministerioMiddleware(value) { this._ministerioMiddleware = value; }
    get jwtMiddleware() { return this._jwtMiddleware; }
    set jwtMiddleware(value) { this._jwtMiddleware = value; }
}
