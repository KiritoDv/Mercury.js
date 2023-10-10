import 'module-alias/register';
import { CommandEntry, Injectable } from '@app/types/router';

class BotCommon {

    static cmds: Map<string, CommandEntry> = new Map<string, CommandEntry>();

    /**
        Mercury.js has a built-in dependency injection system.
        You can inject anything you want, but you need to register it first.
        You can register it by using the @Injectable decorator.

        @Injectable("example")
        fs: Fs;

        Mercury.js will automatically inject the registered instance into the class.
        @Inject("example")
        fs: Fs;
    */

    constructor() {
        // this.fs = ...
    }
}

export default BotCommon;