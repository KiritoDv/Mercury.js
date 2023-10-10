import BotCommon from "@app/providers/common";
import { Interaction } from "discord.js";

type CMDFunc = (interaction: Interaction) => void;

enum RequestType {
    COMMAND
}

enum ArgumentType {
    STRING, INTEGER, DOUBLE, BOOLEAN
};

type ArgumentChoice = {
    name: string,
    value: any
};

type CommandArgument = {
    name: string;
    description?: string;
    options?: ArgumentChoice[];
    type: ArgumentType;
    required?: boolean;
};

type CommandEntry = {
    type: RequestType;
    cmd: string;
    description: string;
    handler: CMDFunc;
    args?: CommandArgument[];
}

const _DBInstances = new Map<string, any>();
const SubMethods = Symbol('SubMethods');

function _MethodImplementation(entry: CommandEntry) {
    console.log(`[Mercury.js] Registering ${RequestType[entry.type]}: ` + entry.cmd);
    switch(entry.type){
        case RequestType.COMMAND:
            BotCommon.cmds.set(entry.cmd, entry);
            break;
    }
};


function _BindRequest( type: RequestType, cmd: string, args: CommandArgument[], description: string, target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    target[SubMethods] = target[SubMethods] || new Map<string, CommandEntry>();
    target[SubMethods].set(propertyKey, { type: type, cmd: cmd, args: args, description: description, handler: descriptor.value });
}

function MercuryHandler<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
            const subMethods = Base.prototype[SubMethods];
            if (subMethods) {
                subMethods.forEach( (method: CommandEntry, key: any) => {
                    method.handler = method.handler.bind(this);
                    _MethodImplementation(method);
                });
            }
        }
    };
}

function Command(cmd: string, desc: string, args: CommandArgument[] = []) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) =>
        _BindRequest(RequestType.COMMAND, cmd, args, desc, target, propertyKey, descriptor);
}

function Injectable(name: string) {
    return function(target: Object, propertyKey: string) {
        let value : any;
        const getter = () => value;
        const setter = (newVal: any) => {
            _DBInstances.set(name, newVal);
            value = newVal;
        };
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}

function Inject(name: string) {
    return function(target: Object, propertyKey: string) {
        let value : any;
        const getter = function() {
            if(!value) value = _DBInstances.get(name);
            return value;
        };
        const setter = function(newVal: any) {
            value = newVal;
        };
        Object.defineProperty(target, propertyKey, {
          get: getter,
          set: setter
        });
    }
}

export { MercuryHandler, Command, Injectable, Inject, CommandEntry, ArgumentType, ArgumentChoice };