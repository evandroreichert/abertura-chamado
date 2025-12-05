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


function valorOuPadrao(valor, padrao = 'CONFIGURAR NO LOCAL') {
    return valor || padrao;
}

// Função para verificar se é troca de endereço
function isTrocaEndereco(tipoProcesso) {
    const tipoLower = tipoProcesso.toLowerCase();
    return tipoLower.includes('troca de endereço') || tipoLower.includes('troca de endereco');
}

function adicionarInputFTTA() {
    const tipoProcessoSelect = document.getElementById('tipo_processo');
    const tipoProcesso = tipoProcessoSelect ? tipoProcessoSelect.value : '';
    const descricaoParent = document.getElementById('plano').parentElement;

    let containerCaixaFTTA = document.getElementById('container-caixa-ftta');
    let containerFTTA = document.getElementById('container-ftta');


    // Controlar visibilidade do campo Fidelidade
    const fidelidadeContainer = document.querySelector('input[name="fidelidade"]')?.closest('.form-group');
    const isProcessoTrocaEndereco = isTrocaEndereco(tipoProcesso);
    
    if (fidelidadeContainer) {
        if (isProcessoTrocaEndereco) {
            fidelidadeContainer.style.display = 'none';
            // Limpar seleção de fidelidade quando oculto
            const fidelidadeInputs = document.querySelectorAll('input[name="fidelidade"]');
            fidelidadeInputs.forEach(input => input.checked = false);
        } else {
            fidelidadeContainer.style.display = 'block';
        }
    }

    const isTrocaFTTA = tipoProcesso.includes('FTTA') && tipoProcesso.includes('Troca');
    const isInstalacaoFTTA = tipoProcesso.includes('FTTA') && tipoProcesso.includes('Instalação');

    if (isTrocaFTTA) {
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
    const isProcessoTrocaEndereco = isTrocaEndereco(dados.processo);
    
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

    const caixaFtta = obterValorCampo('caixa_ftta');
    if (caixaFtta && caixaFtta.trim() !== '') {
        textoChamado += `\nCAIXA FTTA: ${caixaFtta}`;
    }

    textoChamado += `

PPPOE: ${dados.pppoe}_____
NOME DA REDE: ${valorOuPadrao(dados.login)}_____
SENHA DA REDE: ${valorOuPadrao(dados.senha)}_____

TIPO DE PLANO: ${dados.plano}_____
`;

    // Só adicionar fidelidade se NÃO for troca de endereço
    if (!isProcessoTrocaEndereco) {
        textoChamado += `
FIDELIDADE: ${dados.fidelidade}_____`;
    }

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
        showToast('Chamado copiado com sucesso!');
    } else {
        showToast('Falha ao copiar chamado!', true);
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
    
    // Reexecutar a função para restaurar a visibilidade dos campos
    adicionarInputFTTA();
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

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');

  setTimeout(() => {
    toast.classList.remove('show', 'error');
  }, 3000);
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
}

// ================================
// WIDGET DIÁRIO INTERATIVO
// ================================

function inicializarWidgetDiario() {
    const curiosidades = [
        "A internet global consome mais energia que a Argentina inteira! ⚡",
        "Um cabo submarino de fibra óptica pode transmitir 99% da velocidade da luz! 🌊",
        "O Brasil tem mais de 600 mil km de fibra óptica instalada - dá 15 voltas na Terra! 🇧🇷🌎",
        "99% do tráfego de internet entre continentes passa por cabos submarinos! 🌊",
        "O primeiro email foi enviado em 1971 - antes do WhatsApp existir! 📧",
        "Uma única fibra óptica é mais fina que um fio de cabelo humano! 💇‍♀️",
        "O WiFi foi inventado por acidente enquanto estudavam buracos negros! 🕳️",
        "Google processa mais de 8,5 bilhões de pesquisas por dia! 🔍",
        "Streaming de vídeo representa 60% de todo tráfego de internet! 🎬",
        "O ping para a Lua seria de 2,6 segundos (se tivesse WiFi lá)! 🌙",
        "Existem mais dispositivos conectados que pessoas no mundo! 📱",
        "TikTok consome mais dados que Netflix por minuto assistido! 📱",
        "A palavra 'spam' vem de uma marca de presunto enlatado! 🥫",
        "5,5 bilhões de pessoas usam internet - 68% da população mundial! 🌐",
        "241 milhões de novas pessoas entraram nas redes sociais em 2024! 📲",
        "Fibra óptica é 10-20x mais rápida que cabos de 100MB tradicionais! ⚡",
        "Mais de 5 bilhões de km de fibra óptica já foram instalados no mundo! 🌍",
        "O cabo 2Africa tem 45.000km - conecta 3 continentes e 33 países! 🌍",
        "Fibra óptica aguenta -40°C a +70°C sem problemas! 🌡️",
        "28.000km de cabo FLAG equivalem a 14 viagens à Lua! 🚀",
        "Mônaco foi o 1º país com 100% cobertura de fibra óptica! 🇲🇨",
        "Mercado de fibra óptica vai de US$ 7,7bi para US$ 11,3bi até 2030! 💰",
        "Europa do Norte lidera com 99% de penetração de internet! 🇳🇴🥇",
        "660.000 novos usuários de redes sociais por dia em 2024! 📱",
        "5G vai movimentar US$ 52 bilhões até 2028 graças à fibra! 📡",
        "XGS-PON oferece 10 Gbps simétricos - o futuro chegou! 🚀",
        "Fibras de múltiplos núcleos podem transmitir vários canais simultâneos! 🌈",
        "Fibras ocas (ar no lugar de vidro) são ainda mais rápidas! 💨",
        "DWDM permite múltiplos canais em uma única fibra! 📡",
        "EUA dominam 87,4% do mercado norte-americano de fibra! 🇺🇸📊",
        "Cabos de fibra suportam até 200 libras de tensão com kevlar! 💪",
        "Drones de fibra óptica são imunes a guerra eletrônica! 🛸",
        "Bell Labs bateu recorde: 100 petabit × km/s de transmissão! 🏆",
        "Internet cresceu 3,4% em 2024 - mais rápido que no ano passado! 📈",
        "5,22 bilhões usam redes sociais - 63,8% da população mundial! 📱",
        "Fibras quânticas vão permitir comunicação instantânea ultra-segura! ⚛️",
        "A guerra Rússia-Ucrânia usa drones de fibra desde março 2024! 🛸",
        "97 milhões de pessoas ficaram online pela primeira vez em 2023! 🆕",
        "Holanda, Noruega e Arábia Saudita têm 99% de penetração de internet! 🏆",
        "Cabo submarino pode durar 25 anos no fundo do oceano! 🌊",
        "Um único cabo de fibra pode carregar 10 terabits por segundo! 💾",
        "Cabos submarinos de internet enfrentam tubarões que mordem pensando ser comida! 🦈",
        "IPv6 tem 340 undecilhões de endereços - isso é 340 trilhões de trilhões de trilhões! 🔢",
        "Coreia do Sul tem a internet mais rápida do mundo: 104,6 Mbps de média! 🇰🇷⚡",
        "CDNs reduzem latência distribuindo conteúdo globalmente em microsegundos! 🌐",
        "Uma única torre 5G pode cobrir até 200 metros em área urbana densa! 📡",
        "Inteligência Artificial já representa 13% do tráfego global de internet! 🤖",
        "Fibra óptica monomodo pode transmitir até 100km sem amplificação! 📏",
        "FTTH (fibra até casa) cresce 15% ao ano mundialmente! 🏠📈",
        "Cabos de fibra subaquáticos resistem a pressão de 8 toneladas por m²! 🌊💪",
        "Li-Fi transmite dados através de luz LED - mais rápido que WiFi! 💡",
        "Internet das Coisas terá 75 bilhões de dispositivos até 2025! 📱🏠",
        "Japão testa fibra óptica com velocidade de 319 terabits por segundo! 🇯🇵🚀",
        "DWDM permite 160 canais diferentes em uma única fibra! 🌈",
        "Cabos de energia elétrica agora carregam internet via BPL! ⚡🌐",
        "6G promete velocidades de 1 terabit por segundo até 2030! 🚀",
        "Fibra óptica pode detectar terremotos analisando vibrações! 🌍",
        "WiFi 7 promete 46 gigabits por segundo - 4x mais rápido que WiFi 6! 📶",
        "Cabos de fibra suportam temperatura de -55°C a +85°C! 🌡️",
        "Backbone brasileiro tem mais de 1 milhão de km de fibra! 🇧🇷",
        "Cabo submarino mais profundo está a 8.000 metros no oceano! 🌊📏",
        "Fibra óptica biodegradável está sendo desenvolvida com açúcar! 🍃",
        "Cabo submarino mais longo tem 39.000km - quase uma volta na Terra! 🌍📏",
        "Brasil é o 4º país com mais usuários de internet: 165 milhões! 🇧🇷🥉",
        "ISPs regionais foram responsáveis por 90% da expansão da banda larga em 2019! 🚀",
        "Indústria de telecom gera 545 mil empregos diretos no Brasil! 👔",
    ];

    const dataDiaria = new Date();
    const seed = dataDiaria.getDate() + dataDiaria.getMonth() * 31 + dataDiaria.getFullYear() * 365;
    const curiosidadeIndex = seed % curiosidades.length;
    
    const widgetQuote = document.getElementById('dailyQuote');
    const widgetDate = document.getElementById('widgetDate');
    
    if (widgetQuote && widgetDate) {
        widgetQuote.textContent = curiosidades[curiosidadeIndex];
        
        const opcoes = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        widgetDate.textContent = dataDiaria.toLocaleDateString('pt-BR', opcoes);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    inicializarApp();
    inicializarWidgetDiario();
});