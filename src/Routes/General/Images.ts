import { Application, Router } from "express";
import Logger from "../../Lib/Logger";
import { APIError, APISuccess } from "../../Lib/Response";
import EnsureAdmin from "../../Middlewares/EnsureAdmin";
import { CacheImages } from "../../Cache/CacheImage";
import { IImage } from "../../Interfaces/Images";
import { UploadedFile } from "express-fileupload";
import { idImages } from "../../Lib/Generator";
import ImageModel from "../../Database/Schemas/Images";
import AW from "../../Lib/AW";

export default class ImagesRouter
{
    private server: Application;
    private router = Router();

    constructor(server: Application)
    {
        this.server = server;
        this.server.use("/images", this.router);
        /**
         * Gets all images except buffer.
         * @route GET /images
         * @group Images
         * @returns {Images} 200 - Images data
         * @security JWT
         */
        this.router.get("/", EnsureAdmin, (req, res) => {
            return APISuccess(CacheImages.array().map(e => {
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
        this.router.get("/:uid", EnsureAdmin, (req, res) => {
            const uid = req.params.uid as IImage["uid"];
            const data = CacheImages.get(uid);
            if(!data)
                return APIError({
                    text: `Unable to find image by uid ${uid}`
                })(res);
            var binstr = Array.prototype.map.call(data.data, function (ch) {
                return String.fromCharCode(ch);
            }).join('');
            let d = btoa(binstr);
            return APISuccess({
                text: `Succesfully got image`,
                image: d,
            })(res);
        });

        /**
         * Gets image with buffer
         * @route POST /images/create
         * @group Images
         * @param {file} image.formData.required Image data as formdata
         * @security Basic
         */
        this.router.post("/create", EnsureAdmin, (req, res) => {
            if(req.files)
            {
                const image = (req.files.image as UploadedFile);
                Logger.debug(`Uploading image ${image.name}`);
                let dataImage = {
                    uid: idImages(),
                    data: image.data,
                    type: image.mimetype,
                    size: image.size,
                    name: image.name
                };

                new ImageModel(dataImage).save();
                CacheImages.set(dataImage.uid, dataImage);

                return APISuccess({
                    text: `Succesfully created image`,
                    uid: dataImage.uid,
                })(res);
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
         this.router.delete("/:uid", EnsureAdmin, async (req, res) => {
            const uid = req.params.uid as IImage["uid"];
            const data = CacheImages.get(uid);
            if(!data)
                return APIError({
                    text: `Unable to find image by uid ${uid}`
                })(res);

            const [S, F] = await AW(ImageModel.deleteOne({ uid: uid }));
            
            if(F)
                return APIError({
                    text: `Something went wrong.. try again later`,
                })(res);

            CacheImages.delete(uid);

            APISuccess({
                text: `Succesfully delete image`,
                uid: uid,
            })(res);
        });

    }
}