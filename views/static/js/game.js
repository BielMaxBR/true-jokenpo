async function init() {
    var client = new Colyseus.Client("wss://" + window.location.host);

    try {
        const room = await client.joinOrCreate("game");
        console.log(room.sessionId, "joined", room.name);
        changeLog("conectado a sala");

        room.onMessage("comecar", comecar);
        room.onMessage("ganhou", ganhou);
        room.onMessage("perdeu", perdeu);
        room.onMessage("espere", espere);
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

function comecar() {
    changeLog("JOGUE");
}

function ganhou() {
    changeLog("Ganhou!", "green")
}

function perdeu() {
    changeLog("Perdeu ;-;", "blue")
}

function espere() {
    changeLog("espere o adversário jogar")
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
