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
        ]}).then((result: any) => {
            if(!result)
                return;

            let r = result.toJSON();
            //@ts-ignore
            delete r._id;
            delete r.__v;
            return r;
        });
    }

    public findAll(limit: number, page: number): Promise<Array<IModel>>
    {
        return new Promise((resolve, reject) => {
            this.iModel.find()
                .select("-_id -__v")
                .limit(limit)
                .skip(limit * page)
                .exec(function (err: any, users: any) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(users);
                    }
                })
        });
    }

    public findAndPatch(
        uid: IModel["uid"],
        data: IModel
    ): Promise<IModel | []>
    {
        if(!uid || uid === "undefined")
            return Promise.resolve([]);
        return this.iModel.findOneAndUpdate({ $or: [
            { id: uid },
            { uid: uid }
        ]}, data);
    };

    public removeByUid(uid: IModel["uid"])
    {
        if(!uid || uid === "undefined")
            return Promise.resolve([]);
        return new Promise((resolve, reject) => {
            this.iModel.deleteMany({ $or: [
                { id: uid },
                { uid: uid }
            ]}, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(err);
                }
            });
        });
    };
}