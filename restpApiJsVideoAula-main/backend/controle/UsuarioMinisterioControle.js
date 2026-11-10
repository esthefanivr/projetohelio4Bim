const UsuarioMinisterio = require("../modelo/UsuarioMinisterio");

module.exports = class UsuarioMinisterioControle {
    criar = async (request, response) => {
        try {
            const item = this.preencher(new UsuarioMinisterio(), request.body.usuario_ministerio);
            await item.create();
            return response.status(201).send({
                status: true, msg: "Vínculo cadastrado", id_usuarios_ministerios: item.id_usuarios_ministerios
            });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500).send({
                status: false, msg: error.code === "ER_NO_REFERENCED_ROW_2"
                    ? "Usuário ou ministério informado não existe" : "Erro ao cadastrar vínculo"
            });
        }
    }

    listar = async (request, response) => this.ler(request, response, false);
    buscar = async (request, response) => this.ler(request, response, true);

    ler = async (request, response, porId) => {
        try {
            const item = new UsuarioMinisterio();
            if (porId) item.id_usuarios_ministerios = request.params.id_usuarios_ministerios;
            const dados = porId ? await item.readById() : await item.readAll();
            if (porId && dados.length === 0) {
                return response.status(404).send({ status: false, msg: "Vínculo não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Executado com sucesso", dados });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao consultar vínculos" });
        }
    }

    atualizar = async (request, response) => {
        try {
            const item = this.preencher(new UsuarioMinisterio(), request.body.usuario_ministerio);
            item.id_usuarios_ministerios = request.params.id_usuarios_ministerios;
            if (!(await item.update())) {
                return response.status(404).send({ status: false, msg: "Vínculo não encontrado ou sem alterações" });
            }
            return response.status(200).send({ status: true, msg: "Vínculo atualizado" });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500).send({
                status: false, msg: error.code === "ER_NO_REFERENCED_ROW_2"
                    ? "Usuário ou ministério informado não existe" : "Erro ao atualizar vínculo"
            });
        }
    }

    remover = async (request, response) => {
        try {
            const item = new UsuarioMinisterio();
            item.id_usuarios_ministerios = request.params.id_usuarios_ministerios;
            if (!(await item.delete())) {
                return response.status(404).send({ status: false, msg: "Vínculo não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Vínculo removido" });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao remover vínculo" });
        }
    }

    preencher = (item, dados) => {
        item.id_usuario = dados.id_usuario;
        item.id_ministerio = dados.id_ministerio;
        item.data_entrada = dados.data_entrada;
        item.funcao = dados.funcao;
        return item;
    }
}
