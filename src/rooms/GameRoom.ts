import { Room, Client } from "colyseus";
import { GameState } from "./schema/GameState";
import { PlayerSchema } from "./schema/PlayerSchema";

export class GameRoom extends Room<GameState> {
    onCreate(options: any) {
        this.setState(new GameState());

        this.onMessage("type", (client, message) => {
            //
            // handle "type" message
            //
        });
    }

    onJoin(client: Client, options: any) {
        const player = new PlayerSchema();
        
        this.state.players.set(client.sessionId, player);
        
        player.isPlayer = this.state.players.size <= 2;
        
        console.log(this.state.players.get(client.sessionId).isPlayer, "entrou");
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }
}
