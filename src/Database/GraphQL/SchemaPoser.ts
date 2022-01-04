import { SchemaComposer } from 'graphql-compose';
import fs from "fs";
import { HomeDir } from '../../Config';
import Logger from '../../Lib/Logger';
import { graphql } from 'graphql';
import { IntrospectionQuery, printSchema } from 'graphql/utilities';
const schemaComposer = new SchemaComposer();

const graphQLDataFolder = `${HomeDir}/build/Database/GraphQL/Data`;
// Check if the folder exists
if (!fs.existsSync(graphQLDataFolder)) {
    Logger.error(`The folder ${graphQLDataFolder} does not exist.`);
    // Create the folder
    fs.mkdirSync(graphQLDataFolder);
};

// Go through each in ./Schemas/*.js files and add them to schemaComposer
Logger.info("Loading GraphQL schemas...");
let schemaDir = HomeDir+"/build/Database/GraphQL/Schemas";
const files = fs.readdirSync(`${schemaDir}`).filter((f) => f.endsWith('.js'));
for(let f of files)
{

    // Now we require the file.
    const schema = require(`${schemaDir}/${f}`);
    // Get the schema.startsWith
    const name = schema.startsWith;
    if(!name)
        continue;

    // Now get schame[`${name}Query`] and schema[`${name}Mutation`]
    const query = schema[`${name}Query`];
    const mutation = schema[`${name}Mutation`];

    // Add the query and mutation to the schemaComposer
    if(query)
        schemaComposer.Query.addFields(query);
    if(mutation)
        schemaComposer.Mutation.addFields(mutation);

    continue;
}

// Lets create the schema
export default schemaComposer.buildSchema();