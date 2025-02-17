function removerAcentosECaracteresEspeciais(str) {
    const acentos = [
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

    acentos.forEach(acento => {
        str = str.replace(acento.letras, acento.base);
    });

    return str;
}

function gerarChamado() {
    const periodo = document.getElementById('periodo').value.toUpperCase();
    const fidelidade = document.getElementById('fidelidade').value.toUpperCase();
    const processo = removerAcentosECaracteresEspeciais(document.getElementById('tipo_processo').value.toUpperCase());
    const comodato = removerAcentosECaracteresEspeciais(document.getElementById('comodato').value.toUpperCase());
    const plano = removerAcentosECaracteresEspeciais(document.getElementById('plano').value.toUpperCase());

    const ca = removerAcentosECaracteresEspeciais(document.getElementById('cto1').value.toUpperCase());
    const ca2 = removerAcentosECaracteresEspeciais(document.getElementById('cto2').value.toUpperCase());
    const ca3 = removerAcentosECaracteresEspeciais(document.getElementById('cto3').value.toUpperCase());

    const metragem1 = removerAcentosECaracteresEspeciais(document.getElementById('metragem1').value.toUpperCase());
    const metragem2 = removerAcentosECaracteresEspeciais(document.getElementById('metragem2').value.toUpperCase());
    const metragem3 = removerAcentosECaracteresEspeciais(document.getElementById('metragem3').value.toUpperCase());

    const id = removerAcentosECaracteresEspeciais(document.getElementById('id').value.toUpperCase());
    const pppoe = removerAcentosECaracteresEspeciais(document.getElementById('pppoe').value.toUpperCase());
    const nome_cliente = removerAcentosECaracteresEspeciais(document.getElementById('nome_cliente').value.toUpperCase());
    const endereco = removerAcentosECaracteresEspeciais(document.getElementById('endereco').value.toUpperCase());
    const referencia = removerAcentosECaracteresEspeciais(document.getElementById('referencia').value.toUpperCase());
    const telefone1 = removerAcentosECaracteresEspeciais(document.getElementById('telefone').value);
    const telefone2 = removerAcentosECaracteresEspeciais(document.getElementById('telefone2').value);
    const descricao = removerAcentosECaracteresEspeciais(document.getElementById('descricao').value.toUpperCase());
        
    let chamado = `
TELEFONE PRINCIPAL: ${telefone1} _____
TELEFONE SECUNDARIO: ${telefone2} _____
NOME CLIENTE: ${nome_cliente} _____
PERIODO: ${periodo} _____

ID: ${id} _____
TIPO DE PROCESSO: ${processo}
EQUIPAMENTO EM COMODATO: ${comodato}

CA 1: ${ca} _____ - ${metragem1} _____
CA 2: ${ca2} _____ - ${metragem2} _____
CA 3: ${ca3} _____ - ${metragem3} _____


PPPOE: ${pppoe} _____
ENDERECO: ${endereco} _____
PONTO DE REFERENCIA: ${referencia} _____
TIPO DE PLANO: ${plano} _____

FIDELIDADE: ${fidelidade} _____
DESCRICAO: ${descricao} _____

O CONTRATANTE DECLARA PARA TODOS OS FINS DE DIREITO QUE OS
SERVIÇOS SOLICITADOS FORAM ATIVADOS/INSTALADOS NA PRESENTE DATA,
ESTANDO EM PERFEITO FUNCIONAMENTO. O CONTRATANTE DECLARA TAMBÉM
QUE TESTOU E APROVOU OS SERVIÇOS CONTRATADOS E DIANTE DISSO O
CONTRATANTE RENUNCIA O DIREITO DE ARREPENDIMENTO, PREVISTO NO ART. 49
DA LEI 8078
`;

    const resultadoElement = document.getElementById('resultado');
    resultadoElement.textContent = chamado;
    resultadoElement.style.display = "block";

    navigator.clipboard.writeText(chamado).then(() => {
        alert('Chamado gerado e copiado para a área de transferência!');

        setTimeout(() => {
            document.getElementById('periodo').focus();
        }, 100);
        
    }).catch(() => {
        alert('Falha ao copiar para a área de transferência.');
    });
}

function limparFormulario() {
    document.getElementById('chamadoForm').reset();
    document.getElementById('resultado').textContent = '';
    document.getElementById('resultado').style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const themeLabel = document.getElementById("themeLabel");
    const logo = document.getElementById("logo");

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggle.checked = true;
        themeLabel.textContent = "Light Mode";
        logo.src = "assets/light-logo.png";
    } else {
        logo.src = "assets/dark-logo.png";
    }

    themeToggle.addEventListener("change", function () {
        if (themeToggle.checked) {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
            themeLabel.textContent = "Light Mode";
            logo.src = "assets/light-logo.png";
        } else {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
            themeLabel.textContent = "Dark Mode";
            logo.src = "assets/dark-logo.png";
        }
    });
});
