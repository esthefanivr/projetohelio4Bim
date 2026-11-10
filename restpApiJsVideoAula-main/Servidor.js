const express = require("express");
const UsuarioRoteador = require("./backend/roteador/UsuarioRoteador");
const MinisterioRoteador = require("./backend/roteador/MinisterioRouter");
const UsuarioMinisterioRoteador = require("./backend/roteador/UsuarioMinisterioRoteador");
const EventoRoteador = require("./backend/roteador/EventoRoteador");

module.exports = class Servidor {
    constructor() {
        this._porta = 8080;
        this._app = express();

        this._app.use(express.json());
        this._app.use(express.static('frontend'));

        this._usuarioRoteador = new UsuarioRoteador();
        this._ministerioRoteador = new MinisterioRoteador();
        this._usuarioMinisterioRoteador = new UsuarioMinisterioRoteador();
        this._eventoRoteador = new EventoRoteador();

        this.configurarRotas();

    }

    configurarRotas = () => {
        this._app.use("/usuarios", this._usuarioRoteador.criarRotasUsuario());
        this._app.use("/ministerios", this._ministerioRoteador.criarRotasMinisterio());
        this._app.use("/usuarios-ministerios", this._usuarioMinisterioRoteador.criarRotas());
        this._app.use("/eventos", this._eventoRoteador.criarRotas());
    }

    iniciar = () => {
        this._app.listen(this._porta, () => {
            console.log("Api Rodando em http://localhost:" + this._porta + "/");
        })
    }


}