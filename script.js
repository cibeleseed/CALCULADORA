
// ========================================
// CALCULADORA DE NOTAS - ENSINO FUNDAMENTAL
// ========================================

// LISTA DE DISCIPLINAS
const disciplinas = [
    "Língua Portuguesa",
    "Matemática",
    "Ciências",
    "História",
    "Geografia",
    "Arte",
    "Educação Física",
    "Língua Inglesa",
    "Ensino Religioso"
];

// MÉDIA MÍNIMA PARA APROVAÇÃO
const MEDIA_MINIMA = 60;

// ELEMENTO DA TABELA
const tbody = document.querySelector("#gradesTable tbody");


// ========================================
// CRIAÇÃO AUTOMÁTICA DAS DISCIPLINAS
// ========================================

disciplinas.forEach((disciplina, idx) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td class="discipline-name">${disciplina}</td>

        <td>
            <input type="number" class="input-nota"
            id="t1_${idx}" min="0" max="100"
            step="0.1" placeholder="-">
        </td>

        <td>
            <input type="number" class="input-nota"
            id="t2_${idx}" min="0" max="100"
            step="0.1" placeholder="-">
        </td>

        <td>
            <input type="number" class="input-nota"
            id="t3_${idx}" min="0" max="100"
            step="0.1" placeholder="-">
        </td>

        <td>
            <strong id="media_${idx}">-</strong>
        </td>

        <td>
            <span id="status_${idx}">-</span>
        </td>

        <td>
            <div id="seliga_${idx}">-</div>
        </td>
    `;

    tbody.appendChild(tr);
});


// ========================================
// FUNÇÃO PARA CALCULAR O BOLETIM
// ========================================

function calcularNotas() {

    const alertDiv = document.getElementById("validationAlert");

    alertDiv.style.display = "none";

    const nome = document.getElementById("studentName").value.trim();

    const turma = document.getElementById("studentClass").value.trim();

    const ano = document.getElementById("schoolYear").value;

    // VERIFICA IDENTIFICAÇÃO

    if (nome === "") {

        mostrarAlerta("Digite o nome do estudante.");

        document.getElementById("studentName").focus();

        return false;
    }

    if (turma === "") {

        mostrarAlerta("Informe a turma do estudante.");

        document.getElementById("studentClass").focus();

        return false;
    }

    if (ano === "" || Number(ano) < 2020 || Number(ano) > 2100) {

        mostrarAlerta("Informe um ano letivo válido.");

        return false;
    }

    // CONTADORES

    let aprovadas = 0;
    let reprovadas = 0;
    let totalSeLiga = 0;

    let resultados = [];
    let recuperacoes = [];

    // PERCORRE TODAS AS DISCIPLINAS

    for (let idx = 0; idx < disciplinas.length; idx++) {

        const t1 = document.getElementById(`t1_${idx}`).value;
        const t2 = document.getElementById(`t2_${idx}`).value;
        const t3 = document.getElementById(`t3_${idx}`).value;

        // VERIFICA PREENCHIMENTO

        if (t1 === "" || t2 === "" || t3 === "") {

            mostrarAlerta(
                `Preencha as três notas de ${disciplinas[idx]}.`
            );

            return false;
        }

        const n1 = Number(t1);
        const n2 = Number(t2);
        const n3 = Number(t3);

        // VERIFICA LIMITES DAS NOTAS

        if (
            !Number.isFinite(n1) ||
            !Number.isFinite(n2) ||
            !Number.isFinite(n3) ||
            n1 < 0 || n1 > 100 ||
            n2 < 0 || n2 > 100 ||
            n3 < 0 || n3 > 100
        ) {

            mostrarAlerta(
                `As notas de ${disciplinas[idx]} devem estar entre 0 e 100.`
            );

            return false;
        }

        // CALCULA A MÉDIA

        const media = (n1 + n2 + n3) / 3;

        const mediaFinal = Number(media.toFixed(2));

        // VERIFICA APROVAÇÃO

        const aprovado = media >= MEDIA_MINIMA;

        if (aprovado) {

            aprovadas++;

        } else {

            reprovadas++;
        }

        // VERIFICA NOTAS PARA O SE LIGA

        let notasBaixas = [];

        if (n1 < MEDIA_MINIMA) {
            notasBaixas.push("1º Trimestre");
        }

        if (n2 < MEDIA_MINIMA) {
            notasBaixas.push("2º Trimestre");
        }

        if (n3 < MEDIA_MINIMA) {
            notasBaixas.push("3º Trimestre");
        }

        if (notasBaixas.length > 0) {

            totalSeLiga++;

            recuperacoes.push({
                disciplina: disciplinas[idx],
                detalhes: notasBaixas
            });
        }

        // GUARDA RESULTADOS

        resultados.push({

            disciplina: disciplinas[idx],

            media: mediaFinal,

            aprovado: aprovado,

            notasBaixas: notasBaixas
        });
    }

    // ENVIA RESULTADOS PARA EXIBIÇÃO

    exibirResultados({
        nome: nome,
        turma: turma,
        ano: ano,

        aprovadas: aprovadas,
        reprovadas: reprovadas,
        totalSeLiga: totalSeLiga,

        resultados: resultados,
        recuperacoes: recuperacoes
    });

    return true;
}


// ========================================
// FUNÇÃO PARA MOSTRAR ALERTAS
// ========================================

function mostrarAlerta(mensagem) {

    const alertDiv = document.getElementById("validationAlert");

    alertDiv.textContent = mensagem;

    alertDiv.style.display = "block";

    alertDiv.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ========================================
// EXIBIÇÃO DOS RESULTADOS
// ========================================

function exibirResultados(data) {

    // IDENTIFICAÇÃO DO ESTUDANTE

    document.getElementById("studentResultName").textContent =
        `${data.nome} | Turma: ${data.turma} | Ano letivo: ${data.ano}`;

    // RESUMO

    document.getElementById("sumAprovadas").textContent =
        data.aprovadas;

    document.getElementById("sumReprovadas").textContent =
        data.reprovadas;

    document.getElementById("sumSeLiga").textContent =
        data.totalSeLiga;

    // RESULTADOS DE CADA DISCIPLINA

    data.resultados.forEach((res, idx) => {

        const media = document.getElementById(`media_${idx}`);

        const status = document.getElementById(`status_${idx}`);

        const seliga = document.getElementById(`seliga_${idx}`);

        media.textContent =
            res.media.toFixed(1).replace(".", ",");

        // SITUAÇÃO

        if (res.aprovado) {

            status.innerHTML =
                '<span class="status-badge badge-aprovado">APROVADO</span>';

        } else {

            status.innerHTML =
                '<span class="status-badge badge-reprovado">NÃO APROVADO</span>';
        }

        // INDICAÇÃO SE LIGA

        seliga.innerHTML = "";

        if (res.notasBaixas.length > 0) {

            res.notasBaixas.forEach(trimestre => {

                const tag = document.createElement("span");

                tag.className = "seliga-tag";

                tag.textContent = trimestre;

                seliga.appendChild(tag);
            });

        } else {

            seliga.textContent = "—";
        }

    });

    // LISTA DE RECUPERAÇÕES

    const recDetails = document.getElementById("recDetails");

    const recList = document.getElementById("recList");

    recList.innerHTML = "";

    if (data.recuperacoes.length > 0) {

        data.recuperacoes.forEach(item => {

            const li = document.createElement("li");

            const strong = document.createElement("strong");

            strong.textContent = item.disciplina;

            li.appendChild(strong);

            li.appendChild(
                document.createTextNode(
                    ": " + item.detalhes.join(", ")
                )
            );

            recList.appendChild(li);
        });

        recDetails.style.display = "block";

    } else {

        recDetails.style.display = "none";
    }

    // MENSAGEM FINAL

    const mensagem = document.getElementById("finalMessage");

    if (data.reprovadas === 0) {

        mensagem.textContent =
            "Parabéns! Todas as disciplinas atingiram a média mínima.";

    } else {

        mensagem.textContent =
            `Atenção! ${data.reprovadas} disciplina(s) não atingiram a média mínima de 60 pontos.`;
    }

    // MOSTRA RESULTADOS

    document.getElementById("resultsSection").style.display = "block";

    document.getElementById("resultsSection").scrollIntoView({
        behavior: "smooth"
    });
}


// ========================================
// FUNÇÃO PARA LIMPAR A CALCULADORA
// ========================================

function limparNotas() {

    document.getElementById("studentName").value = "";

    document.getElementById("studentClass").value = "";

    document.getElementById("schoolYear").value = "2026";

    document.getElementById("validationAlert").style.display = "none";

    document.getElementById("resultsSection").style.display = "none";

    // LIMPA NOTAS E RESULTADOS

    for (let idx = 0; idx < disciplinas.length; idx++) {

        document.getElementById(`t1_${idx}`).value = "";

        document.getElementById(`t2_${idx}`).value = "";

        document.getElementById(`t3_${idx}`).value = "";

        document.getElementById(`media_${idx}`).textContent = "-";

        document.getElementById(`status_${idx}`).textContent = "-";

        document.getElementById(`seliga_${idx}`).textContent = "-";
    }

    document.getElementById("recList").innerHTML = "";

}


// ========================================
// FUNÇÃO PARA IMPRIMIR O BOLETIM
// ========================================

function imprimirBoletim() {

    const resultadosVisiveis =
        document.getElementById("resultsSection").style.display === "block";

    if (!resultadosVisiveis) {

        const calculado = calcularNotas();

        if (!calculado) {
            return;
        }
    }

    window.print();
}
