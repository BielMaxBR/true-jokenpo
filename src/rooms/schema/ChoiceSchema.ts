import { Schema, type } from "@colyseus/schema";

export class ChoiceSchema extends Schema {
    @type("string") sessionId: string;
    @type("string") choice: string;

    @type({ array: "string" }) static DEFAULT_CHOICES: ReadonlyArray<string> = [
        "pedra",
        "papel",
        "tesoura",
    ];

    add(newChoice: string, sessionId: string) {
        if (ChoiceSchema.DEFAULT_CHOICES.indexOf(newChoice) == -1) return false;

        this.choice = newChoice;
        this.sessionId = sessionId;
        return true;
    }
}
