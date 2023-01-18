// OnJoinCommand.ts
import { Command } from "@colyseus/command";
import { Client } from "colyseus";

import { GameRoom } from "../../GameRoom";

import { GameState } from "../../schema/GameState";
import { escolha } from "./messages/escolha";

export class OnCreateCommand extends Command<GameRoom> {
    execute() {
        this.room.setState(new GameState());

        this.room.onMessage("escolha", (client: Client, message: string) => {
            escolha(client, message, this.room);
        });
    }
}
