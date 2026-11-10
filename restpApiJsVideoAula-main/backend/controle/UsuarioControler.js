const Usuario = require("../modelo/Usuario");
const MeuTokenJWT = require("../modelo/MeuTokenJWT");

module.exports = class UsuarioControle {
    usuario_login_controle = async (request, response) => {
        try {
            const usuario = new Usuario();
            usuario.email = request.body.usuario.email;
            usuario.senha = request.body.usuario.senha;

            if (!(await usuario.login())) {
                return response.status(401).send({ status: false, msg: "Email ou senha inválidos" });
            }

            const token = new MeuTokenJWT().gerarToken({
                email: usuario.email,
                role: usuario.tipo_usuario,
                name: usuario.nome,
                id_usuarios: usuario.id_usuarios,
                tipo_usuario: usuario.tipo_usuario
            });
            return response.status(200).send({
                status: true, msg: "Autenticado com sucesso", token
            });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao autenticar usuário" });
        }
    }

    usuario_create_controle = async (request, response) => {
        try {
            const usuario = new Usuario();
            this.preencherUsuario(usuario, request.body.usuario);
            await usuario.create();
            return response.status(201).send({
                status: true, msg: "Cadastrado com sucesso", id_usuarios: usuario.id_usuarios
            });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).send({
                status: false, msg: error.code === "ER_DUP_ENTRY"
                    ? "Email ou telefone já cadastrado" : "Erro ao cadastrar usuário"
            });
        }
    }

    usuario_realAll_controle = async (request, response) => this.executarLeitura(request, response, false);
    usuario_realById_controle = async (request, response) => this.executarLeitura(request, response, true);

    executarLeitura = async (request, response, porId) => {
        try {
            const usuario = new Usuario();
            if (porId) usuario.id_usuarios = request.params.id_usuarios;
            const dados = porId ? await usuario.readById() : await usuario.readAll();
            if (porId && dados.length === 0) {
                return response.status(404).send({ status: false, msg: "Usuário não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Executado com sucesso", dados });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao consultar usuários" });
        }
    }

    usuario_update_controle = async (request, response) => {
        try {
            const usuario = new Usuario();
            usuario.id_usuarios = request.params.id_usuarios;
            this.preencherUsuario(usuario, request.body.usuario);
            if (!(await usuario.update())) {
                return response.status(404).send({ status: false, msg: "Usuário não encontrado ou sem alterações" });
            }
            return response.status(200).send({ status: true, msg: "Atualizado com sucesso" });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_DUP_ENTRY" ? 409 : 500).send({
                status: false, msg: error.code === "ER_DUP_ENTRY"
                    ? "Email ou telefone já cadastrado" : "Erro ao atualizar usuário"
            });
        }
    }

    usuario_delete_controle = async (request, response) => {
        try {
            const usuario = new Usuario();
            usuario.id_usuarios = request.params.id_usuarios;
            if (!(await usuario.delete())) {
                return response.status(404).send({ status: false, msg: "Usuário não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Removido com sucesso" });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_ROW_IS_REFERENCED_2" ? 409 : 500).send({
                status: false, msg: error.code === "ER_ROW_IS_REFERENCED_2"
                    ? "Usuário está vinculado a ministério" : "Erro ao remover usuário"
            });
        }
    }

    preencherUsuario = (usuario, dados) => {
        usuario.nome = dados.nome;
        usuario.email = dados.email;
        usuario.senha = dados.senha;
        usuario.tel = dados.tel || null;
        usuario.data_nasc = dados.data_nasc || null;
        usuario.tipo_usuario = dados.tipo_usuario;
    }
}
