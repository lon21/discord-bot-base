# ```! THIS REPOSITORY WONT BE UPDATED ! ```
# Check [new one](https://github.com/lon21/updated-discord-bot-base)



## Discord Bot Base 

This is a simple bot base with simple options

### How to use:
 - Create `.env` file with value ```BOT_TOKEN=yourbottoken```
 - Type `yarn install` in your console
 - Type `yarn build` in your console
 - To start bot type `yarn start` in your console

### How to add commands:
 - Create file in `src/commands/` directory
 - Name it with template `commandName.command.ts`
 - Use this template to create command
 ```ts
 import { BotCommand } from '../types';
 
 export default <BotCommand> {
        name: 'nameOfYourCommand',
        description: 'Description of your command',
        options: {
          name: 'YourOptionName',
          description: 'Description of your command',
          type: 3, // Annotation 1
        },
        run: async (interaction) => {
                // Command code
        },
 };
 ```
 > Command handler will automatically add your command

### How to add events: 
 - Create file in `src/events/` directory
 - Name it with template `eventName.event.ts`
 - Use this template to create command
 ```ts
import { BotEvent } from '../types';
import bot from '../bot';

export default <BotEvent> {
  block: true, // Annotation 2
	run: async () => {
		// Event code
	}
}
```

### Annotations
 - `1` [Types of options](https://canary.discord.com/developers/docs/interactions/slash-commands#application-command-object-application-command-option-type)
 - `2` After adding it to your code, selected event won't run.
