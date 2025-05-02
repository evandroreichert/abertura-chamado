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

function adicionarInputFTTA() {
    const tipoProcessoSelect = document.getElementById('tipo_processo');
    const tipoProcesso = tipoProcessoSelect ? tipoProcessoSelect.value : '';
    const descricaoParent = document.getElementById('plano').parentElement;

    let containerCaixaFTTA = document.getElementById('container-caixa-ftta');
    let containerFTTA = document.getElementById('container-ftta');

    const ctoInputIds = ['cto1', 'metragem1', 'cto2', 'metragem2', 'cto3', 'metragem3'];
    
    const ctoContainers = ctoInputIds.map(id => {
        const input = document.getElementById(id);
        return input ? input.closest('.form-group') : null;
    }).filter(container => container !== null);

    const isTrocaFTTA = tipoProcesso.includes('FTTA') && tipoProcesso.includes('Troca');
    const isInstalacaoFTTA = tipoProcesso.includes('FTTA') && tipoProcesso.includes('Instalação');

    if (isTrocaFTTA) {
        ctoContainers.forEach(container => {
            container.style.display = 'none';
        });

        if (containerFTTA) {
            containerFTTA.remove();
        }

        if (!containerCaixaFTTA && descricaoParent) {
            const novoContainer = document.createElement('div');
            novoContainer.id = 'container-caixa-ftta';
            novoContainer.className = 'form-group';
            novoContainer.innerHTML = `
                <label for="caixa_ftta">Caixa FTTA</label>
                <input type="text" id="caixa_ftta" name="caixa_ftta" class="form-control" required>
            `;
            
            if (descricaoParent.parentNode) {
                descricaoParent.parentNode.insertBefore(novoContainer, descricaoParent);
            }
        }
    } 
    else if (isInstalacaoFTTA) {
        ctoContainers.forEach(container => {
            container.style.display = 'block';
        });

        if (containerCaixaFTTA) {
            containerCaixaFTTA.remove();
        }

        if (!containerFTTA && descricaoParent) {
            const novoContainer = document.createElement('div');
            novoContainer.id = 'container-ftta';
            novoContainer.className = 'form-group';
            novoContainer.innerHTML = `
                <label for="ftta">FTTA <span class="placeholder">- Opcional</span></label>
                <textarea id="ftta" name="ftta" class="form-control"></textarea>
            `;
            
            if (descricaoParent.parentNode) {
                descricaoParent.parentNode.insertBefore(novoContainer, descricaoParent);
            }
        }
    } 
    else {
        ctoContainers.forEach(container => {
            container.style.display = 'block';
        });

        if (containerCaixaFTTA) {
            containerCaixaFTTA.remove();
        }
        if (containerFTTA) {
            containerFTTA.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const tipoProcessoSelect = document.getElementById('tipo_processo');
    
    if (tipoProcessoSelect) {
        tipoProcessoSelect.addEventListener('change', adicionarInputFTTA);
        adicionarInputFTTA();
    }
});

function gerarTextoChamado(dados) {
    let textoChamado = `
ID: ${dados.id}_____
NOME CLIENTE: ${dados.nome_cliente}_____
ENDERECO: ${dados.endereco}_____
PONTO DE REFERENCIA: ${dados.referencia}_____
PERIODO: ${dados.periodo}_____

TELEFONE PRINCIPAL: ${dados.telefone1}_____
TELEFONE SECUNDARIO: ${dados.telefone2}_____

TIPO DE PROCESSO: ${dados.processo}_____
EQUIPAMENTO EM COMODATO: ${dados.comodato}_____
`;

    let temCTO = false;
    
    if (dados.ca1 && dados.ca1.trim() !== '') {
        textoChamado += `\nCA 1: ${formatarCA(dados.ca1, dados.metragem1)}`;
        temCTO = true;
    }
    
    if (dados.ca2 && dados.ca2.trim() !== '') {
        textoChamado += `\nCA 2: ${formatarCA(dados.ca2, dados.metragem2)}`;
        temCTO = true;
    }
    
    if (dados.ca3 && dados.ca3.trim() !== '') {
        textoChamado += `\nCA 3: ${formatarCA(dados.ca3, dados.metragem3)}`;
        temCTO = true;
    }
    
    if (!temCTO) {
        const caixaFtta = obterValorCampo('caixa_ftta');
        if (caixaFtta && caixaFtta.trim() !== '') {
            textoChamado += `\nCAIXA FTTA: ${caixaFtta}`;
        }
    }

    textoChamado += `

PPPOE: ${dados.pppoe}_____
NOME DA REDE: ${valorOuPadrao(dados.login)}_____
SENHA DA REDE: ${valorOuPadrao(dados.senha)}_____

TIPO DE PLANO: ${dados.plano}_____

FIDELIDADE: ${dados.fidelidade}`;_____

    if (dados.ftta && dados.ftta.trim() !== '') {
        textoChamado += `

FTTA: \n${dados.ftta}_____`;
    }

    textoChamado += `

DESCRICAO: ${dados.descricao}_____

O CONTRATANTE DECLARA PARA TODOS OS FINS DE DIREITO QUE OS
SERVIÇOS SOLICITADOS FORAM ATIVADOS/INSTALADOS NA PRESENTE DATA,
ESTANDO EM PERFEITO FUNCIONAMENTO. O CONTRATANTE DECLARA TAMBÉM
QUE TESTOU E APROVOU OS SERVIÇOS CONTRATADOS E DIANTE DISSO O
CONTRATANTE RENUNCIA O DIREITO DE ARREPENDIMENTO, PREVISTO NO ART. 49
DA LEI 8078_____
`;
    return textoChamado;
}

function coletarDadosFormulario() {
    const dados = {
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
        
        caixa_ftta: obterValorCampo('caixa_ftta', false),

        id: obterValorCampo('id'),
        pppoe: obterValorCampo('pppoe', false),
        nome_cliente: obterValorCampo('nome_cliente'),
        endereco: obterValorCampo('endereco'),
        referencia: obterValorCampo('referencia'),
        telefone1: obterValorCampo('telefone', false),
        telefone2: obterValorCampo('telefone2', false),
        descricao: obterValorCampo('descricao'),
        ftta: obterValorCampo('ftta', false) 
    };
    return dados;
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
    
    const containerFTTA = document.getElementById('container-ftta');
    if (containerFTTA) {
        containerFTTA.remove();
    }
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
            `Este formulário foi usado <strong>${contador}</strong> vezes.`;
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
    
    document.getElementById('tipo_processo').addEventListener('change', adicionarInputFTTA);
    
    atualizarContador();
}

document.addEventListener("DOMContentLoaded", inicializarApp);