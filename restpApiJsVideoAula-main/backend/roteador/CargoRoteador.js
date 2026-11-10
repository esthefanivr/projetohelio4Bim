const express = require("express");
const CargoMiddleware = require("../middleware/CargoMiddleware");
const CargoControle = require("../controle/CargoControle");
const JwtMiddleware = require("../middleware/JwtMiddleware");

module.exports = class CargoRoteador {
    constructor() {
        this._router = express.Router();
        this._cargoMiddleware = new CargoMiddleware();
        this._controleCargo = new CargoControle();
        this._jwtMiddleware = new JwtMiddleware();


    }

    criarRotasCargo = () => {

        this.router.post("/",
            this.jwtMiddleware.validar_token_acesso,
            this.cargoMiddleware.validar_nomeCargo,
            this.cargoMiddleware.validar_cargo_nao_existe,
            this.controleCargo.cargo_create_controle
        );

        this.router.get("/",
            this.jwtMiddleware.validar_token_acesso,
            this.controleCargo.cargo_realAll_controle
        );

        this.router.get("/:idCargo",
            this.jwtMiddleware.validar_token_acesso,
            this.controleCargo.cargo_realById_controle
        );


        this.router.put("/:idCargo",
            this.jwtMiddleware.validar_token_acesso,
            this.controleCargo.cargo_update_controle
        );

        this.router.delete("/:idCargo",
            this.jwtMiddleware.validar_token_acesso,
            this.controleCargo.cargo_delete_controle
        );

        return this.router;

    }

    get jwtMiddleware() {
        return this._jwtMiddleware;
    }
    set jwtMiddleware(in_jwtMiddleware) {
        this._jwtMiddleware = in_jwtMiddleware;
    }
    get controleCargo() {
        return this._controleCargo;
    }

    set controleCargo(_controleCargo) {
        return this._controleCargo = _controleCargo;
    }

    get cargoMiddleware() {
        return this._cargoMiddleware;
    }

    set cargoMiddleware(_cargoMiddleware) {
        return this._cargoMiddleware = _cargoMiddleware;
    }

    get router() {
        return this._router;
    }

    set router(rounter) {
        return this._router = rounter;
    }

}