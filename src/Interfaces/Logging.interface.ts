export interface ILoggingTypes
{
    debug: <T extends any[]>(...body: T) => void;
    api: <T extends any[]>(...body: T) => void;
    graphql: <T extends any[]>(...body: T) => void;
    plugin: <T extends any[]>(...body: T) => void;
    cache: <T extends any[]>(...body: T) => void;
    rainbow: <T extends any[]>(...body: T) => void;
    verbose: <T extends any[]>(...body: T) => void;
    error: <T extends any[]>(...body: T) => void;
    warning: <T extends any[]>(...body: T) => void;
    info: <T extends any[]>(...body: T) => void;
    db: <T extends any[]>(...body: T) => void;
}