"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const bot_1 = __importDefault(require("../Structures/bot"));
const handler_1 = __importDefault(require("../Structures/handler"));
const handler = new handler_1.default();
module.exports = {
    block: false,
    run: () => __awaiter(void 0, void 0, void 0, function* () {
        yield handler.loadSlashCommands(bot_1.default.user.id, bot_1.default.guilds.cache);
        bot_1.default.user.setActivity(`Looking at ${bot_1.default.guilds.cache.size} servers`, { type: 'STREAMING', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A' });
        setInterval(() => {
            bot_1.default.user.setActivity(`Looking at ${bot_1.default.guilds.cache.size} servers`, { type: 'STREAMING', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A' });
        }, 15 * 1000);
    }),
};
