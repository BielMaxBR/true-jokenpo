import { Schema, type } from "@colyseus/schema";

export class ChoiceSchema extends Schema {
    @type("string") sessionId: string;
    @type("string") choice: string;

    @type({array:"string"}) DEFAULT_CHOICES: ReadonlyArray<string> = ["pedra","papel","tesoura"];
}