import { IAllLanguages } from "../Interfaces/Lang/AllLang";
import { IGetText } from "../Interfaces/Lang/GetText";

export default (lang: keyof IAllLanguages = "en"): IGetText =>
{
    // Make a translation, depending on the lang later
    // for now lets set it as default = en

    const texts = require(`./${lang}/Lang_${lang}.js`).default;
    return texts as IGetText;
};