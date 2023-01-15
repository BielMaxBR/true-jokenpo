import { Schema, Context, type, MapSchema } from "@colyseus/schema";
import { Client } from "colyseus";
import { PlayerSchema } from "./PlayerSchema";

export class GameState extends Schema {
    @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
    score: Number[] = [0, 0];
}
