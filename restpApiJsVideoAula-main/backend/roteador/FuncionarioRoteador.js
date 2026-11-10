const express = require("express");
const CargoMiddleware = require("../middleware/CargoMiddleware");
const FuncionarioMiddleware = require("../middleware/FuncionarioMiddleware");
const FuncionarioControle = require("../controle/FuncionarioControle");



module.exports = class FuncionarioRoteador {
    constructor() {
        this._router = express.Router();
        this._cargoMiddleware = new CargoMiddleware();
        this._funcionarioControle = new FuncionarioControle();
        this._funcionarioMiddleware = new FuncionarioMiddleware();

    }
    criarRotasFuncionario = () => {


        this.router.post("/login/",
            this.funcionarioControle.funcionario_login_controle
        );

        this.router.post("/",
            this.funcionarioMiddleware.validar_nomeFuncionario,
            this.funcionarioMiddleware.is_cargo_By_Id,
            this.funcionarioControle.funcionario_create_controle
        );

        this.router.put("/:idFuncionario",
            this.funcionarioMiddleware.validar_nomeFuncionario,
            this.funcionarioControle.funcionario_update_controle
        );

        this.router.delete("/:idFuncionario",
            this.funcionarioControle.funcionario_delete_controle
        );

        this.router.get("/",
            this.funcionarioControle.funcionario_realAll_controle
        );


        this.router.get("/:idFuncionario",
            this.funcionarioControle.funcionario_realById_controle
        );
        return this.router;

    }

    get router() {
        return this._router;
    }
    set router(in_router) {
        this._router = in_router;
    }

    get cargoMiddleware() {
        return this._cargoMiddleware;
    }
    set cargoMiddleware(in_cargoMiddleware) {
        this._cargoMiddleware = in_cargoMiddleware;
    }

    get funcionarioControle() {
        return this._funcionarioControle;
    }
    set funcionarioControle(in_funcionarioControle) {
        this._funcionarioControle = in_funcionarioControle;
    }

    get funcionarioMiddleware() {
        return this._funcionarioMiddleware;
    }
    set funcionarioMiddleware(in_funcionarioMiddleware) {
        this._funcionarioMiddleware = in_funcionarioMiddleware;
    }

}