import { Schema, Context, type, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";
import { PlayerSchema } from "./PlayerSchema";

export class GameState extends Schema {
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    @type({ array: "string" }) order = new Array<string>();
    @type({ array: "string" }) choices = new Array<string>();
    start() {
        for (let i = 0; i < 2; i++) {
            const player = this.players.get(this.order[i]);
            console.log("quem jogará é: " + this.order[i]);

            player.isPlaying = true;

            player.client.send("comecar");
        }
        
    }
}
