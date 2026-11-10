const TOKEN_KEY = "bresan_token";

const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

function tokenIsValid(token) {
    try {
        const encoded = token.split(".")[1];
        if (!encoded) return false;
        const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
        const payload = JSON.parse(new TextDecoder().decode(bytes));
        return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

const message = new URLSearchParams(window.location.search).get("message");
if (message) loginMessage.textContent = message;

const token = localStorage.getItem(TOKEN_KEY);
if (token && tokenIsValid(token)) {
    window.location.replace("eventos.html");
} else if (token) {
    localStorage.removeItem(TOKEN_KEY);
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginMessage.textContent = "";
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const formData = new FormData(loginForm);
        const response = await fetch("/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: {
                    email: formData.get("email"),
                    senha: formData.get("senha")
                }
            })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.status === false) {
            throw new Error(result.msg || "Não foi possível concluir a solicitação.");
        }

        localStorage.setItem(TOKEN_KEY, result.token);
        window.location.replace("eventos.html");
    } catch (error) {
        loginMessage.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    }
});
