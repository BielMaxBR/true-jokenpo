async function init() {
    var client = new Colyseus.Client("wss://" + window.location.host);

    try {
        const room = await client.joinOrCreate("my_room");
        console.log(room.sessionId, "joined", room.name);
    } catch (err) {
        console.error(err);
    }
}

init();
