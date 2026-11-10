const Banco = require("./Banco");

module.exports = class Evento {
    constructor() {
        this._id_evento = null;
        this._titulo = null;
        this._descricao = null;
        this._data_evento = null;
        this._local_evento = null;
        this._limite_vagas = null;
        this._status_evento = null;
    }

    create = async () => {
        const sql = `INSERT INTO eventos
            (titulo, descricao, data_evento, local_evento, limite_vagas, status_evento)
            VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.titulo, this.descricao, this.data_evento, this.local_evento,
            this.limite_vagas, this.status_evento
        ]);
        this.id_evento = result.insertId;
        return result.affectedRows > 0;
    }

    delete = async () => {
        const [result] = await Banco.getConexao().promise().execute(
            "DELETE FROM eventos WHERE id_evento = ?", [this.id_evento]
        );
        return result.affectedRows > 0;
    }

    update = async () => {
        const sql = `UPDATE eventos SET titulo = ?, descricao = ?, data_evento = ?,
            local_evento = ?, limite_vagas = ?, status_evento = ? WHERE id_evento = ?`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.titulo, this.descricao, this.data_evento, this.local_evento,
            this.limite_vagas, this.status_evento, this.id_evento
        ]);
        return result.affectedRows > 0 || (await this.readById()).length > 0;
    }

    readAll = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            "SELECT * FROM eventos ORDER BY data_evento"
        );
        return rows;
    }

    readById = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            "SELECT * FROM eventos WHERE id_evento = ?", [this.id_evento]
        );
        return rows;
    }

    get id_evento() { return this._id_evento; }
    set id_evento(value) { this._id_evento = value; }
    get titulo() { return this._titulo; }
    set titulo(value) { this._titulo = value; }
    get descricao() { return this._descricao; }
    set descricao(value) { this._descricao = value; }
    get data_evento() { return this._data_evento; }
    set data_evento(value) { this._data_evento = value; }
    get local_evento() { return this._local_evento; }
    set local_evento(value) { this._local_evento = value; }
    get limite_vagas() { return this._limite_vagas; }
    set limite_vagas(value) { this._limite_vagas = value; }
    get status_evento() { return this._status_evento; }
    set status_evento(value) { this._status_evento = value; }
}
