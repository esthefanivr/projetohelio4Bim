const Banco = require("./Banco");

module.exports = class Ministerio {
    constructor() {
        this._id_ministerios = null;
        this._nome = null;
        this._descricao = null;
        this._dia_reuniao = null;
        this._id_coordenador = null;
    }

    create = async () => {
        const sql = `INSERT INTO ministerios
            (nome, descricao, dia_reuniao, id_coordenador) VALUES (?, ?, ?, ?)`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.nome, this.descricao, this.dia_reuniao, this.id_coordenador
        ]);
        this.id_ministerios = result.insertId;
        return result.affectedRows > 0;
    }

    delete = async () => {
        const [result] = await Banco.getConexao().promise().execute(
            "DELETE FROM ministerios WHERE id_ministerios = ?", [this.id_ministerios]
        );
        return result.affectedRows > 0;
    }

    update = async () => {
        const sql = `UPDATE ministerios SET nome = ?, descricao = ?,
            dia_reuniao = ?, id_coordenador = ? WHERE id_ministerios = ?`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.nome, this.descricao, this.dia_reuniao, this.id_coordenador, this.id_ministerios
        ]);
        return result.affectedRows > 0 || (await this.readById()).length > 0;
    }

    readAll = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            "SELECT * FROM ministerios ORDER BY nome"
        );
        return rows;
    }

    readById = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            "SELECT * FROM ministerios WHERE id_ministerios = ?", [this.id_ministerios]
        );
        return rows;
    }

    isMinisterioById = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            "SELECT 1 FROM ministerios WHERE id_ministerios = ? LIMIT 1", [this.id_ministerios]
        );
        return rows.length > 0;
    }

    get id_ministerios() { return this._id_ministerios; }
    set id_ministerios(value) { this._id_ministerios = value; }
    get nome() { return this._nome; }
    set nome(value) { this._nome = value; }
    get descricao() { return this._descricao; }
    set descricao(value) { this._descricao = value; }
    get dia_reuniao() { return this._dia_reuniao; }
    set dia_reuniao(value) { this._dia_reuniao = value; }
    get id_coordenador() { return this._id_coordenador; }
    set id_coordenador(value) { this._id_coordenador = value; }
}
