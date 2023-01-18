import { Room, Client, Clock } from "colyseus";
import { Dispatcher } from "@colyseus/command";

import { GameState } from "./schema/GameState";

import { OnJoinCommand } from "./events/game/JoinEvent";
import { OnLeaveCommand } from "./events/game/LeaveEvent";
import { OnCreateCommand } from "./events/game/CreateEvent";

export class GameRoom extends Room<GameState> {
    dispatcher = new Dispatcher(this);

    onCreate(options: any) {
        this.dispatcher.dispatch(new OnCreateCommand());
    }

    onJoin(client: Client) {
        this.dispatcher.dispatch(new OnJoinCommand(), client);
    }

    onDispose() {
        this.dispatcher.stop();
        console.log("room", this.roomId, "disposing...");
    }

    onLeave(client: Client, _consented: boolean) {
        this.dispatcher.dispatch(new OnLeaveCommand(), client);
    }

    broadcastExcept(type: string, data: any, except?: Array<Client>) {
        this.clients.forEach((client) => {
            if (except.includes(client)) return;

            client.send(type, data);
        });
    }

    reset(looserId?: string) {
        this.clock.setTimeout(() => {
            this.state.restart();
        }, 3000);

        if (!looserId || this.state.order.length <= 2) return;

        const looserIndex: number = this.state.order.indexOf(looserId);
        
        this.state.order.splice(looserIndex, 1);
        this.state.order.push(looserId);
        
    }
}
