import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";

import { GameState } from "./schema/GameState";
import { OnJoinCommand } from "./events/game/JoinGame";

export class GameRoom extends Room<GameState> {
    dispatcher = new Dispatcher(this);

    onCreate(options: any) {
        this.setState(new GameState());

        this.onMessage("type", (client, message) => {
            //
            // handle "type" message
            //
        });
    }
    onJoin(client: Client) {
        this.dispatcher.dispatch(new OnJoinCommand(), client);
    }

    onDispose() {
        this.dispatcher.stop();
        console.log("room", this.roomId, "disposing...");
    }

    onLeave(client: Client, consented: boolean) {
        const player = this.state.players.get(client.sessionId);
        if (player.isPlaying) {
            if (this.state.order.length >= 3) {
                console.log("era pra recomeçar");
                // recomeça a fase
            } else {
                // volta a esperar
                console.log("era pra terminar");
            }
        }
        this.state.players.delete(client.sessionId);
        this.state.order.splice(this.state.order.indexOf(client.sessionId), 1);
        console.log(client.sessionId, "left!");
    }
}
