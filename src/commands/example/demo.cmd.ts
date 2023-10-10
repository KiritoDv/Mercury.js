import { MercuryHandler, Command, Inject, ArgumentType } from '@app/types/router';
import { Client, CommandInteraction, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js';

@MercuryHandler
class DemoCommands {

    @Inject("client")
    bot: Client | undefined;

    @Command("no-args", "Demo command with no arguments")
    async no_args (interaction: CommandInteraction) {
        await interaction.reply("Hi, I'm a demo command with no arguments!");
    }

    @Command("test-args", "Demo arg", [{ name: "arg", description: "Reads an arg", type: ArgumentType.STRING, required: true }])
    async test (interaction: CommandInteraction) {
        let arg = interaction.options.getString("arg");
        await interaction.reply(arg);
    }
}

export default new DemoCommands();