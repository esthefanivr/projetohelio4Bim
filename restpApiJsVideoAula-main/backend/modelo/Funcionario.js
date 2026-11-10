const Banco = require("./Banco");
const Cargo = require("./Cargo");

module.exports = class Funcionario {

    constructor() {
        this._idFuncionario = null;
        this._cargo = new Cargo();
        this._nomeFuncionario = null;
        this._email = null;
        this._senha = null;
        this._recebeValeTransporte = null;
    }

    create = async () => {
        console.log("Funcionario.create()");
        const SQL = "INSERT INTO funcionario (nomeFuncionario,email,senha,recebeValeTransporte,Cargo_idCargo) values (?,?,md5(?),?,?);"

        try {

            console.log([this.nomeFuncionario, this.email, this.senha, this.recebeValeTransporte, this.cargo.idCargo]);
            const [resultado] = await Banco.getConexao().promise().execute(SQL, [this.nomeFuncionario, this.email, this.senha, this.recebeValeTransporte, this.cargo.idCargo]);
            this.idFuncionario = resultado.insertId;
            return resultado.affectedRows > 0;

        } catch (error) {
            console.log(error);
            return false;
        }

    }

    delete = async () => {
        console.log("Funcionario.delete()");
        const SQL = "DELETE from funcionario where idFuncionario = ?;"

        try {

            const [resultado] = await Banco.getConexao().promise().execute(SQL, [this.idFuncionario]);
            this.idFuncionario = resultado.insertId;
            return resultado.affectedRows > 0;

        } catch (error) {
            console.log(error);
            return false;
        }

    }

    update = async () => {
        console.log("Funcionario.delete()");
        const SQL = "UPDATE funcionario SET nomeFuncionario= ? , email=?, senha=md5(?), recebeValeTransporte=?, Cargo_idCargo =? WHERE  idFuncionario=?;";

        try {
            //console.log([this.nomeFuncionario, this.email, this.senha, this.recebeValeTransporte, this.cargo.idCargo, this.idFuncionario]);
            const [resultado] = await Banco.getConexao().promise().execute(SQL, [this.nomeFuncionario, this.email, this.senha, this.recebeValeTransporte, this.cargo.idCargo, this.idFuncionario]);
            this.idFuncionario = resultado.insertId;
            return resultado.affectedRows > 0;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    readAll = async () => {
        console.log("Funcionario.readAll()");
        const SQL = "SELECT * FROM funcionario;";

        try {

            const [resultado] = await Banco.getConexao().promise().execute(SQL, []);

            return resultado;

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    readById = async () => {
        console.log("Funcionario.readById()");
        const SQL = "SELECT * FROM funcionario where idFuncionario = ?;";

        try {

            const [resultado] = await Banco.getConexao().promise().execute(SQL, [this.idFuncionario]);

            return resultado;

        } catch (error) {
            console.log(error);
            return [];
        }
    }

    login = async () => {
        console.log("Funcionario.login()");

        const SQL = `SELECT COUNT(*) AS qtd , 
        idFuncionario,nomeFuncionario,recebeValeTransporte, idCargo, nomeCargo
        FROM Funcionario 
        JOIN cargo ON cargo.idCargo = funcionario.Cargo_idCargo
        where email=? and senha = md5(?);`;

        try {

            const [resultado] = await Banco.getConexao().promise().execute(SQL, [this.email, this.senha]);

            if (resultado.length > 0) {
                if (resultado[0].qtd === 1) {
                    this.idFuncionario = resultado[0].idFuncionario;
                    this.nomeFuncionario = resultado[0].nomeFuncionario;
                    this.recebeValeTransporte = resultado[0].recebeValeTransporte;
                    this.cargo.idCargo = resultado[0].idCargo;
                    this.cargo.nomeCargo = resultado[0].nomeCargo;
                    return true;
                }
            }
            return false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }


    get idFuncionario() {
        return this._idFuncionario;
    }
    set idFuncionario(in_idFuncionario) {
        this._idFuncionario = in_idFuncionario;
    }

    get cargo() {
        return this._cargo;
    }
    set cargo(in_cargo) {
        this._cargo = in_cargo;
    }

    get nomeFuncionario() {
        return this._nomeFuncionario;
    }
    set nomeFuncionario(in_nomeFuncionario) {
        this._nomeFuncionario = in_nomeFuncionario;
    }

    get email() {
        return this._email;
    }
    set email(in_email) {
        this._email = in_email;
    }

    get senha() {
        return this._senha;
    }
    set senha(in_senha) {
        this._senha = in_senha;
    }

    get recebeValeTransporte() {
        return this._recebeValeTransporte;
    }
    set recebeValeTransporte(in_recebeValeTransporte) {
        this._recebeValeTransporte = in_recebeValeTransporte;
    }

}

/*
  `idFuncionario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nomeFuncionario` VARCHAR(128) NULL,
  `email` VARCHAR(64) NULL,
  `senha` VARCHAR(64) NULL,
  `recebeValeTransporte` TINYINT(1) NULL,
  `Cargo_idCargo` INT UNSIGNED NOT NULL,

*/