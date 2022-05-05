import { Application, Router } from "express";
import Logger from "../../../../Lib/Logger";
import { APIError, APISuccess } from "../../../../Lib/Response";
import EnsureAdmin from "../../../../Middlewares/EnsureAdmin";
import { CacheImages } from "../../../../Cache/Image.cache";
import { IImage } from "@interface/Images.interface";
import { UploadedFile } from "express-fileupload";
import { idImages } from "../../../../Lib/Generator";
import ImageModel from "../../../../Database/Models/Images.model";
import { setTypeValueOfObj } from "../../../../Lib/Sanitize";
import AW from "../../../../Lib/AW";
export = ImagesRouter; 
class ImagesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application, version: string)
    {
        this.server = server;
        this.server.use(`/${version}/images`, this.router);

        /**
         * Gets all images except buffer.
         * @route GET /images
         * @group Images
         * @returns {Images} 200 - Images data
         * @security JWT
         */
        this.router.get("/", (req, res) =>
        {
            return APISuccess(CacheImages.array().map(e =>
            {
                return {
                    uid: e.uid,
                    name: e.name,
                    type: e.type,
                    size: e.size
                }
            }))(res);
        });
        /**
         * Gets image with buffer
         * @route GET /images/{uid}
         * @group Images
         * @param {string} uid.path.required - uid for image
         * @returns {Images} 200 - Image data in base64
         * @returns {APIError} 404 - Failed to find
         * @security Basic
         */
        this.router.get("/:id", (req, res) =>
        {
            const id = req.params.id as IImage["id"];

            const data = CacheImages.get(parseInt(id));
            
            if (!data)
                return APIError(`Unable to find image by id ${id}`)(res);

            const binaryString = Array.prototype.map.call(data.data, function (ch)
            {
                return String.fromCharCode(ch);
            }).join('');

            //const d = btoa(binaryString);
            const d = Buffer.from(binaryString, "binary").toString("base64");


            return APISuccess({
                data: d,
                type: data.type,
                name: data.name,
                size: data.size
            })(res);
        });

        this.router.get("/json", (req, res) =>
        {
            const obj = Object.assign({}, ImageModel.schema.obj);
            setTypeValueOfObj(obj);
            return APISuccess(obj)(res);
        });

        /**
         * Gets image with buffer
         * @route POST /images
         * @group Images
         * @param {file} image.formData.required Image data as formdata
         * @security Basic
         */
        this.router.post("/", EnsureAdmin(), async (req, res) =>
        {
            if (req.files)
            {
                // @ts-ignore
                const image = (req.files.image as UploadedFile);

                Logger.debug(`Uploading image ${image.name}`);

                const dataImage = {
                    uid: idImages(),
                    data: image.data,
                    type: image.mimetype,
                    size: image.size,
                    name: image.name
                };

                const db_Image = await new ImageModel(dataImage).save();
                
                // @ts-ignore
                CacheImages.set(db_Image.id, db_Image);

                return APISuccess(db_Image.id)(res);
            }
            return APIError({
                text: `Failed to create image`,
            })(res);
        });

        /**
         * Deletes image
         * @route DELETE /images/{uid}
         * @group Images
         * @param {string} uid.path.required - uid for image
         * @security Basic
         */
         this.router.delete("/:id", EnsureAdmin(), async (req, res) =>
         {
            const id = req.params.id as IImage["id"];
            const data = CacheImages.get(id);
            if (!data)
                return APIError(`Unable to find image by id ${id}`)(res);
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [S, F] = await AW(ImageModel.deleteOne({ id: id }));
            
            if (F)
                return APIError(`Something went wrong.. try again later`)(res);
            
            CacheImages.delete(id);
            
            APISuccess(`Successfully deleted image`)(res);
        });
    }
} 