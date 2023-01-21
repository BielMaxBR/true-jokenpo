import { Client } from "colyseus";
import { Constants } from "../../../../util/Constants";
import { GameRoom } from "../../../GameRoom";
import { ChoiceSchema } from "../../../schema/ChoiceSchema";
import { PlayerSchema } from "../../../schema/PlayerSchema";

export function escolha(client: Client, message: string, room: GameRoom) {
    const player = room.state.players.get(client.sessionId);
    if (!player.isPlaying || !room.state.inGame || room.state.choices.find(choice => choice.sessionId == client.sessionId)) return;

    const newChoice: ChoiceSchema = new ChoiceSchema();
    const isValid = newChoice.add(message, client.sessionId);
    if (!isValid) return;

    const choicesList = room.state.choices;
    choicesList.push(newChoice);

    if (choicesList.length != 2) {
        client.send("espere");
        return;
    }

    //calcular pontos
    const result = room.state.calc();
    switch (result.type) {
        case Constants.EMPATE:
            room.broadcast("empate", choicesList);
            room.state.reset(room, { isEmpate: true });
            break;

        case Constants.VITORIA:
            const winner: PlayerSchema = room.state.players.get(
                choicesList[result.winnerIndex].sessionId
            );

            const looser: PlayerSchema = room.state.players.get(
                choicesList[result.looserIndex].sessionId
            );

            winner.client.send("ganhou", choicesList);
            looser.client.send("perdeu", choicesList);

            winner.isPlaying = false;
            looser.isPlaying = false;
            room.state.inGame = false;

            room.broadcastExcept(
                "resultado",
                { winnerIndex: result.winnerIndex, choicesList },
                [winner.client, looser.client]
            );
            room.state.reset(room, { looserId: looser.client.sessionId });
            break;
    }
}
