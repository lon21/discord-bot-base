> [!IMPORTANT]
> Active development – early access. Expect breaking changes.

# Discord Bot Template

A TypeScript-based Discord bot template using discord.js with a decorator-based architecture for commands and events.

[![wakatime](https://wakatime.com/badge/github/lon21/discord-bot-base.svg)](https://wakatime.com/badge/github/lon21/discord-bot-base)

## Features

- TypeScript with ESNext target (runs natively on Bun — no build step)
- Decorator-based command and event registration
- Support for slash commands with options and subcommands
- Docker support for deployment
- Hot reload during development with `bun --watch`

## Requirements

- [Bun](https://bun.sh/) >= 1.0

## Installation

```sh
git clone https://github.com/lon21/discord-bot-base.git
cd discord-bot-base
bun install
```

## Configuration

Copy the example environment file and fill in your values:

```sh
cp env.example .env
```

> **Note:** Bun automatically loads `.env` files — no extra configuration needed.

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
bun dev
```

This starts the bot with `--watch` mode — it will automatically restart on file changes.

### Production

```sh
bun start
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

## Creating Buttons

Create a new file in `src/buttons/` with the `.button.ts` suffix.

```typescript
// filepath: src/buttons/confirm.button.ts
import { ButtonInteraction, ButtonStyle } from 'discord.js';
import { BaseButton } from '../interfaces';
import { RegisterButton } from '../decorators';

@RegisterButton({
    id: 'confirm',
    label: 'Confirm',
    style: ButtonStyle.Primary,
    emoji: '✅',              // Optional: button emoji
    disabled: false,          // Optional: disable the button
})
export class ConfirmButton extends BaseButton {
    async run(interaction: ButtonInteraction) {
        await interaction.reply('Action confirmed!');
    }
}
```

### Button Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the button (used as customId) |
| `label` | string | Yes | Text displayed on the button |
| `style` | ButtonStyle | Yes | Button style (Primary, Secondary, Success, Danger) |
| `emoji` | string \| APIMessageComponentEmoji | No | Emoji to display on the button |
| `disabled` | boolean | No | Whether the button is disabled |

> **Note:** Link buttons (buttons with URLs) are not supported through this registration system. Discord handles link buttons separately, they don't trigger interactions and therefore don't need a handler. If you need a link button, create it manually using `ButtonBuilder` with `ButtonStyle.Link` and `.setURL()`.

### Using Buttons in Commands

```typescript
import { ActionRowBuilder, ButtonBuilder, CommandInteraction } from 'discord.js';
import { RegisterCommand } from '../decorators';
import { BaseSlashCommand } from '../interfaces';
import bot from '../bot';

@RegisterCommand({
    name: 'example',
    description: 'A command with a button',
})
export class ExampleCommand extends BaseSlashCommand {
    async run(interaction: CommandInteraction) {
        const button = bot.buttons.get('confirm');
        if (!button) {
            await interaction.reply({ content: 'Button not found!', ephemeral: true });
            return;
        }

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button.discordData);
        await interaction.reply({ content: 'Click the button:', components: [row] });
    }
}
```

## Creating Modals

Create a new file in `src/modals/` with the `.modal.ts` suffix.

```typescript
// filepath: src/modals/feedback.modal.ts
import { ModalSubmitInteraction, MessageFlags } from 'discord.js';
import { BaseModal } from '../interfaces';
import { RegisterModal } from '../decorators';

@RegisterModal({
    id: 'feedback',  // Must match the customId used when showing the modal
})
export class FeedbackModal extends BaseModal {
    async run(interaction: ModalSubmitInteraction) {
        const name = interaction.fields.getTextInputValue('nameInput');
        const feedback = interaction.fields.getTextInputValue('feedbackInput');

        await interaction.reply({
            content: `Thanks ${name}! Your feedback: ${feedback}`,
            flags: MessageFlags.Ephemeral,
        });
    }
}
```

### Modal Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the modal (must match the `customId` set on `ModalBuilder`) |

### Showing Modals from Commands

```typescript
import { ActionRowBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { RegisterCommand } from '../decorators';
import { BaseSlashCommand } from '../interfaces';

@RegisterCommand({
    name: 'feedback',
    description: 'Open a feedback form',
})
export class FeedbackCommand extends BaseSlashCommand {
    async run(interaction: ChatInputCommandInteraction) {
        const modal = new ModalBuilder()
            .setCustomId('feedback')
            .setTitle('Feedback Form');

        const nameInput = new TextInputBuilder()
            .setCustomId('nameInput')
            .setLabel('Your name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const feedbackInput = new TextInputBuilder()
            .setCustomId('feedbackInput')
            .setLabel('Your feedback')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(feedbackInput),
        );

        await interaction.showModal(modal);
    }
}
```

## Project Structure

```
src/
├── bot.ts              # Bot client initialization
├── index.ts            # Entry point
├── buttons/            # Button handlers
├── commands/           # Slash commands
├── events/             # Event handlers
├── modals/             # Modal submission handlers
├── decorators/         # Command, event, button, and modal decorators
├── handlers/           # Loaders for commands, events, buttons, and modals
├── interfaces/         # TypeScript interfaces and base classes
└── utils/              # Utility functions
```

## License

MIT License. See `LICENSE` file for details.
