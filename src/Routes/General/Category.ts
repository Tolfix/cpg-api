import { Application, Router } from "express";
import { CacheCategories } from "../../Cache/CacheCategories";
import { getProductByCategoryUid } from "../../Cache/CacheProduct";
import CategoryModel from "../../Database/Schemas/Category";
import { ICategory } from "../../Interfaces/Categories";
import AW from "../../Lib/AW";
import { idCategory } from "../../Lib/Generator";
import { APIError, APISuccess } from "../../Lib/Response";
import EnsureAdmin from "../../Middlewares/EnsureAdmin";

export default class CategoryRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/categories", this.router);

        /**
         * Gets all categories
         * @route GET /categories
         * @group Category
         * @returns {Array} 200 - An array for categories
         */
        this.router.get("/", (req, res) => {
            APISuccess({
                categories: CacheCategories.array()
            })(res);
        });

        /**
         * Gets specific category
         * @route GET /categories/{uid}
         * @group Category
         * @param {string} uid.path.required - uid for category.
         * @returns {Object} 200 - Gets specific category
         * @returns {Object} 400 - Unable to find category
         */
        this.router.get("/:id", (req, res) => {
            const id = req.params.id as ICategory["uid"];

            const category = CacheCategories.get(id);

            if(!category)
                return APIError({
                    text: `Unable to find category by uid ${id}`
                })(res);

            return APISuccess({
                category: category
            })(res);
        });

        /**
         * Gets products by catgory uid
         * @route GET /categories/{uid}/products
         * @group Category
         * @param {string} uid.path.required - uid for category.
         * @returns {Object} 200 - Gets specific products by category uid
         * @returns {Object} default - Unable to find category
         */
        this.router.get("/:uid/products", (req, res) => {
            const id = req.params.uid as ICategory["uid"];

            const category = CacheCategories.get(id);

            if(!category)
                return APIError({
                    text: `Unable to find category by uid ${id}`
                })(res);

            return APISuccess({
                category_uid: id,
                products: getProductByCategoryUid(id)
            })(res);
        });

        /**
         * Creates a category
         * @route POST /categories/create
         * @group Category
         * @param {string} name.query.required - Name for category.
         * @param {string} description.query.required - description for category.
         * @param {boolean} Private.query.required - Private for category.
         * @returns {Object} 200 - Created a new category.
         * @returns {Object} default - Missing something
         * @security JWT
         * @security Basic
         */
        this.router.post("/create", EnsureAdmin, (req, res) => {
            let { name, description, Private } = req.query as any;

            if(!name)
                return APIError({
                    text: "Missing 'name' in query"
                })(res);

            if(!description)
                return APIError({
                    text: "Missing 'description' in query"
                })(res);

            if(!Private)
                Private = false;

            let info = {
                name,
                description,
                private: Private,
                uid: idCategory(),
            };

            new CategoryModel(info).save();
            CacheCategories.set(info.uid, info);

            APISuccess({
                text: "Succesfully created category.",
                uid: info.uid,
            })(res);
        });

        /**
         * Updates a category
         * @route PATCH /categories/{uid}
         * @group Category
         * @param {string} uid.path.required - uid for category.
         * @param {string} name.query - Name for category.
         * @param {string} description.query - description for category.
         * @param {boolean} Private.query - Private for category.
         * @returns {object} 200 - Updated category
         * @returns {Error} default - Unable to find category or failed
         * @security JWT
         * @security Basic
         */
        this.router.patch("/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid as ICategory["uid"];
            const category = CacheCategories.get(uid);
            if(!category)
                return APIError({
                    text: `Unable to find category by uid ${uid}`,
                })(res);

            let { name, description, Private } = req.query as any;
            
            let info: ICategory = {
                uid: category.uid,
                name: category.name,
                description: category.description,
                private: category.private,
            }

            if(name && name !== info.name)
                info.name = name;

            if(description && description !== info.description)
                info.description = description;

            if(Private && Private !== info.private)
                info.description = Private;
            
            const [Success, Fail] = await AW(CategoryModel.updateOne({ uid: category.uid}, info));

            if(Fail)
                return APIError({
                    text: `Something went wrong, try again later.`,
                })(res);

            CacheCategories.set(category.uid, info);

            return APISuccess({
                text: `Succesfully updated category`,
                uid: category.uid,
                category: info,
            })(res);
        });

        /**
         * Deletes a category
         * @route DELETE /categories/{uid}
         * @group Category
         * @param {string} uid.path.required - uid for category.
         * @returns {object} 200 - Updated category
         * @returns {Error} default - Unable to find category or failed
         * @security JWT
         * @security Basic
         */
        this.router.delete("/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid as ICategory["uid"];

            if(!CacheCategories.get(uid))
                return APIError({
                    text: "Ensure uid is correct",
                })(res);

            // TODO Check if we have products..

            const [Success, Fail] = await AW(CategoryModel.deleteOne({ uid: uid }));
                
            if(Fail)
                return APIError({
                    text: "Something went wrong, try again later.",
                })(res);

            CacheCategories.delete(uid);
            APISuccess({
                text: "Succesfully deleted category",
                uid
            })(res);
        });
    }
}