const API_BASE = "";
const TOKEN_KEY = "bresan_token";

const state = {
    records: { eventos: [], ministerios: [], usuarios: [], vinculos: [] },
    editingId: null,
    canManage: false,
    filters: {}
};

const fieldDefinitions = {
    eventos: [
        { name: "titulo", label: "Nome do evento", required: true, maxLength: 255, full: true },
        { name: "descricao", label: "Descrição", type: "textarea", required: true, maxLength: 255, full: true },
        { name: "data_evento", label: "Data", type: "date", required: true },
        { name: "local_evento", label: "Local", required: true, maxLength: 255 },
        { name: "limite_vagas", label: "Limite de vagas", type: "number", min: 0, required: true },
        { name: "status_evento", label: "Status", type: "select", required: true,
            options: ["PLANEJADO", "ABERTO", "ENCERRADO", "CANCELADO"] }
    ],
    ministerios: [
        { name: "nome", label: "Nome do ministério", required: true, maxLength: 255, full: true },
        { name: "descricao", label: "Descrição", type: "textarea", maxLength: 255, full: true },
        { name: "dia_reuniao", label: "Dia da reunião", required: true, maxLength: 255 },
        { name: "id_coordenador", label: "Coordenador", type: "select", options: "usuarios" }
    ],
    usuarios: [
        { name: "nome", label: "Nome completo", required: true, minLength: 3, maxLength: 255 },
        { name: "tipo_usuario", label: "Tipo de usuário", required: true, maxLength: 255,
            placeholder: "Ex.: MEMBRO, LIDER ou ADM" },
        { name: "email", label: "E-mail", type: "email", required: true, maxLength: 255 },
        { name: "tel", label: "Telefone", type: "tel", maxLength: 255 },
        { name: "data_nasc", label: "Data de nascimento", type: "date" },
        { name: "senha", label: "Senha", type: "password", required: true, full: true,
            placeholder: "Defina uma senha", hint: "Ao editar, deixe em branco para manter a senha atual." }
    ],
    vinculos: [
        { name: "id_usuario", label: "Usuário", type: "select", options: "usuarios", required: true },
        { name: "id_ministerio", label: "Ministério", type: "select", options: "ministerios", required: true },
        { name: "data_entrada", label: "Data de entrada", type: "date", required: true },
        { name: "funcao", label: "Função no ministério", required: true, maxLength: 255, full: true }
    ]
};

const sectionConfig = {
    eventos: {
        endpoint: "/eventos",
        id: "id_evento",
        label: "evento",
        wrapper: "evento",
        fields: ["titulo", "descricao", "data_evento", "local_evento", "limite_vagas", "status_evento"]
    },
    ministerios: {
        endpoint: "/ministerios",
        id: "id_ministerios",
        label: "ministério",
        wrapper: "ministerio",
        fields: ["nome", "descricao", "dia_reuniao", "id_coordenador"]
    },
    usuarios: {
        endpoint: "/usuarios",
        id: "id_usuarios",
        label: "usuário",
        wrapper: "usuario",
        fields: ["nome", "email", "senha", "tel", "data_nasc", "tipo_usuario"]
    },
    vinculos: {
        endpoint: "/usuarios-ministerios",
        id: "id_usuarios_ministerios",
        label: "vínculo",
        wrapper: "usuario_ministerio",
        fields: ["id_usuario", "id_ministerio", "data_entrada", "funcao"]
    }
};

const countLabels = {
    eventos: ["evento", "eventos"],
    ministerios: ["ministério", "ministérios"],
    usuarios: ["usuário", "usuários"],
    vinculos: ["vínculo", "vínculos"]
};

const section = document.body.dataset.section;
const recordDialog = document.querySelector("#record-dialog");
const recordForm = document.querySelector("#record-form");
const dialogFields = document.querySelector("#dialog-fields");
const dialogMessage = document.querySelector("#dialog-message");
const notice = document.querySelector("#notice");

function authHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: token } : {};
}

async function request(path, options = {}) {
    const headers = { ...authHeaders(), ...options.headers };
    if (options.body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const payload = await response.json().catch(() => ({}));

    if (response.status === 401) endSession("Sua sessão expirou. Entre novamente.");
    if (!response.ok || payload.status === false) {
        throw new Error(payload.msg || "Não foi possível concluir a solicitação.");
    }
    return payload;
}

function showNotice(message, isError = false) {
    notice.textContent = message;
    notice.classList.toggle("error", isError);
    notice.hidden = false;
}

function endSession(message = "") {
    localStorage.removeItem(TOKEN_KEY);
    const login = new URL("login.html", window.location.href);
    if (message) login.searchParams.set("message", message);
    window.location.replace(login);
}

document.querySelector("[data-logout]").addEventListener("click", () => endSession());

document.querySelectorAll("[data-new]").forEach((button) => {
    button.addEventListener("click", () => {
        if (state.canManage) openRecordDialog(button.dataset.new);
    });
});

document.querySelectorAll("[data-refresh]").forEach((button) => {
    button.addEventListener("click", () => loadRecords(button.dataset.refresh, true));
});

document.querySelectorAll("[data-filter]").forEach((input) => {
    input.addEventListener("input", () => {
        const filteredSection = input.dataset.filter;
        state.filters[filteredSection] = input.value;
        renderRecords(filteredSection);
    });
});

document.querySelectorAll(".record-list").forEach((list) => {
    list.addEventListener("click", async (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const section = button.closest(".record-list").id.replace("-list", "");
        const config = sectionConfig[section];
        const record = state.records[section].find((item) =>
            String(item[config.id]) === button.dataset.id
        );
        if (!record) return;

        if (button.dataset.action === "edit") {
            openRecordDialog(section, record);
        } else if (button.dataset.action === "delete") {
            const name = record.titulo || record.nome
                || [record.nome_usuario, record.nome_ministerio].filter(Boolean).join(" - ");
            if (!window.confirm(`Deseja excluir ${config.label} "${name}"?`)) return;
            try {
                await request(`${config.endpoint}/${encodeURIComponent(record[config.id])}`, {
                    method: "DELETE"
                });
                showNotice(`${capitalize(config.label)} removido com sucesso.`);
                await loadRecords(section);
            } catch (error) {
                showNotice(error.message, true);
            }
        }
    });
});

recordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const section = recordDialog.dataset.section;
    const config = sectionConfig[section];
    const values = Object.fromEntries(new FormData(recordForm).entries());

    if (section === "ministerios" && !values.id_coordenador) values.id_coordenador = null;
    if (section === "usuarios" && !values.tel) values.tel = null;
    if (section === "usuarios" && !values.data_nasc) values.data_nasc = null;
    if (section === "eventos") values.limite_vagas = Number(values.limite_vagas);
    if (section === "ministerios" && values.id_coordenador) {
        values.id_coordenador = Number(values.id_coordenador);
    }
    if (section === "vinculos") {
        values.id_usuario = Number(values.id_usuario);
        values.id_ministerio = Number(values.id_ministerio);
    }

    const isEditing = state.editingId !== null;
    const url = isEditing
        ? `${config.endpoint}/${encodeURIComponent(state.editingId)}`
        : config.endpoint;
    const method = isEditing ? "PUT" : "POST";
    const submitButton = document.querySelector("#save-record");
    submitButton.disabled = true;
    dialogMessage.textContent = "";
    try {
        await request(url, {
            method,
            body: JSON.stringify({ [config.wrapper]: values })
        });
        recordDialog.close();
        showNotice(`${capitalize(config.label)} ${isEditing ? "atualizado" : "cadastrado"} com sucesso.`);
        await loadRecords(section);
    } catch (error) {
        dialogMessage.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});

document.querySelector("#close-dialog").addEventListener("click", () => recordDialog.close());
document.querySelector("#cancel-dialog").addEventListener("click", () => recordDialog.close());

async function loadRecords(section, announce = false) {
    const config = sectionConfig[section];
    try {
        const result = await request(config.endpoint);
        if (!Array.isArray(result.dados)) throw new Error(`A resposta de ${config.label} está em formato inválido.`);
        state.records[section] = result.dados;
        renderRecords(section);
        if (announce) showNotice(`Lista de ${section} atualizada.`);
    } catch (error) {
        showNotice(`Não foi possível carregar ${section}: ${error.message}`, true);
    }
}

function renderRecords(section) {
    const records = state.records[section];
    const list = document.querySelector(`#${section}-list`);
    if (!list) return;
    const empty = document.querySelector(`#${section}-empty`);
    const count = document.querySelector(`#${section}-count`);
    const query = normalizeText(state.filters[section] || "");
    const filteredRecords = query
        ? records.filter((record) => normalizeText(Object.values(record).join(" ")).includes(query))
        : records;
    list.replaceChildren(...filteredRecords.map((record) => createRecordCard(section, record)));
    const labels = countLabels[section];
    count.textContent = query
        ? `${filteredRecords.length} de ${records.length} ${labels[1]}`
        : `${records.length} ${records.length === 1 ? labels[0] : labels[1]}`;
    empty.textContent = query ? "Nenhum resultado para essa pesquisa." : `Nenhum ${labels[0]} cadastrado por enquanto.`;
    empty.hidden = filteredRecords.length !== 0;
}

function createRecordCard(section, record) {
    const card = document.createElement("article");
    card.className = "record-card";
    const main = document.createElement("div");
    main.className = "record-main";
    const titleRow = document.createElement("div");
    titleRow.className = "record-title-row";
    const title = document.createElement("h2");
    title.className = "record-title";
    title.textContent = record.titulo || record.nome || record.nome_usuario || "Sem nome";
    titleRow.append(title);

    if (section === "eventos" && record.status_evento) {
        const status = document.createElement("span");
        status.className = `status-pill${/encerrado|cancelado/i.test(record.status_evento) ? " closed" : ""}`;
        status.textContent = record.status_evento;
        titleRow.append(status);
    }
    main.append(titleRow);

    const meta = document.createElement("div");
    meta.className = "record-meta";
    const details = getRecordDetails(section, record);
    details.forEach((detail) => {
        const item = document.createElement("span");
        item.textContent = detail;
        meta.append(item);
    });
    if (details.length) main.append(meta);

    if ((section === "eventos" || section === "ministerios") && record.descricao) {
        const description = document.createElement("p");
        description.className = "record-description";
        description.textContent = record.descricao;
        main.append(description);
    }

    if (state.canManage) {
        const actions = document.createElement("div");
        actions.className = "record-actions";
        actions.append(
            createActionButton("Editar", "edit", record[sectionConfig[section].id]),
            createActionButton("Excluir", "delete", record[sectionConfig[section].id], true)
        );
        card.append(main, actions);
    } else {
        card.append(main);
    }
    return card;
}

function getRecordDetails(section, record) {
    if (section === "eventos") {
        return [
            formatDate(record.data_evento),
            record.local_evento,
            record.limite_vagas === null ? "" : `${record.limite_vagas} vagas`
        ].filter(Boolean);
    }
    if (section === "ministerios") {
        const coordinator = state.records.usuarios.find((user) =>
            String(user.id_usuarios) === String(record.id_coordenador)
        );
        const coordinatorName = record.nome_coordenador || (coordinator && coordinator.nome);
        return [record.dia_reuniao && `Reuniões: ${record.dia_reuniao}`,
            coordinatorName && `Coordenação: ${coordinatorName}`].filter(Boolean);
    }
    if (section === "vinculos") {
        return [
            record.nome_ministerio && `Ministério: ${record.nome_ministerio}`,
            record.funcao,
            record.data_entrada && `Desde ${formatDate(record.data_entrada)}`
        ].filter(Boolean);
    }
    return [record.email, record.tipo_usuario, record.tel].filter(Boolean);
}

function createActionButton(label, action, id, destructive = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `action-button${destructive ? " delete" : ""}`;
    button.dataset.action = action;
    button.dataset.id = id;
    button.textContent = label;
    return button;
}

function formatDate(value) {
    if (!value) return "";
    const datePart = String(value).slice(0, 10);
    const parts = datePart.split("-");
    if (parts.length !== 3) return datePart;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeText(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function readTokenPayload(token) {
    const encoded = token.split(".")[1];
    if (!encoded) throw new Error("Sessão inválida.");
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
}

function openRecordDialog(section, record = null) {
    if (!state.canManage) return;
    const isEditing = record !== null;
    state.editingId = isEditing ? record[sectionConfig[section].id] : null;
    recordDialog.dataset.section = section;
    recordForm.reset();
    dialogFields.replaceChildren();
    dialogMessage.textContent = "";
    document.querySelector("#dialog-title").textContent =
        `${isEditing ? "Editar" : "Novo"} ${sectionConfig[section].label}`;

    fieldDefinitions[section].forEach((definition) => {
        const field = createFormField(definition, section, record);
        dialogFields.append(field);
    });
    const password = recordForm.elements.namedItem("senha");
    if (section === "usuarios" && isEditing) {
        password.required = false;
        password.value = "";
    }
    recordDialog.showModal();
}

function createFormField(definition, section, record) {
    const wrapper = document.createElement("div");
    wrapper.className = `field${definition.full ? " field-full" : ""}`;
    const id = `field-${section}-${definition.name}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = definition.label;

    let input;
    if (definition.type === "textarea") {
        input = document.createElement("textarea");
    } else if (definition.type === "select") {
        input = document.createElement("select");
        const options = definition.options === "usuarios"
            ? [
                ...(definition.name === "id_coordenador" ? [{ value: "", label: "Sem coordenador" }] : []),
                ...state.records.usuarios.map((user) => ({
                    value: user.id_usuarios,
                    label: user.nome
                }))
            ]
            : definition.options === "ministerios"
                ? state.records.ministerios.map((ministerio) => ({
                    value: ministerio.id_ministerios,
                    label: ministerio.nome
                }))
                : definition.options.map((value) => ({ value, label: value }));
        if (record && definition.options !== "usuarios"
            && record[definition.name] && !options.some((option) => option.value === record[definition.name])) {
            options.push({ value: record[definition.name], label: record[definition.name] });
        }
        options.forEach((option) => {
            const element = document.createElement("option");
            element.value = option.value;
            element.textContent = option.label;
            input.append(element);
        });
    } else {
        input = document.createElement("input");
        input.type = definition.type || "text";
    }

    input.id = id;
    input.name = definition.name;
    input.required = Boolean(definition.required);
    if (definition.maxLength) input.maxLength = definition.maxLength;
    if (definition.minLength) input.minLength = definition.minLength;
    if (definition.min !== undefined) input.min = String(definition.min);
    if (definition.placeholder) input.placeholder = definition.placeholder;
    if (record && record[definition.name] !== null && record[definition.name] !== undefined) {
        input.value = definition.type === "date"
            ? String(record[definition.name]).slice(0, 10)
            : record[definition.name];
    }
    wrapper.append(label, input);
    if (definition.hint) {
        const hint = document.createElement("span");
        hint.className = "field-hint";
        hint.textContent = definition.hint;
        wrapper.append(hint);
    }
    return wrapper;
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
        window.location.replace("login.html");
        return;
    }
    try {
        const tokenData = readTokenPayload(token);
        const role = tokenData.tipo_usuario || tokenData.role;
        state.canManage = typeof role === "string"
            && ["ADM", "PASTOR"].includes(role.trim().toUpperCase());
        document.querySelectorAll("[data-managed-only]").forEach((element) => {
            element.hidden = !state.canManage;
        });
        if (section === "usuarios" && !state.canManage) {
            window.location.replace("eventos.html");
            return;
        }
        if (section === "vinculos" && !state.canManage) {
            window.location.replace("eventos.html");
            return;
        }
        document.querySelector("#user-name").textContent = tokenData.name || "bem-vindo(a)";
        if (state.canManage && section === "ministerios") {
            await loadRecords("usuarios");
        }
        if (state.canManage && section === "vinculos") {
            await Promise.all([loadRecords("usuarios"), loadRecords("ministerios")]);
        }
        await loadRecords(section);
    } catch {
        endSession("Sua sessão expirou. Entre novamente.");
    }
});
