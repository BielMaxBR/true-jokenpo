async function init() {
    var client = new Colyseus.Client("wss://" + window.location.host);

    try {
        const room = await client.joinOrCreate("game");
        console.log(room.sessionId, "joined", room.name);
        changeLog("conectado a sala")
    } catch (err) {
        console.error(err);
        changeLog("erro ao conectar com a sala", "red")
    }
}

init();

function changeLog(text = "", color = 0x000000) {
    const log = document.getElementById("log")
    log.innerText = text
    log.style.color = color
}