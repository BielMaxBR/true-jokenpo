async function init() {
    var client = new Colyseus.Client("wss://" + window.location.host);

    try {
        const room = await client.joinOrCreate("game");
        window.room = room;
        console.log(room.sessionId, "joined", room.name);
        changeLog("conectado a sala");

        room.onMessage("comecar", comecar);
        room.onMessage("esperando", esperando);
        room.onMessage("ja comecou", jaComecou);
        room.onMessage("comecando", comecando);
        room.onMessage("ganhou", ganhou);
        room.onMessage("perdeu", perdeu);
        room.onMessage("empate", empate);
        room.onMessage("espere", espere);
        room.onMessage("resultado", resultado);

        room.onStateChange(stateMudou);
        room.onLeave(leave);

        document.getElementById("botoes").addEventListener("click", (e) => {
            console.log(e.srcElement.id);
            room.send("escolha", e.srcElement.id);
        });
    } catch (err) {
        console.error(err);
        changeLog("erro ao conectar com a sala", "red");
    }
}

function stateMudou(state) {
    console.log("ordem de jogada", state.order.toArray());
}

function comecar() {
    changeLog("JOGUE");
}

function esperando() {
    changeLog("Esperando alguém aparecer pra começar");
}

function comecando(lista) {
    changeLog(`partida de ${lista[0]} contra ${lista[1]}`);
}

function jaComecou(lista) {
    changeLog("uma partida está em andamento");
}

function ganhou() {
    changeLog("Ganhou!", "green");
}

function perdeu() {
    changeLog("Perdeu ;-;", "blue");
}

function empate() {
    changeLog("empate '-'", "grey");
}

function espere() {
    changeLog("espere o adversário jogar");
}

function resultado(data) {
    changeLog("resuldados:");
    console.log(data);
}

function leave(code) {
    changeLog("desconectado da sala, código: " + code, "red");
    console.log("desconectado da sala, código:", code);
}

init();

function changeLog(text = "", color = 0x000000) {
    const log = document.getElementById("log");
    log.innerText = text;
    log.style.color = color;
}
