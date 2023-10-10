import 'module-alias/register';
import path from 'path';
import { Injectable, ArgumentType } from '@app/types/router';
import { SlashCommandBuilder } from '@discordjs/builders'
import { dirscan } from '@app/utils/fs-utils';
import { Client, Intents } from 'discord.js'
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import BotCommon from './common';

class DiscordProvider {

    @Injectable("client")
    bot: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });

    token: string = 'TOKEN';

    commands: any[] = [];
    constructor(){
        this.init();
    }

    async register(){
        const rest = new REST({ version: '9' }).setToken(this.token);
        const commands: any[] = Array.from( BotCommon.cmds.values() ).map((c): any => {
            const cmd = new SlashCommandBuilder();
            cmd.setName(c.cmd);
            cmd.setDescription(c.description);
            if(c.args) c.args.forEach(arg => {
                switch(arg.type){
                    case ArgumentType.STRING:
                        cmd.addStringOption(opt => {
                            opt.setName(arg.name)
                               .setDescription(arg.description ?? "")
                               .setRequired(arg.required ?? false);
                            if(arg.options) arg.options.forEach(o => opt.addChoice(o.name, o.value));
                            return opt;
                        });
                        break;
                    case ArgumentType.DOUBLE:
                        cmd.addNumberOption(opt => {
                            opt.setName(arg.name)
                               .setDescription(arg.description ?? "")
                               .setRequired(arg.required ?? false);
                            if(arg.options) arg.options.forEach(o => opt.addChoice(o.name, o.value));
                            return opt;
                        });
                        break;
                    case ArgumentType.INTEGER:
                        cmd.addIntegerOption(opt => {
                            opt.setName(arg.name)
                               .setDescription(arg.description ?? "")
                               .setRequired(arg.required ?? false);
                            if(arg.options) arg.options.forEach(o => opt.addChoice(o.name, o.value));
                            return opt;
                        });
                        break;
                    case ArgumentType.BOOLEAN:
                        cmd.addBooleanOption(opt => {
                            opt.setName(arg.name)
                               .setDescription(arg.description ?? "")
                               .setRequired(arg.required ?? false);
                            return opt;
                        });
                        break;
                }
            });
            return cmd.toJSON();
        });
        await rest.put(
            Routes.applicationCommands(this.bot.user!.id),
            { body: commands },
        );
    }

    async registerCommands() {
        const cmds = (await dirscan(path.join(process.cwd(), "src/commands"))).filter(f => f.endsWith(".cmd.ts"));
        for(const cmd of cmds) {
            const instance = await import (`@app/commands/${path.relative("src/commands", cmd).replace(/\.[^/.]+$/, "")}`);
            this.commands.push(instance.default);
        }
    }

    async initCommands(){
        for(const cmd of this.commands){
            if(cmd.init) await cmd.init();
        }
    }

    async init(){

        await this.registerCommands();

        this.bot.on('ready', async () => {
            console.log(`[Discord] Logged in as ${this.bot.user!.tag}!`);
            await this.register();
            await this.initCommands();
        });

        this.bot.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            if(BotCommon.cmds.has(interaction.commandName)){
                const cmd = BotCommon.cmds.get(interaction.commandName);
                cmd!.handler(interaction);
            }
        });

        this.bot.login(this.token);
    }
}

export default DiscordProvider;