const Ministerio = require("../modelo/Ministerio");

module.exports = class MinisterioControle {
    ministerio_create_controle = async (request, response) => {
        try {
            const ministerio = this.preencherMinisterio(new Ministerio(), request.body.ministerio);
            await ministerio.create();
            return response.status(201).send({
                status: true, msg: "Cadastrado com sucesso", id_ministerios: ministerio.id_ministerios
            });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500).send({
                status: false, msg: error.code === "ER_NO_REFERENCED_ROW_2"
                    ? "Coordenador informado não existe" : "Erro ao cadastrar ministério"
            });
        }
    }

    ministerio_realAll_controle = async (request, response) => this.executarLeitura(request, response, false);
    ministerio_realById_controle = async (request, response) => this.executarLeitura(request, response, true);

    executarLeitura = async (request, response, porId) => {
        try {
            const ministerio = new Ministerio();
            if (porId) ministerio.id_ministerios = request.params.id_ministerios;
            const dados = porId ? await ministerio.readById() : await ministerio.readAll();
            if (porId && dados.length === 0) {
                return response.status(404).send({ status: false, msg: "Ministério não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Executado com sucesso", dados });
        } catch (error) {
            console.error(error);
            return response.status(500).send({ status: false, msg: "Erro ao consultar ministérios" });
        }
    }

    ministerio_update_controle = async (request, response) => {
        try {
            const ministerio = this.preencherMinisterio(new Ministerio(), request.body.ministerio);
            ministerio.id_ministerios = request.params.id_ministerios;
            if (!(await ministerio.update())) {
                return response.status(404).send({ status: false, msg: "Ministério não encontrado ou sem alterações" });
            }
            return response.status(200).send({ status: true, msg: "Atualizado com sucesso" });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_NO_REFERENCED_ROW_2" ? 400 : 500).send({
                status: false, msg: error.code === "ER_NO_REFERENCED_ROW_2"
                    ? "Coordenador informado não existe" : "Erro ao atualizar ministério"
            });
        }
    }

    ministerio_delete_controle = async (request, response) => {
        try {
            const ministerio = new Ministerio();
            ministerio.id_ministerios = request.params.id_ministerios;
            if (!(await ministerio.delete())) {
                return response.status(404).send({ status: false, msg: "Ministério não encontrado" });
            }
            return response.status(200).send({ status: true, msg: "Removido com sucesso" });
        } catch (error) {
            console.error(error);
            return response.status(error.code === "ER_ROW_IS_REFERENCED_2" ? 409 : 500).send({
                status: false, msg: error.code === "ER_ROW_IS_REFERENCED_2"
                    ? "Ministério possui usuários vinculados" : "Erro ao remover ministério"
            });
        }
    }

    preencherMinisterio = (ministerio, dados) => {
        ministerio.nome = dados.nome;
        ministerio.descricao = dados.descricao || null;
        ministerio.dia_reuniao = dados.dia_reuniao;
        ministerio.id_coordenador = dados.id_coordenador || null;
        return ministerio;
    }
}
