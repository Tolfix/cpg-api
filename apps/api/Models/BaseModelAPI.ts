import { Request, Response } from "express";
import MongoFind from "../Lib/MongoFind";

export default class BaseModelAPI<IModel extends { uid: string }>
{
    private idFunction;
    private iModel;

    constructor(
        idFunction: () => string,
        iModel: any
    )
    {
        this.idFunction = idFunction;
        this.iModel = iModel;
    }

    public create(data: (IModel)): Promise<IModel>
    {
        data.uid = this.idFunction();
        const a = new this.iModel(data)
        return a.save();
    }

    public findByUid(uid: IModel["uid"]): Promise<IModel | []>
    {
        if(!uid || uid === "undefined")
            return Promise.resolve([]);
        return this.iModel.findOne({ $or: [
            { id: uid },
            { uid: uid }
        ]}).then((result: any) =>
        {
            if(!result)
                return;

            const r = result.toJSON();
            //@ts-ignore
            delete r._id;
            delete r.__v;
            return r;
        });
    }

    public findAll(query: Request["query"], res: Response): Promise<Array<IModel>>
    {
        return new Promise((resolve, reject) =>
        {
            MongoFind(this.iModel, query).then((result) =>
            {
                const r = result.data.map((i: any) =>
                {
                    const r = i.toJSON();
                    //@ts-ignore
                    delete r.__v;
                    return r;
                });

                res.setHeader("X-Total-Pages", result.totalPages);
                res.setHeader("X-Total", result.totalCount);

                resolve(r);
            }).catch(reject);
        });
    }

    public findAndPatch(
        uid: IModel["uid"],
        data: IModel
    ): Promise<IModel>
    {
        if(!uid || uid === "undefined")
            return Promise.reject("No uid provided");
        return this.iModel.findOneAndUpdate({ $or: [
            { id: uid },
            { uid: uid }
        ]}, data);
    }

    public removeByUid(uid: IModel["uid"])
    {
        if(!uid || uid === "undefined")
            return Promise.resolve([]);
        return new Promise((resolve, reject) =>
        {
            this.iModel.deleteMany({ $or: [
                { id: uid },
                { uid: uid }
            ]}, (err: any) =>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(err);
                }
            });
        });
    }
}