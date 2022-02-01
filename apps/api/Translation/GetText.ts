import { IAllLanguages, IGetText } from "@ts/interfaces";
import { Default_Language } from "../Config";

export default (lang: keyof IAllLanguages = Default_Language): IGetText =>
{
    // Make a translation, depending on the lang later
    // for now lets set it as default = en

    /** @type {import('@ts/interfaces').IGetText} */
    const texts = require(`./${lang}/Lang_${lang}.js`);
    return texts as IGetText;
};