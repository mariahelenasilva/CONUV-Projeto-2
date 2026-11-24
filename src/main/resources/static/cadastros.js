const pagina = document.querySelector('main');
const api = '/' + pagina.dataset.cadastro;
const formulario = document.querySelector('#cadastroForm');
const id = document.querySelector('#id');
const campos = [...formulario.querySelectorAll('input:not([type=hidden]), select')];
const seletores = campos.filter(campo => campo.dataset.origem);
const salvar = document.querySelector('#btnSalvar');
const cancelar = document.querySelector('#btnCancelar');
const lista = document.querySelector('#listaRegistros');
const mensagem = document.querySelector('#mensagem');
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function exibirMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? 'red' : 'green';
}

async function requisitar(url, method = 'GET', dados) {
    const opcoes = { method };
    if (dados) {
        opcoes.headers = { 'Content-Type': 'application/json' };
        opcoes.body = JSON.stringify(dados);
    }
    const resposta = await fetch(url, opcoes);
    if (!resposta.ok) {
        const problema = await resposta.json().catch(() => ({}));
        throw new Error(problema.detail || 'Erro HTTP ' + resposta.status);
    }
    return resposta.json();
}

function limparFormulario() {
    formulario.reset();
    id.value = '';
    salvar.textContent = 'Cadastrar';
    cancelar.hidden = true;
}

function editar(registro) {
    id.value = registro.id;
    for (const campo of campos) campo.value = registro[campo.id] ?? '';
    salvar.textContent = 'Salvar alterações';
    cancelar.hidden = false;
    campos[0].focus();
}

function botao(rotulo, acao) {
    const elemento = document.createElement('button');
    elemento.type = 'button';
    elemento.textContent = rotulo;
    elemento.addEventListener('click', acao);
    return elemento;
}

function formatar(campo, valor) {
    if (valor == null) return '';
    if (campo.dataset.origem) {
        return [...campo.options].find(opcao => opcao.value === String(valor))?.text ?? '#' + valor;
    }
    if (campo.id === 'valorVenda') return moeda.format(valor);
    if (campo.type === 'date') return valor.split('-').reverse().join('/');
    return valor;
}

function renderizar(registros) {
    lista.replaceChildren();
    for (const registro of registros) {
        const linha = lista.insertRow();
        linha.insertCell().textContent = registro.id;
        for (const campo of campos) linha.insertCell().textContent = formatar(campo, registro[campo.id]);
        const acoes = linha.insertCell();
        acoes.className = 'acoes';
        acoes.append(botao('Editar', () => editar(registro)), botao('Excluir', () => excluir(registro.id)));
    }
}

async function excluir(registroId) {
    if (!confirm('Deseja realmente excluir este registro?')) return;
    try {
        renderizar(await requisitar(api + '/' + registroId, 'DELETE'));
        if (id.value === String(registroId)) limparFormulario();
        exibirMensagem('Registro excluído com sucesso!');
    } catch (erro) {
        exibirMensagem(erro.message, true);
    }
}

formulario.addEventListener('submit', async evento => {
    evento.preventDefault();
    const editando = Boolean(id.value);
    const dados = {};
    for (const campo of campos) {
        dados[campo.id] = campo.type === 'number' || campo.dataset.origem ? Number(campo.value) : campo.value.trim();
    }
    if (editando) dados.id = Number(id.value);

    salvar.disabled = true;
    try {
        renderizar(await requisitar(api, editando ? 'PUT' : 'POST', dados));
        limparFormulario();
        exibirMensagem(editando ? 'Registro atualizado com sucesso!' : 'Registro cadastrado com sucesso!');
    } catch (erro) {
        exibirMensagem(erro.message, true);
    } finally {
        salvar.disabled = false;
    }
});

cancelar.addEventListener('click', limparFormulario);

async function carregar() {
    try {
        const [registros] = await Promise.all([
            requisitar(api),
            ...seletores.map(async campo => {
                const opcoes = await requisitar('/' + campo.dataset.origem);
                campo.replaceChildren(new Option('Selecione', ''));
                for (const item of opcoes) campo.add(new Option(item.nome + ' (#' + item.id + ')', item.id));
            })
        ]);
        renderizar(registros);
        salvar.disabled = seletores.some(campo => campo.options.length < 2);
        if (salvar.disabled) exibirMensagem('Cadastre um cliente e um produto antes de registrar uma venda.');
    } catch (erro) {
        exibirMensagem(erro.message, true);
    }
}

carregar();
