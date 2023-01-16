// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { Client } from "colyseus";

import { GameRoom } from "../../GameRoom";

import { ChoiceSchema } from "../../schema/ChoiceSchema";
import { GameState } from "../../schema/GameState";

export class OnCreateCommand extends Command<GameRoom> {
    execute() {
        this.room.setState(new GameState());

        this.room.onMessage("escolha", (client: Client, message: string) => {
            const player = this.room.state.players.get(client.sessionId)
            if (!player.isPlaying) return

            const newChoice: ChoiceSchema = new ChoiceSchema();
            newChoice.sessionId = client.sessionId;
            if (newChoice.DEFAULT_CHOICES.indexOf(message) == -1) return
            newChoice.choice = message;
            console.log(newChoice.choice)
        });
    }
}
