document.addEventListener('DOMContentLoaded', () => {
  const inputArquivo = document.getElementById('arquivoOfx');
  const btnProcessar = document.getElementById('btnProcessar');
  const btnBaixarCsv = document.getElementById('btnBaixarCsv');
  const tabelaBody = document.querySelector('#tabelaTransacoes tbody');
  const resumo = document.getElementById('resumo');

  let transacoes = [];

  function parseOfx(texto) {
    const limpar = texto.replace(/\r/g, '');

    const extrairTag = (tag) => {
      const regex = new RegExp(`<${tag}>([^<\n\r]*)`, 'i');
      const m = limpar.match(regex);
      return m ? m[1].trim() : '';
    };

    const matches = limpar.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) || [];
    const lista = matches.map((block) => {
      const get = (t) => {
        const regex = new RegExp(`<${t}>([^<\n\r]*)`, 'i');
        const m = block.match(regex);
        return m ? m[1].trim() : '';
      };

      const dt = get('DTPOSTED');
      const valor = parseFloat(get('TRNAMT')) || 0;
      const nome = get('NAME');
      const memo = get('MEMO');

      return {
        data: formatarDataOfx(dt),
        valor,
        nome,
        memo,
      };
    });

    let totalCreditos = 0;
    let totalDebitos = 0;
    lista.forEach((t) => {
      if (t.valor >= 0) totalCreditos += t.valor; else totalDebitos += t.valor;
    });

    return {
      banco: extrairTag('BANKID'),
      conta: extrairTag('ACCTID'),
      transacoes: lista,
      totalCreditos,
      totalDebitos,
    };
  }

  function formatarDataOfx(dt) {
    if (!dt) return '';
    const y = dt.slice(0, 4);
    const m = dt.slice(4, 6);
    const d = dt.slice(6, 8);
    return `${d}/${m}/${y}`;
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function renderizarTabela(lista) {
    tabelaBody.innerHTML = '';
    for (const t of lista) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.data || ''}</td>
        <td>${formatarMoeda(t.valor)}</td>
        <td>${t.nome || ''}</td>
        <td>${t.memo || ''}</td>
      `;
      tabelaBody.appendChild(tr);
    }
  }

  function renderizarResumo(info) {
    const saldo = info.totalCreditos + info.totalDebitos; // débitos são negativos
    resumo.innerHTML = `
      <p><strong>Banco:</strong> ${info.banco || '—'} | <strong>Conta:</strong> ${info.conta || '—'}</p>
      <p><strong>Transações:</strong> ${info.transacoes.length}</p>
      <p><strong>Créditos:</strong> ${formatarMoeda(info.totalCreditos)} | <strong>Débitos:</strong> ${formatarMoeda(info.totalDebitos)}</p>
      <p><strong>Saldo (Créditos + Débitos):</strong> ${formatarMoeda(saldo)}</p>
      <button id="btnCopiarResumo" class="project-link" type="button" style="margin-top:8px"><i class="fas fa-copy"></i> Copiar resumo</button>
    `;

    const btnCopiarResumo = document.getElementById('btnCopiarResumo');
    btnCopiarResumo?.addEventListener('click', () => {
      const texto = resumo.innerText.replace('Copiar resumo', '').trim();
      navigator.clipboard.writeText(texto).then(() => alert('Resumo copiado!'));
    });
  }

  function baixarCsv(lista) {
    const linhas = ['Data,Valor,Descricao,Detalhes'];
    for (const t of lista) {
      const linha = [t.data, t.valor, escapeCsv(t.nome || ''), escapeCsv(t.memo || '')].join(',');
      linhas.push(linha);
    }
    const blob = new Blob([linhas.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transacoes_ofx.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function escapeCsv(s) {
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  btnProcessar.addEventListener('click', () => {
    const arquivo = inputArquivo.files?.[0];
    if (!arquivo) {
      alert('Selecione um arquivo OFX.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const texto = reader.result.toString();
      const info = parseOfx(texto);
      transacoes = info.transacoes;
      renderizarResumo(info);
      renderizarTabela(transacoes);
    };
    reader.readAsText(arquivo);
  });

  btnBaixarCsv.addEventListener('click', () => {
    if (!transacoes.length) {
      alert('Nenhuma transação para exportar.');
      return;
    }
    baixarCsv(transacoes);
  });
});