const Banco = require("./Banco");

module.exports = class UsuarioMinisterio {
    constructor() {
        this._id_usuarios_ministerios = null;
        this._id_usuario = null;
        this._id_ministerio = null;
        this._data_entrada = null;
        this._funcao = null;
    }

    create = async () => {
        const sql = `INSERT INTO usuarios_ministerios
            (id_usuario, id_ministerio, data_entrada, funcao) VALUES (?, ?, ?, ?)`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.id_usuario, this.id_ministerio, this.data_entrada, this.funcao
        ]);
        this.id_usuarios_ministerios = result.insertId;
        return result.affectedRows > 0;
    }

    delete = async () => {
        const [result] = await Banco.getConexao().promise().execute(
            "DELETE FROM usuarios_ministerios WHERE id_usuarios_ministerios = ?",
            [this.id_usuarios_ministerios]
        );
        return result.affectedRows > 0;
    }

    update = async () => {
        const sql = `UPDATE usuarios_ministerios SET id_usuario = ?, id_ministerio = ?,
            data_entrada = ?, funcao = ? WHERE id_usuarios_ministerios = ?`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.id_usuario, this.id_ministerio, this.data_entrada,
            this.funcao, this.id_usuarios_ministerios
        ]);
        return result.affectedRows > 0 || (await this.readById()).length > 0;
    }

    readAll = async () => {
        const sql = `SELECT um.*, u.nome AS nome_usuario, m.nome AS nome_ministerio
            FROM usuarios_ministerios um
            LEFT JOIN usuarios u ON u.id_usuarios = um.id_usuario
            LEFT JOIN ministerios m ON m.id_ministerios = um.id_ministerio
            ORDER BY um.id_usuarios_ministerios`;
        const [rows] = await Banco.getConexao().promise().execute(sql);
        return rows;
    }

    readById = async () => {
        const sql = `SELECT um.*, u.nome AS nome_usuario, m.nome AS nome_ministerio
            FROM usuarios_ministerios um
            LEFT JOIN usuarios u ON u.id_usuarios = um.id_usuario
            LEFT JOIN ministerios m ON m.id_ministerios = um.id_ministerio
            WHERE um.id_usuarios_ministerios = ?`;
        const [rows] = await Banco.getConexao().promise().execute(
            sql, [this.id_usuarios_ministerios]
        );
        return rows;
    }

    get id_usuarios_ministerios() { return this._id_usuarios_ministerios; }
    set id_usuarios_ministerios(value) { this._id_usuarios_ministerios = value; }
    get id_usuario() { return this._id_usuario; }
    set id_usuario(value) { this._id_usuario = value; }
    get id_ministerio() { return this._id_ministerio; }
    set id_ministerio(value) { this._id_ministerio = value; }
    get data_entrada() { return this._data_entrada; }
    set data_entrada(value) { this._data_entrada = value; }
    get funcao() { return this._funcao; }
    set funcao(value) { this._funcao = value; }
}
