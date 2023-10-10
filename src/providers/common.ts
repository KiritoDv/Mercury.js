import 'module-alias/register';
import { CommandEntry, Injectable } from '@app/types/router';

class BotCommon {

    static cmds: Map<string, CommandEntry> = new Map<string, CommandEntry>();

    // @Injectable("example")
    // fs: Fs;

    constructor() {
        // this.fs = ...
    }
}

export default BotCommon;