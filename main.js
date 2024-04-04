"use strict";
let contadorCampos = 0;
function adicionarCampo(dadosCarregados = null) {
    contadorCampos++;
    const divCampo = document.createElement('div');
    divCampo.classList.add('campos');
    divCampo.id = `campo-${contadorCampos}`;
    const idCampo = `hora-${contadorCampos}`;
    const pLand = document.createElement('p');
    const spanLand = document.createElement('span');
    spanLand.textContent = 'Land Number:';
    const inputLand = document.createElement('input');
    inputLand.setAttribute('type', 'text');
    inputLand.setAttribute('placeholder', 'land...');
    inputLand.setAttribute('id', `land-${contadorCampos}`);
    pLand.appendChild(spanLand);
    pLand.appendChild(inputLand);
    const pResource = document.createElement('p');
    const spanResource = document.createElement('span');
    spanResource.textContent = 'Resource:';
    const inputResource = document.createElement('input');
    inputResource.setAttribute('type', 'text');
    inputResource.setAttribute('placeholder', 'resource...');
    inputResource.setAttribute('id', `resource-${contadorCampos}`);
    pResource.appendChild(spanResource);
    pResource.appendChild(inputResource);
    const pTime = document.createElement('p');
    const spanTime = document.createElement('span');
    spanTime.textContent = 'Time:';
    const inputTime = document.createElement('input');
    inputTime.setAttribute('type', 'time');
    inputTime.setAttribute('value', '00:00:00');
    inputTime.setAttribute('step', '1');
    inputTime.setAttribute('name', `hora-${contadorCampos}`);
    inputTime.setAttribute('id', `hora-${contadorCampos}`);
    pTime.appendChild(spanTime);
    pTime.appendChild(inputTime);
    const buttonIniciar = document.createElement('button');
    buttonIniciar.setAttribute('type', 'button');
    buttonIniciar.textContent = 'Iniciar';
    buttonIniciar.addEventListener('click', () => iniciarContagemRegressiva(idCampo));
    const buttonRemover = document.createElement('button');
    buttonRemover.setAttribute('type', 'button');
    buttonRemover.textContent = 'Remover Campo';
    buttonRemover.addEventListener('click', () => removerCampo(divCampo.id));
    if (dadosCarregados) {
        inputLand.value = dadosCarregados.land;
        inputResource.value = dadosCarregados.resource;
        inputTime.value = dadosCarregados.hora;
    }
    // Adicionar os elementos ao container
    const container = document.getElementById('container');
    divCampo.appendChild(pLand);
    divCampo.appendChild(pResource);
    divCampo.appendChild(pTime);
    divCampo.appendChild(buttonIniciar);
    divCampo.appendChild(buttonRemover);
    container.appendChild(divCampo);
}
function removerCampo(id) {
    const container = document.getElementById('container');
    const campoRemover = document.getElementById(id);
    if (campoRemover) {
        container.removeChild(campoRemover);
        const index = parseInt(id.split('-')[1]);
        contadorCampos--;
        for (let i = index + 1; i <= contadorCampos + 1; i++) {
            const campo = document.getElementById(`campo-${i}`);
            if (campo)
                campo.id = `campo-${i - 1}`;
            const hora = document.getElementById(`hora-${i}`);
            if (hora)
                hora.id = `hora-${i - 1}`;
            const land = document.getElementById(`land-${i}`);
            if (land)
                land.id = `land-${i - 1}`;
            const resource = document.getElementById(`resource-${i}`);
            if (resource)
                resource.id = `resource-${i - 1}`;
        }
    }
}
function iniciarContagemRegressiva(id) {
    const horaInput = document.getElementById(`${id}`);
    const alertaAudio = document.getElementById('alertaAudio');
    const campo = document.getElementById(`campo-${id.split('-')[1]}`);
    campo?.classList.add('start');
    // Extrair horas, minutos e segundos dos campos de entrada
    const horaArray = horaInput.value.split(':').map(Number);
    let horas = horaArray[0];
    let minutos = horaArray[1];
    let segundos = horaArray[2];
    // Verifica se os valores inseridos são válidos
    if (isNaN(horas) ||
        isNaN(minutos) ||
        isNaN(segundos) ||
        minutos > 59 ||
        segundos > 59 ||
        horas < 0 ||
        minutos < 0 ||
        segundos < 0 ||
        horas > 23) {
        alert('Por favor, insira uma hora válida no formato hh:mm:ss.');
        return;
    }
    // Calcula o tempo total em segundos
    let tempoTotal = horas * 3600 + minutos * 60 + segundos;
    // Configura o volume do áudio
    alertaAudio.volume = 1;
    // Adiciona um evento para pausar o áudio quando terminar de tocar
    alertaAudio.addEventListener('ended', () => {
        alertaAudio.pause();
    });
    // Começa a contagem regressiva a cada segundo
    const intervalo = setInterval(() => {
        if (tempoTotal > 0) {
            tempoTotal--;
            campo?.classList.remove('ended');
            campo?.classList.add('start');
            // Converte o tempo total de volta para horas, minutos e segundos
            horas = Math.floor(tempoTotal / 3600);
            minutos = Math.floor((tempoTotal % 3600) / 60);
            segundos = tempoTotal % 60;
            // Atualiza o valor exibido
            horaInput.value = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            // Se o tempo total chegar a zero, para a contagem regressiva e toca o alerta
            if (tempoTotal === 0) {
                clearInterval(intervalo);
                alertaAudio.play();
                campo?.classList.remove('start');
                campo?.classList.add('ended');
            }
        }
    }, 860); // 990 antes
}
// Função para salvar os campos em JSON
function salvarCampos() {
    const campos = [];
    for (let i = 1; i <= contadorCampos; i++) {
        const idCampo = `campo-${i}`;
        const idHora = `hora-${i}`;
        const landCampo = `land-${i}`;
        const reCampo = `resource-${i}`;
        const horaInput = document.getElementById(idHora);
        const landInput = document.getElementById(landCampo);
        const resourceInput = document.getElementById(reCampo);
        campos.push({
            id: idCampo,
            idHora: idHora,
            hora: horaInput.value,
            land: landInput.value,
            resource: resourceInput.value,
        });
    }
    const camposJSON = JSON.stringify(campos);
    localStorage.setItem('campos', camposJSON);
}
// Função para carregar os campos a partir do JSON
function carregarCamposSalvos() {
    const camposJSON = localStorage.getItem('campos');
    if (camposJSON) {
        const campos = JSON.parse(camposJSON);
        campos.forEach((campo) => {
            adicionarCampo(campo);
        });
    }
    else {
        adicionarCampo();
    }
}
// Chamada para carregar os campos salvos quando a página é carregada
window.addEventListener('load', carregarCamposSalvos);
