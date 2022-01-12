import { Default_Language } from "../Config";
import { IAllLanguages } from "../Interfaces/Lang/AllLang.interface";
import { IGetText } from "../Interfaces/Lang/GetText.interface";

export default (lang: keyof IAllLanguages = Default_Language): IGetText =>
{
    // Make a translation, depending on the lang later
    // for now lets set it as default = en

    /** @type {import('../Interfaces/Lang/GetText.interface').IGetText} */
    const texts = require(`./${lang}/Lang_${lang}.js`);
    return texts as IGetText;
};