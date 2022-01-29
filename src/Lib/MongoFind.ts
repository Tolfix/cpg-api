import { Model } from "mongoose";
import { Request } from "express"
import { MongooseQueryParser } from "mongoose-query-parser";
const p = new MongooseQueryParser();

export default function MongoFind<T>(model: Model<T>, query: Request["query"], eQuery?: any)
{
    const data = p.parse(query);
    
    const b = model.find({
        ...data.filter,
        ...eQuery ?? {}
    }).sort(data.sort ?? "1").skip(data.skip ?? 0).limit(data.limit ?? 10);
    if(data.select)
        b.select(data.select);

    if(data.populate)
        b.populate(data.populate);

    return b.exec();
}