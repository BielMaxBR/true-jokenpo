// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { Client } from "colyseus";
import { Constants } from "../../../util/Constants";

import { GameRoom } from "../../GameRoom";

import { ChoiceSchema } from "../../schema/ChoiceSchema";
import { GameState } from "../../schema/GameState";
import { PlayerSchema } from "../../schema/PlayerSchema";

export class OnCreateCommand extends Command<GameRoom> {
    execute() {
        this.room.setState(new GameState());

        this.room.onMessage("escolha", (client: Client, message: string) => {
            const player = this.room.state.players.get(client.sessionId);
            if (!player.isPlaying) return;

            const newChoice: ChoiceSchema = new ChoiceSchema();
            const isValid = newChoice.add(message, client.sessionId);
            if (!isValid) return;

            player.isPlaying = false;

            const choicesList = this.room.state.choices;
            choicesList.push(newChoice);

            if (choicesList.length != 2) {
                client.send("espere");
                return;
            }

            //calcular pontos
            const result = this.room.state.calc();
            switch (result.type) {
                case Constants.EMPATE:
                    this.room.broadcast("empate", choicesList);
                    break;

                case Constants.VITORIA:
                    const winner: PlayerSchema = this.room.state.players.get(
                        choicesList[result.winnerIndex].sessionId
                    );

                    const looser: PlayerSchema = this.room.state.players.get(
                        choicesList[result.looserIndex].sessionId
                    );

                    winner.client.send("ganhou", choicesList);
                    looser.client.send("perdeu", choicesList);

                    winner.isPlaying = false;
                    looser.isPlaying = false;

                    this.room.broadcastExcept(
                        "resultado",
                        { winnerIndex: result.winnerIndex, choicesList },
                        [winner.client, looser.client]
                    );
                    break;
            }
        });
    }
}
