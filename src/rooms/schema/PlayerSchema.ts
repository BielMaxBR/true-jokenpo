import { Schema, Context, type } from "@colyseus/schema";
// import { Client } from "colyseus";

export class PlayerSchema extends Schema {
    // @type("number") players: Array<Client>;
    @type("boolean") isPlayer: Boolean;
}
