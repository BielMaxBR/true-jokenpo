// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { Client } from "colyseus";

import { GameRoom } from "../../GameRoom";

import { PlayerSchema } from "../../schema/PlayerSchema";

export class OnJoinCommand extends Command<
    GameRoom,
    {
        sessionId: string;
    }
> {
    execute(client: Client) {
        console.log(`jogador ${client.sessionId} entrou`);
        const player = new PlayerSchema();

        player.client = client;
        this.state.players.set(client.sessionId, player);
        this.state.order.push(client.sessionId);

        if (this.state.order.length == 2) {
            // começa a fase
            console.log("era pra começar");
            this.state.start();
        }
    }
}
