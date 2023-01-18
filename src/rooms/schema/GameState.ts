import { Schema, ArraySchema, type, MapSchema } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema";
import { ChoiceSchema } from "./ChoiceSchema";
import { Constants } from "../../util/Constants";

export class GameState extends Schema {
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    @type(["string"]) order = new Array<string>();
    @type({ array: ChoiceSchema }) choices = new ArraySchema<ChoiceSchema>();
    @type("boolean") inGame: boolean = false;

    start() {
        for (let i = 0; i < 2; i++) {
            const player = this.players.get(this.order[i]);
            console.log("quem jogará é: " + this.order[i]);

            player.isPlaying = true;

            player.client.send("comecar");
        }
        this.inGame = true;
    }

    restart() {
        this.choices = new ArraySchema<ChoiceSchema>();
        this.start();
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
