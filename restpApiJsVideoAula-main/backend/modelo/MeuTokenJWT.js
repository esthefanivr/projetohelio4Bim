const jwt = require('jsonwebtoken');

module.exports = class MeuTokenJWT {
    constructor() {
        this._key = "x9S4q0v+V0IjvHkG20uAxaHx1ijj+q1HWjHKv+ohxp/oK+77qyXkVj/l4QYHHTF3"; // Chave secreta
        this._alg = 'HS256'; // Algoritmo de criptografia
        this._type = 'JWT';
        this._iss = 'http://localhost'; // Emissor do token
        this._aud = 'http://localhost'; // Destinatário do token
        this._sub = "acesso_sistema"; // Assunto do token
        this._duracaoToken = 3600 * 24 * 30; // Duração do token (30 dias)
        this.payload = null;
    }

    gerarToken = (parametroClaims) => {
        const headers = {
            alg: this._alg,
            typ: this._type
        };

        const payload = {
            iss: this.iss,
            aud: this.aud,
            sub: this.sub,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this._duracaoToken,
            nbf: Math.floor(Date.now() / 1000),
            jti: require('crypto').randomBytes(16).toString('hex'),
            email: parametroClaims.email,
            role: parametroClaims.role || parametroClaims.tipo_usuario,
            name: parametroClaims.name,
            idFuncionario: parametroClaims.idFuncionario,
            id_usuarios: parametroClaims.id_usuarios,
            tipo_usuario: parametroClaims.tipo_usuario
        };

        return jwt.sign(payload, this._key, { algorithm: this._alg, header: headers });
    }

    validarToken = (stringToken) => {
       
        if(!stringToken){
            console.error("Token não fornecido");
            return false;
        }

        if (!stringToken || stringToken.trim() === "") {
            console.error("Token em branco");
            return false;
        }
        const token = stringToken.replace(/^Bearer\s+/i, "").trim();
        
        try {
            const decoded = jwt.verify(token, this.key, { algorithms: [this._alg] });
            this.payload = decoded;
            return true;
        } catch (err) {
            //console.log(err)
            if (err instanceof jwt.TokenExpiredError) {
                console.error("Token expirado");
            } else if (err instanceof jwt.JsonWebTokenError) {
                console.error("Token inválido");
            } else {
                console.error("Erro geral", err);
            }
            return false;
        }
    }

    // Getters e Setters para os atributos
    get key() {
        return this._key;
    }

    set key(value) {
        this._key = value;
    }

    get alg() {
        return this._alg;
    }

    set alg(value) {
        this._alg = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get iss() {
        return this._iss;
    }

    set iss(value) {
        this._iss = value;
    }

    get aud() {
        return this._aud;
    }

    set aud(value) {
        this._aud = value;
    }

    get sub() {
        return this._sub;
    }

    set sub(value) {
        this._sub = value;
    }

    get duracaoToken() {
        return this._duracaoToken;
    }

    set duracaoToken(value) {
        this._duracaoToken = value;
    }


}
