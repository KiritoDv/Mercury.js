import { MercuryHandler, Command, Inject, ArgumentType } from '@app/types/router';
import { Client, CommandInteraction } from 'discord.js';

// You can use the @MercuryHandler decorator to register a class as a handler.
// Mercury.js will automatically scan the class for @Command decorators.
@MercuryHandler
class DemoHandler {

    @Inject("client")
    bot: Client | undefined;

    @Command("ping", "Pong!")
    async ping (interaction: CommandInteraction) {
        await interaction.reply("Pong!");
    }

    @Command("echo", "Message", [{ name: "msg", description: "Send message", type: ArgumentType.STRING, required: true }])
    async echo (interaction: CommandInteraction) {
        let msg = interaction.options.getString("msg");
        await interaction.reply(msg ?? "No message provided");
    }
}

export default new DemoHandler();