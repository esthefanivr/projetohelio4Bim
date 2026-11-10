const Banco = require("./Banco");

module.exports = class Cargo {
    constructor() {
        this._idCargo = null;
        this._nomeCargo = null;
    }

    create = async () => {
        const SQL = "INSERT INTO cargo (nomeCargo) VALUES (?)";
        try {
            //const conexao = Banco.getConexao();

            const [resposta] = await Banco.getConexao().promise().execute(SQL, [this.nomeCargo]);
            this.id = resposta.insertId;
            return resposta.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    delete = async () => {
        const SQL = "DELETE FROM cargo WHERE idCargo = ?";
        try {
           // const conexao = Banco.getConexao();

            const [resposta] = await Banco.getConexao().promise().execute(SQL, [this.idCargo]);

            return resposta.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }

    }

    update = async () => {
        const SQL = "UPDATE cargo SET nomeCargo = ? WHERE idCargo = ? ";
        try {
            //const conexao = Banco.getConexao();
            const [resposta] = await Banco.getConexao().promise().execute(SQL, [this.nomeCargo, this.idCargo]);
            return resposta.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }

    }

    isCargo = async () => {
        const SQL = "select count(*) as qtd from cargo where nomeCargo=?";
        try {
            //const conexao = Banco.getConexao();
            const [resposta] = await Banco.getConexao().promise().execute(SQL, [this.nomeCargo]);
            return resposta[0].qtd > 0;
        } catch (error) {
            console.error(error);
            return false;
        }

    }

    isCargoById = async () => {
        const SQL = "select count(*) as qtd from cargo where idCargo=?";
        try {
            //const conexao = Banco.getConexao();
            const [resposta] = await Banco.getConexao().promise().execute(SQL, [this.idCargo]);
            return resposta[0].qtd > 0;
        } catch (error) {
            console.error(error);
            return false;
        }

    }

    readAll = async () => {
        const SQL = "select * from cargo order by nomeCargo";
        try {
            //const conexao = Banco.getConexao();
            const [matrizRespostas] = await Banco.getConexao().promise().execute(SQL);
            return matrizRespostas;
        } catch (error) {
            console.error(error);
            return [];
        }

    }

    readById = async () => {
       
        const SQL = "select * from cargo where idCargo=?";
        try {   
            //console.log(this.id)            
            //const conexao =  Banco.getConexao();
            const [matrizRespostas] = await Banco.getConexao().promise().execute(SQL,[this.idCargo]);
            //console.log(matrizRespostas);
            return matrizRespostas;
        } catch (error) {
            console.error(error);
            return [];
        }

    }

    get idCargo() {
        return this._idCargo;
    }
    set idCargo(novoIdCargo) {
        this._idCargo = novoIdCargo;
    }

    get nomeCargo() {
        return this._nomeCargo;
    }
    set nomeCargo(novoCargo) {
        this._nomeCargo = novoCargo;
    }

}