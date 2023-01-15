import Arena from "@colyseus/arena";
import { monitor } from "@colyseus/monitor";
import express from "express";
/**
 * Import your Room files
 */
import { GameRoom } from "./rooms/GameRoom";

import GameController from "./controllers/GameController";

export default Arena({
    getId: () => "Your Colyseus App",

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define("game", GameRoom);
    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.set("views", "./views");
        app.use(express.static("views/static"));
        app.set("view engine", "pug");
        app.get("/", GameController.index);

        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    },
});
