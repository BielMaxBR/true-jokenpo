import assert from "assert";
import { ColyseusTestServer, boot } from "@colyseus/testing";

// import your "arena.config.ts" file here.
import appConfig from "../src/arena.config";
import { GameState } from "../src/rooms/schema/GameState";
import { GameRoom } from "../src/rooms/GameRoom";
import { Dispatcher } from "@colyseus/command";
import { OnJoinCommand } from "../src/rooms/events/game/JoinEvent";
import { Client } from "colyseus";

describe("testing your Colyseus app", () => {
    let colyseus: ColyseusTestServer;

    before(async () => (colyseus = await boot(appConfig)));
    after(async () => colyseus.shutdown());

    beforeEach(async () => {
        await colyseus.cleanup();
    });

    it("connecting into a room", async () => {
        // `room` is the server-side Room instance reference.
        const room = await colyseus.createRoom<GameState>("game", {});

        // `client1` is the client-side `Room` instance reference (same as JavaScript SDK)
        const client1 = await colyseus.connectTo(room);

        // make your assertions
        assert.strictEqual(client1.sessionId, room.clients[0].sessionId);

        // wait for state sync
        await room.waitForNextPatch();

        assert.deepStrictEqual(client1.sessionId, room.state.order[0]);
    });
});
/*
describe("should return victory to first player", () => {
    let room: GameRoom;
    let client: Client;
    beforeEach(() => {
        room = new GameRoom();
        room.setState(new GameState());
    });

    it("should validate if command can be executed", () => {
        const dispatcher = new Dispatcher(room);
        dispatcher.dispatch(new OnJoinCommand(), client);
    });
});
*/