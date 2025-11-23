const campoTexto = document.getElementById('campoTexto');
const categoria = document.getElementById('categoria');
const botaoAdicionar = document.getElementById('adicao');
const filtro = document.getElementById('filtro');
const listaTarefa = document.getElementById('listaTarefa');
const toastContainer = document.getElementById('toastContainer');

let tarefas = [];

function mostrarToast(mensagem, tipo = "primary") {
    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-bg-${tipo} border-0`;
    toastEl.setAttribute("role", "alert");
    toastEl.setAttribute("aria-live", "assertive");
    toastEl.setAttribute("aria-atomic", "true");

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensagem}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);

    const bsToast = new bootstrap.Toast(toastEl, { delay: 2000 });
    bsToast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

function mostrarTarefas(filtroSelecionado = "Todas") {
    listaTarefa.innerHTML = "";

    tarefas.forEach((tarefaItem, indice) => {
        if (filtroSelecionado !== "Todas" && tarefaItem.categoria !== filtroSelecionado) return;

        const div = document.createElement("div");
        div.className = "tarefa" + (tarefaItem.concluida ? " concluida" : "");
        div.dataset.categoria = tarefaItem.categoria;

        div.style.opacity = 0;
        setTimeout(() => div.style.opacity = 1, 50);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarefaItem.concluida;
        checkbox.onclick = () => {
            tarefaItem.concluida = checkbox.checked;
            mostrarTarefas(filtro.value);
        };

        const span = document.createElement("span");
        span.textContent = ` ${tarefaItem.texto} [${tarefaItem.categoria}] `;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.onclick = () => {
            tarefas.splice(indice, 1);
            mostrarTarefas(filtro.value);
            mostrarToast("Tarefa excluída!", "danger");
        };

        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(botaoExcluir);
        listaTarefa.appendChild(div);
    });
}

botaoAdicionar.onclick = () => {
    const texto = campoTexto.value.trim();
    const categoriaSelecionada = categoria.value;

    if (!texto) {
        mostrarToast("Digite uma tarefa!", "warning");
        return;
    }

    if (tarefas.length >= 10) {
        mostrarToast("Limite de 10 tarefas atingido!", "warning");
        return;
    }

    tarefas.push({ texto, categoria: categoriaSelecionada, concluida: false });
    campoTexto.value = "";
    mostrarTarefas(filtro.value);
    mostrarToast("Tarefa adicionada!", "success");
};

filtro.onchange = () => mostrarTarefas(filtro.value);

mostrarTarefas();
