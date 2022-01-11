import { IAllLanguages } from "../Interfaces/Lang/AllLang.interface";
import { IGetText } from "../Interfaces/Lang/GetText.interface";

export default (lang: keyof IAllLanguages = "en"): IGetText =>
{
    // Make a translation, depending on the lang later
    // for now lets set it as default = en

    const texts = require(`./${lang}/Lang_${lang}.js`);
    return texts as IGetText;
};