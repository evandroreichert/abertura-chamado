const API_URL = 'https://server-sn-production.up.railway.app';
const TEMA_ESCURO = 'dark';
const TEMA_CLARO = 'light';

const MAPA_ACENTOS = [
    { base: 'A', letras: /[ÀÁÂÃÄ]/g },
    { base: 'E', letras: /[ÈÉÊË]/g },
    { base: 'I', letras: /[ÌÍÎÏ]/g },
    { base: 'O', letras: /[ÒÓÔÕÖ]/g },
    { base: 'U', letras: /[ÙÚÛÜ]/g },
    { base: 'C', letras: /[Ç]/g },
    { base: 'N', letras: /[Ñ]/g },
    { base: 'a', letras: /[àáâãä]/g },
    { base: 'e', letras: /[èéêë]/g },
    { base: 'i', letras: /[ìíîï]/g },
    { base: 'o', letras: /[òóôõö]/g },
    { base: 'u', letras: /[ùúûü]/g },
    { base: 'c', letras: /[ç]/g },
    { base: 'n', letras: /[ñ]/g }
];

function removerAcentosECaracteresEspeciais(str) {
    if (!str) return '';
    
    return MAPA_ACENTOS.reduce((texto, acento) => 
        texto.replace(acento.letras, acento.base), str);
}

function obterValorCampo(id, uppercase = true) {
    const elemento = document.getElementById(id);
    if (!elemento) return '';
    
    const valor = elemento.value || '';
    const valorSemAcentos = removerAcentosECaracteresEspeciais(valor);
    
    return uppercase ? valorSemAcentos.toUpperCase() : valorSemAcentos;
}

function obterValorRadio(name, uppercase = true) {
    const radioSelecionado = document.querySelector(`input[name="${name}"]:checked`);
    if (!radioSelecionado || !radioSelecionado.nextElementSibling) return '';
    
    const texto = radioSelecionado.nextElementSibling.textContent || '';
    const textoSemAcentos = removerAcentosECaracteresEspeciais(texto);
    
    return uppercase ? textoSemAcentos.toUpperCase() : textoSemAcentos;
}

function formatarCA(ca, metragem) {
    if (!ca) return '';
    return `${ca}${metragem ? ` - ${metragem}M` : ''}`;
}

function valorOuPadrao(valor, padrao = 'CONFIGURAR NO LOCAL') {
    return valor || padrao;
}

function coletarDadosFormulario() {
    return {
        periodo: obterValorCampo('periodo'),
        fidelidade: obterValorRadio('fidelidade'),
        processo: obterValorCampo('tipo_processo'),
        comodato: obterValorRadio('comodato'),
        plano: obterValorCampo('plano'),
        login: obterValorCampo('login'),
        senha: obterValorCampo('senha', false),
        
        ca1: obterValorCampo('cto1'),
        ca2: obterValorCampo('cto2'),
        ca3: obterValorCampo('cto3'),
        
        metragem1: obterValorCampo('metragem1'),
        metragem2: obterValorCampo('metragem2'),
        metragem3: obterValorCampo('metragem3'),
        
        id: obterValorCampo('id'),
        pppoe: obterValorCampo('pppoe', false),
        nome_cliente: obterValorCampo('nome_cliente'),
        endereco: obterValorCampo('endereco'),
        referencia: obterValorCampo('referencia'),
        telefone1: obterValorCampo('telefone', false),
        telefone2: obterValorCampo('telefone2', false),
        descricao: obterValorCampo('descricao')
    };
}

function gerarTextoChamado(dados) {
    return `
ID: ${dados.id}
NOME CLIENTE: ${dados.nome_cliente}
ENDERECO: ${dados.endereco}
PONTO DE REFERENCIA: ${dados.referencia}
PERIODO: ${dados.periodo}

TELEFONE PRINCIPAL: ${dados.telefone1}
TELEFONE SECUNDARIO: ${dados.telefone2}

TIPO DE PROCESSO: ${dados.processo}
EQUIPAMENTO EM COMODATO: ${dados.comodato}

CA 1: ${formatarCA(dados.ca1, dados.metragem1)}
CA 2: ${formatarCA(dados.ca2, dados.metragem2)}
CA 3: ${formatarCA(dados.ca3, dados.metragem3)}

PPPOE: ${dados.pppoe}
NOME DA REDE: ${valorOuPadrao(dados.login)}
SENHA DA REDE: ${valorOuPadrao(dados.senha)}

TIPO DE PLANO: ${dados.plano}

FIDELIDADE: ${dados.fidelidade}
DESCRICAO: ${dados.descricao}

O CONTRATANTE DECLARA PARA TODOS OS FINS DE DIREITO QUE OS
SERVIÇOS SOLICITADOS FORAM ATIVADOS/INSTALADOS NA PRESENTE DATA,
ESTANDO EM PERFEITO FUNCIONAMENTO. O CONTRATANTE DECLARA TAMBÉM
QUE TESTOU E APROVOU OS SERVIÇOS CONTRATADOS E DIANTE DISSO O
CONTRATANTE RENUNCIA O DIREITO DE ARREPENDIMENTO, PREVISTO NO ART. 49
DA LEI 8078
`;
}

function exibirChamado(textoChamado) {
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.textContent = textoChamado;
    resultadoElement.style.display = "block";
}

async function copiarParaAreaDeTransferencia(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        await incrementarChamado();
        focarNovoChamado();
        return true;
    } catch (erro) {
        console.error('Erro ao copiar:', erro);
        return false;
    }
}

function focarNovoChamado() {
    setTimeout(() => {
        document.getElementById('periodo').focus();
    }, 100);
}

async function gerarChamado() {
    const dados = coletarDadosFormulario();
    const textoChamado = gerarTextoChamado(dados);
    
    exibirChamado(textoChamado);
    
    const sucessoCopia = await copiarParaAreaDeTransferencia(textoChamado);
    
    if (sucessoCopia) {
        alert('Chamado gerado e copiado para a área de transferência!');
    } else {
        alert('Falha ao copiar para a área de transferência.');
    }
}

function limparFormulario() {
    document.getElementById('chamadoForm').reset();
    const resultadoElement = document.getElementById('resultado');
    resultadoElement.textContent = '';
    resultadoElement.style.display = "none";
}

function configurarTema(modoClaro) {
    const logo = document.getElementById("logo");
    const themeLabel = document.getElementById("themeLabel");
    
    if (modoClaro) {
        document.body.classList.add("light-mode");
        themeLabel.textContent = "Light Mode";
        logo.src = "assets/light-logo.png";
        localStorage.setItem("theme", TEMA_CLARO);
    } else {
        document.body.classList.remove("light-mode");
        themeLabel.textContent = "Dark Mode";
        logo.src = "assets/dark-logo.png";
        localStorage.setItem("theme", TEMA_ESCURO);
    }
}

async function incrementarChamado() {
    try {
        const response = await fetch(`${API_URL}/incrementar`, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error('Erro ao incrementar chamado');
        }
        
        await atualizarContador();
    } catch (error) {
        console.error('Falha ao incrementar contador:', error);
    }
}

async function atualizarContador() {
    try {
        const response = await fetch(`${API_URL}/contador`);
        
        if (!response.ok) {
            throw new Error('Erro ao obter contador de chamados');
        }

        const data = await response.json();
        const contador = data.total ?? data.count ?? 'Erro';
        
        document.getElementById('contador').innerHTML = 
            `Este formulário já foi usado <strong>${contador}</strong> vezes.`;
    } catch (error) {
        console.error('Falha ao atualizar contador:', error);
        document.getElementById('contador').innerText = `Erro ao carregar contador.`;
    }
}

function inicializarApp() {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme") || TEMA_ESCURO;
    
    configurarTema(savedTheme === TEMA_CLARO);
    themeToggle.checked = savedTheme === TEMA_CLARO;
    
    themeToggle.addEventListener("change", function() {
        configurarTema(themeToggle.checked);
    });
    
    atualizarContador();
}

document.addEventListener("DOMContentLoaded", inicializarApp);