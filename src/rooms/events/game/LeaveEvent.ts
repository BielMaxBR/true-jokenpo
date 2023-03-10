// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { Client } from "colyseus";

import { GameRoom } from "../../GameRoom";

import { PlayerSchema } from "../../schema/PlayerSchema";

export class OnLeaveCommand extends Command<GameRoom> {
    execute(client: Client) {
        const player: PlayerSchema = this.state.players.get(client.sessionId);

        const isPlaying: boolean = player.isPlaying;
        const existsMorePlayers: boolean = this.state.order.length >= 3;

        this.leave(client);

        if (!isPlaying || this.state.order.length == 0) return;

        if (existsMorePlayers) {
            console.log("era pra recomeçar");
            // recomeça a fase
            this.state.restart(this.room);
        } else {
            // volta a esperar
            console.log("era pra terminar");
            this.state.stop();
        }
    }

    leave(client: Client) {
        this.state.players.delete(client.sessionId);
        this.state.order.splice(this.state.order.indexOf(client.sessionId), 1);
        console.log(client.sessionId, "saiu!");
    }
}
