import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema";
import { ChoiceSchema } from "./ChoiceSchema";
import { Constants } from "../../util/Constants";
import { GameRoom } from "../GameRoom";
import { Client } from "colyseus";

export class GameState extends Schema {
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    @type(["string"]) order = new Array<string>();
    @type({ array: ChoiceSchema }) choices = new ArraySchema<ChoiceSchema>();
    @type("boolean") inGame: boolean = false;

    start(room: GameRoom, isEmpate?: boolean) {
        const roundList: Array<Client> = [];
        for (let i = 0; i < 2; i++) {
            const player = this.players.get(this.order[i]);
            console.log("quem jogará é: " + this.order[i]);

            player.isPlaying = true;
            roundList.push(player.client);
        }
        this.inGame = true;

        room.broadcast(
            "comecando",
            roundList.map((client) => client.sessionId)
        );

        room.clock.setTimeout(
            () => {
                roundList.forEach((client) => client.send("comecar"));

                room.broadcastExcept(
                    "ja comecou",
                    roundList.map((client) => client.sessionId),
                    roundList
                );
            },
            isEmpate ? 0 : 3000
        );
    }

    reset(
        room: GameRoom,
        { looserId, isEmpate }: { looserId?: string; isEmpate?: boolean }
    ) {
        room.clock.setTimeout(() => {
            this.restart(room, isEmpate);
        }, 3000);

        if (!looserId || this.order.length <= 2) return;

        const looserIndex: number = this.order.indexOf(looserId);

        this.order.splice(looserIndex, 1);
        this.order.push(looserId);
    }

    restart(room: GameRoom, isEmpate?: boolean) {
        this.choices = new ArraySchema<ChoiceSchema>();
        this.start(room, isEmpate);
    }

    stop() {
        this.inGame = false;
        const lastPlayerStand = this.players.get(this.order[0]);
        if (lastPlayerStand) {
            lastPlayerStand.isPlaying = false;
            lastPlayerStand.client.send("esperando");
        }
        this.choices = new ArraySchema<ChoiceSchema>();
    }

    calc() {
        console.log("foi calcular");

        const choiceObj1 = this.choices[0];
        const choiceObj2 = this.choices[1];

        const choice1 = ChoiceSchema.DEFAULT_CHOICES.indexOf(choiceObj1.choice);
        const choice2 = ChoiceSchema.DEFAULT_CHOICES.indexOf(choiceObj2.choice);

        if (choice1 == choice2) return { type: Constants.EMPATE };

        if (
            mod(choice1 - choice2, ChoiceSchema.DEFAULT_CHOICES.length) <
            ChoiceSchema.DEFAULT_CHOICES.length / 2
        ) {
            return { type: Constants.VITORIA, winnerIndex: 0, looserIndex: 1 };
        } else {
            return { type: Constants.VITORIA, winnerIndex: 1, looserIndex: 0 };
        }

        function mod(a: number, b: number) {
            const c = a % b;
            return c < 0 ? c + b : c;
        }
    }
}
