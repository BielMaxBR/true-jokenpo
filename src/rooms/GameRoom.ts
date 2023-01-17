import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";

import { GameState } from "./schema/GameState";

import { OnJoinCommand } from "./events/game/JoinEvent";
import { OnLeaveCommand } from "./events/game/LeaveEvent";
import { OnCreateCommand } from "./events/game/CreateEvent";

export class GameRoom extends Room<GameState> {
    dispatcher = new Dispatcher(this);

    onCreate(options: any) {
        this.dispatcher.dispatch(new OnCreateCommand());
    }

    onJoin(client: Client) {
        this.dispatcher.dispatch(new OnJoinCommand(), client);
    }

    onDispose() {
        this.dispatcher.stop();
        console.log("room", this.roomId, "disposing...");
    }

    onLeave(client: Client, _consented: boolean) {
        this.dispatcher.dispatch(new OnLeaveCommand(), client);
    }

    broadcastExcept(type: string, data: any, except?: Array<Client>) {
        this.clients.forEach((client) => {
            if (except.includes(client)) return;

            client.send(type, data);
        });
    }
}
