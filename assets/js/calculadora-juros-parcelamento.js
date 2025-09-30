document.addEventListener('DOMContentLoaded', () => {
  const btnCalcular = document.getElementById('btnCalcular');
  const resultado = document.getElementById('resultado');

  function calcularValorTotal(valorAvista, parcelas, valorParcela) {
    const valorTotal = valorParcela * parcelas;
    const diferencaJuros = valorTotal - valorAvista;
    const porcentagemJuros = (diferencaJuros / valorAvista) * 100;
    
    return { valorTotal, diferencaJuros, porcentagemJuros };
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function gerarResultadoHTML(resultado) {
    let html = `<p><span style="color: #00f5ff;">Valor Total:</span> ${formatarMoeda(resultado.valorTotal)}</p>`;
    
    if (resultado.diferencaJuros > 0) {
      html += `<p><span style="color: #00f5ff;">Há juros no parcelamento.</span></p>`;
      html += `<p><span style="color: #00f5ff;">Valor dos Juros:</span> ${formatarMoeda(resultado.diferencaJuros)}</p>`;
      html += `<p><span style="color: #00f5ff;">Porcentagem de Juros:</span> ${resultado.porcentagemJuros.toFixed(2)}%</p>`;
    } else if (resultado.diferencaJuros < 0) {
      html += `<p><span style="color: #00f5ff;">O valor parcelado é menor que o valor à vista.</span></p>`;
      html += `<p><span style="color: #00f5ff;">Diferença:</span> ${formatarMoeda(-resultado.diferencaJuros)}</p>`;
    } else {
      html += `<p><span style="color: #00f5ff;">Não há juros no parcelamento.</span></p>`;
    }

    html += `<button id="btnCopiar" class="project-link" type="button" style="margin-top:1rem;"><i class="fas fa-copy"></i> Copiar Relatório</button>`;

    return html;
  }

  function exibirResultado(resultadoHTML) {
    resultado.innerHTML = resultadoHTML;
    
    // Adicionar evento ao botão de cópia
    const btnCopiar = document.getElementById('btnCopiar');
    if (btnCopiar) {
      btnCopiar.addEventListener('click', copiarRelatorio);
    }
  }

  function calcularEExibirResultado() {
    const valorAvista = parseFloat(document.getElementById('valorAvista').value);
    const parcelas = parseInt(document.getElementById('parcelas').value);
    const valorParcela = parseFloat(document.getElementById('valorParcela').value);
    
    if (!valorAvista || !parcelas || !valorParcela) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (valorAvista <= 0 || parcelas <= 0 || valorParcela <= 0) {
      alert('Os valores devem ser positivos!');
      return;
    }
    
    const resultadoCalculo = calcularValorTotal(valorAvista, parcelas, valorParcela);
    const resultadoHTML = gerarResultadoHTML(resultadoCalculo);
    exibirResultado(resultadoHTML);
  }

  function copiarRelatorio() {
    const resultadoElement = document.getElementById('resultado');
    const resultadoTexto = resultadoElement.innerText.replace('Copiar Relatório', '').trim();
    
    navigator.clipboard.writeText(resultadoTexto).then(() => {
      alert('Relatório copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
      alert('Não foi possível copiar o relatório. Por favor, tente novamente.');
    });
  }

  btnCalcular.addEventListener('click', calcularEExibirResultado);
});