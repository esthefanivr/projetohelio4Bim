const Cargo = require("../modelo/Cargo");
const Funcionario = require("../modelo/Funcionario");

module.exports = class FuncionarioMiddleware {


    validar_nomeFuncionario = (request, response, next) => {
        const nomeCargo = request.body.funcionario.nomeFuncionario;

        if (nomeCargo.length < 3) {
            const objResposta = {
                statu: false,
                msg: "o nome deve possuir mais do que 3 caracteres"
            }
            response.status(400).send(objResposta);
        } else {
            next();
        }
    }


    is_cargo_By_Id = async (request, response, next) => {
        const cargo = new Cargo();

        cargo.idCargo = request.body.funcionario.idCargo;

        const existe = await cargo.isCargoById();
        if (existe == true) {
            next();
        } else {
            const objResposta = {
                statu: false,
                msg: "Cargo informado não existe"
            }
            response.status(400).send(objResposta);
        }
    }

}