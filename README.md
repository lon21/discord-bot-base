# Discord Bot Template

A TypeScript-based Discord bot template using discord.js with a decorator-based architecture for commands and events.

[![wakatime](https://wakatime.com/badge/github/lon21/discord-bot-base.svg)](https://wakatime.com/badge/github/lon21/discord-bot-base)

## Features

- TypeScript with ESNext target
- Decorator-based command and event registration
- Support for slash commands with options and subcommands
- Docker support for deployment
- Hot reload during development with nodemon

## Requirements

- Node.js >= 24.11.0
- pnpm >= 10.28.2

## Installation

```sh
git clone https://github.com/lon21/discord-bot-base.git
cd discord-bot-base
pnpm install
```

## Configuration

Copy the example environment file and fill in your values:

```sh
cp env.example .env
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `BOT_TOKEN` | Your Discord bot token. Obtain from [Discord Developer Portal](https://discord.com/developers/applications) > Your Application > Bot > Token |
| `BOT_APP_ID` | Your Discord application ID. Found at [Discord Developer Portal](https://discord.com/developers/applications) > Your Application > General Information > Application ID |
| `GLOBAL_COMMANDS` | Set to `TRUE` for global command registration (takes up to 1 hour to propagate) or `FALSE` for guild-specific commands (instant) |
| `COMMAND_GUILD_ID` | Required when `GLOBAL_COMMANDS=FALSE`. The Discord server ID where commands will be registered |
| `NODE_ENV` | Set to `development` for debug logging |
| `OWNERS` | JSON array of Discord user IDs who can use owner-only commands. Example: `'["123456789012345678"]'` |

## Usage

### Development

```sh
pnpm dev
```

### Production

```sh
pnpm build
pnpm start
```

### Docker Deployment

Before deploying, edit `docker-compose.yml` and change the `container_name` to your preferred name:

```yaml
services:
  app:
    container_name: your-bot-name  # Change this
```

Then run:

```sh
docker-compose up -d --build
```

## Creating Commands

Create a new file in `src/commands/` with the `.command.ts` suffix.

```typescript
// filepath: src/commands/example.command.ts
import { ChatInputCommandInteraction } from 'discord.js';
import { BaseSlashCommand } from '../interfaces';
import { RegisterCommand } from '../decorators';

@RegisterCommand({
    name: 'example',
    description: 'An example command',
    permissions: 'SendMessages',  // Optional: required permission
    ownerOnly: false,             // Optional: restrict to bot owner
    options: [                    // Optional: command options
        {
            type: 'STRING',
            name: 'input',
            description: 'Some input text',
            required: true,
        }
    ],
})
export class ExampleCommand extends BaseSlashCommand {
    async run(interaction: ChatInputCommandInteraction) {
        const input = interaction.options.getString('input');
        await interaction.reply(`You said: ${input}`);
    }
}
```

### Command Options

Available option types: `STRING`, `INTEGER`, `NUMBER`, `BOOLEAN`, `USER`, `CHANNEL`, `ROLE`, `ATTACHMENT`, `MENTIONABLE`

### Subcommands

```typescript
@RegisterCommand({
    name: 'config',
    description: 'Configuration commands',
    subCommands: [
        {
            name: 'get',
            description: 'Get a config value',
            options: [
                { type: 'STRING', name: 'key', description: 'Config key', required: true }
            ]
        },
        {
            name: 'set',
            description: 'Set a config value',
            options: [
                { type: 'STRING', name: 'key', description: 'Config key', required: true },
                { type: 'STRING', name: 'value', description: 'Config value', required: true }
            ]
        }
    ]
})
```

## Creating Events

Create a new file in `src/events/` with the `.event.ts` suffix.

```typescript
// filepath: src/events/guildMemberAdd.event.ts
import { GuildMember } from 'discord.js';
import { BaseEvent } from '../interfaces';
import { RegisterEvent } from '../decorators';

@RegisterEvent({
    name: 'guildMemberAdd',
    once: false,  // Set to true if the event should only fire once
})
export class GuildMemberAddEvent extends BaseEvent {
    async run(member: GuildMember) {
        console.log(`${member.user.tag} joined ${member.guild.name}`);
    }
}
```

### Available Events

All events from discord.js `ClientEvents` are supported. Common examples:
- `ready` / `clientReady`
- `messageCreate`
- `interactionCreate`
- `guildMemberAdd`
- `guildMemberRemove`

## Project Structure

```
src/
├── bot.ts              # Bot client initialization
├── index.ts            # Entry point
├── commands/           # Slash commands
├── events/             # Event handlers
├── decorators/         # Command and event decorators
├── handlers/           # Loaders for commands and events
├── interfaces/         # TypeScript interfaces and base classes
└── utils/              # Utility functions
```

## License

MIT License. See `LICENSE` file for details.
