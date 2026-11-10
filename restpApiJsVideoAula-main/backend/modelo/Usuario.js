const Banco = require("./Banco");

module.exports = class Usuario {
    constructor() {
        this._id_usuarios = null;
        this._nome = null;
        this._email = null;
        this._senha = null;
        this._tel = null;
        this._data_nasc = null;
        this._tipo_usuario = null;
    }

    create = async () => {
        const sql = `INSERT INTO usuarios
            (nome, email, senha, tel, data_nasc, tipo_usuario)
            VALUES (?, ?, MD5(?), ?, ?, ?)`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.nome, this.email, this.senha, this.tel, this.data_nasc, this.tipo_usuario
        ]);
        this.id_usuarios = result.insertId;
        return result.affectedRows > 0;
    }

    delete = async () => {
        const [result] = await Banco.getConexao().promise().execute(
            "DELETE FROM usuarios WHERE id_usuarios = ?", [this.id_usuarios]
        );
        return result.affectedRows > 0;
    }

    update = async () => {
        const sql = `UPDATE usuarios SET nome = ?, email = ?,
            senha = IF(? IS NULL OR ? = '', senha, MD5(?)),
            tel = ?, data_nasc = ?, tipo_usuario = ?
            WHERE id_usuarios = ?`;
        const [result] = await Banco.getConexao().promise().execute(sql, [
            this.nome, this.email, this.senha, this.senha, this.senha,
            this.tel, this.data_nasc, this.tipo_usuario, this.id_usuarios
        ]);
        return result.affectedRows > 0 || (await this.readById()).length > 0;
    }

    readAll = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            `SELECT id_usuarios, nome, email, tel, data_nasc, tipo_usuario
             FROM usuarios ORDER BY nome`
        );
        return rows;
    }

    readById = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            `SELECT id_usuarios, nome, email, tel, data_nasc, tipo_usuario
             FROM usuarios WHERE id_usuarios = ?`, [this.id_usuarios]
        );
        return rows;
    }

    isUsuarioById = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            "SELECT 1 FROM usuarios WHERE id_usuarios = ? LIMIT 1", [this.id_usuarios]
        );
        return rows.length > 0;
    }

    login = async () => {
        const [rows] = await Banco.getConexao().promise().execute(
            `SELECT id_usuarios, nome, email, tel, data_nasc, tipo_usuario
             FROM usuarios WHERE email = ? AND senha = MD5(?) LIMIT 1`,
            [this.email, this.senha]
        );
        if (rows.length === 0) return false;
        Object.assign(this, {
            id_usuarios: rows[0].id_usuarios,
            nome: rows[0].nome,
            email: rows[0].email,
            tel: rows[0].tel,
            data_nasc: rows[0].data_nasc,
            tipo_usuario: rows[0].tipo_usuario
        });
        return true;
    }

    get id_usuarios() { return this._id_usuarios; }
    set id_usuarios(value) { this._id_usuarios = value; }
    get nome() { return this._nome; }
    set nome(value) { this._nome = value; }
    get email() { return this._email; }
    set email(value) { this._email = value; }
    get senha() { return this._senha; }
    set senha(value) { this._senha = value; }
    get tel() { return this._tel; }
    set tel(value) { this._tel = value; }
    get data_nasc() { return this._data_nasc; }
    set data_nasc(value) { this._data_nasc = value; }
    get tipo_usuario() { return this._tipo_usuario; }
    set tipo_usuario(value) { this._tipo_usuario = value; }
}
