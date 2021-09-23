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
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const fs_1 = require("fs");
const bot_1 = __importDefault(require("./bot"));
const rest = new rest_1.REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
class Handler {
    constructor(handlerOptions) {
        this.loadEvents = () => {
            fs_1.readdirSync(`${__dirname}/../events`).forEach((fileName) => {
                if (fileName.startsWith('--') || !fileName.includes('event'))
                    return;
                const event = require(`../events/${fileName}`);
                const eventName = fileName.split('.')[0];
                bot_1.default.events.set(eventName, event);
                if (event.block)
                    return;
                bot_1.default.on(eventName, (args) => event.run(args));
            });
        };
        this.loadCommands = () => __awaiter(this, void 0, void 0, function* () {
            yield fs_1.readdirSync(`${__dirname}/../commands`).forEach((fileName) => {
                if (fileName.startsWith('--') || !fileName.includes('command'))
                    return;
                const command = require(`../commands/${fileName}`);
                if (!command.name || !command.description || !command.run) {
                    if (process.env.NODE_ENV === 'development')
                        return console.error(`File: ${fileName} doesn't have a name or description or run option!`);
                    else
                        return;
                }
                bot_1.default.commands.set(command.name, command);
            });
        });
        this.loadSlashCommands = (id, guilds) => __awaiter(this, void 0, void 0, function* () {
            let commands = [];
            yield bot_1.default.commands.forEach((command) => {
                const toAdd = {
                    name: command.name,
                    description: command.description,
                };
                commands.push(toAdd);
            });
            yield (() => __awaiter(this, void 0, void 0, function* () {
                console.log('Started loading (/) commands');
                let gLength = 0;
                yield guilds.forEach((g) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield rest.put(v9_1.Routes.applicationGuildCommands(id, g.id), { body: commands });
                    }
                    catch (error) {
                        console.error(error);
                    }
                    console.log(`Loaded for ${g.name}`);
                    gLength++;
                    if (gLength === guilds.size) {
                        console.log('Finished loading (/) commands');
                        return bot_1.default.emit('readyToUse');
                    }
                }));
            }))();
        });
    }
}
exports.default = Handler;
