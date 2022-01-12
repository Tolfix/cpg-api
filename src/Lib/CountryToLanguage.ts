export function ConvertCountryNameToLanguageCode(country: string)
{
    switch(country.toLowerCase())
    {
        case "sweden":
        case "swedish":
            return "sv";
        case "norway":
        case "norwegian":
            return "no";
        case "denmark":
        case "danish":
            return "da";
        case "finland":
        case "finnish":
            return "fi";
        case "switzerland":
        case "swiss":
            return "de";
        case "austria":
        case "austrian":
            return "de";
        case "germany":
        case "german":
            return "de";
        case "netherlands":
            return "nl";
        case "spain":
        case "spanish":
            return "es";
        case "poland":
        case "polish":
            return "pl";
        case "italy":
        case "italian":
            return "it";
        case "france":
        case "french":
            return "fr";
        case "portugal":
        case "portuguese":
            return "pt";
        case "greece":
        case "greek":
            return "el";
        case "lithuania":
        case "lithuanian":
            return "lt";
        case "latvia":
        case "latvian":
            return "lv";
        case "estonia":
        case "estonian":
            return "et";
        case "belgium":
        case "belgian":
            return "fr";
        case "czech":
        case "czech republic":
        case "czechia":
            return "cs";
        case "slovakia":
        case "slovak":
            return "sk";
        case "hungary":
        case "hungarian":
            return "hu";
        case "romania":
        case "romanian":
            return "ro";
        case "bulgaria":
        case "bulgarian":
            return "bg";
        case "croatia":
        case "croatian":
            return "hr";
        case "bosnia":
        case "bosnian":
            return "bs";
        case "slovenia":
        case "slovenian":
            return "sl";
        case "serbia":
        case "serbian":
            return "sr";
        case "macedonia":
        case "macedonian":
            return "mk";
        case "moldova":
        case "moldovan":
            return "mo";
        case "albania":
        case "albanian":
            return "sq";
        case 'america':
            return "en";
        case 'united states':
            return "en";
        case 'united states of america':
            return "en";
        // TODO, add more languages
    }
}