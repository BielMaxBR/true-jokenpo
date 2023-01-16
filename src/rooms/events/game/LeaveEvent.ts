// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { Client } from "colyseus";

import { GameRoom } from "../../GameRoom";

import { PlayerSchema } from "../../schema/PlayerSchema";

export class OnLeaveCommand extends Command<GameRoom> {
    execute(client: Client) {
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
        console.log(client.sessionId, "saiu!");
    }
}
