import { Schema, Context, type } from "@colyseus/schema";
import { Client } from "colyseus";

export class PlayerSchema extends Schema {
    @type("number") score: number;
    @type("boolean") isPlaying: Boolean;
    client: Client;
}
