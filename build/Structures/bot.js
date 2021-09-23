"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class client extends discord_js_1.Client {
    constructor(clientOptions) {
        super(clientOptions);
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.login(process.env.BOT_TOKEN);
    }
}
const bot = new client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
exports.default = bot;
