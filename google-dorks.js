document.addEventListener('DOMContentLoaded', () => {
  const btnBuscar = document.getElementById('btnBuscar');
  const resultados = document.getElementById('resultados');

  function copiarConsulta(consulta) {
    navigator.clipboard.writeText(consulta).then(() => {
      alert('Consulta copiada para a área de transferência!');
    }).catch((err) => {
      console.error('Erro ao copiar: ', err);
    });
  }

  function realizarBusca() {
    const buscaNormal = document.getElementById('buscaNormal').value.trim();
    const buscaExata1 = document.getElementById('buscaExata1').value.trim();
    const buscaExata2 = document.getElementById('buscaExata2').value.trim();
    const campoDork = document.getElementById('campoDork').value.trim();
    const tipoDork = document.getElementById('tipoDork').value;

    if (!buscaNormal && !buscaExata1 && !buscaExata2 && !campoDork) {
      alert('Por favor, digite pelo menos um termo de busca');
      return;
    }

    let consultaBusca = buscaNormal;

    if (buscaExata1) {
      consultaBusca += ` "${buscaExata1}"`;
    }

    if (buscaExata2) {
      consultaBusca += ` "${buscaExata2}"`;
    }

    if (tipoDork === 'whatsapp') {
      consultaBusca += ` inurl:"chat.whatsapp.com" "${campoDork || 'grupo'}"`;
    } else if (tipoDork === 'telegram') {
      consultaBusca += ` inurl:"t.me" "${campoDork || 'grupo'}"`;
    } else if (campoDork) {
      consultaBusca += ` ${tipoDork}${campoDork}`;
    }

    const urlBusca = `https://www.google.com/search?q=${encodeURIComponent(consultaBusca)}`;

    resultados.innerHTML = `
      <p>Realizando busca para: ${consultaBusca}</p>
      <p>
        Clique aqui para ver os resultados:
        <a href="${urlBusca}" target="_blank" rel="noopener noreferrer">Resultados da Busca Google</a>
      </p>
      <button id="btnCopiar" class="project-link" type="button"><i class="fas fa-copy"></i> Copiar Consulta</button>
    `;

    const btnCopiar = document.getElementById('btnCopiar');
    btnCopiar.addEventListener('click', () => copiarConsulta(consultaBusca));
  }

  btnBuscar.addEventListener('click', realizarBusca);
});