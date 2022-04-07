// Find all commands in HomeDir/Admin/Commands
export const cacheCommands = new Map();

export default () =>
{
    const commands = [];
    for (const [key, value] of cacheCommands)
    {
        commands.push({
            name: `${key} - ${value.description}`,
            value: key,
        });
    }
                    
    return {
        name: 'prompt',
        description: 'Show all commands',
        args: [
            {
                name: 'commands',
                type: "list",
                message: "Select the commands you want to run",
                choices: commands,
            }
        ]
    }
}