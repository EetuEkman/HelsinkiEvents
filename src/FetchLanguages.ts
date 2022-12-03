import Language from "./models/Language";
import Languages from "./models/Languages";

const LANGUAGE_URL = "https://api.hel.fi/linkedevents/v1/language/";

const MAX_RETRIES = 2;

export default async function fetchLanguages(): Promise<Languages> {

    let working = false;

    let retries = 0;

    let response = await fetch(LANGUAGE_URL);

    while (!response.ok && retries <= MAX_RETRIES) {
        if (!working) {
            working = true;

            retries += 1;

            response = await fetch(LANGUAGE_URL)
                .then(response => {
                    working = false;
                    
                    return response;
                });
        }
    }

    let languages = await response.json() as Languages;

    return unshiftDefaultLanguage(languages);
}

/**
 * Adds a default unselected language to the first index of array of languages.
 * @param oldLanguages current array of languages.
 * @returns languages with the default language.
 */
function unshiftDefaultLanguage(oldLanguages: Languages): Languages {
    let newLanguages = { ...oldLanguages };

    let defaultLanguage: Language = {
        id: "none",
        name: {
            fi: "ei valittu",
            en: "none selected",
            se: "ingen vald"
        }
    };

    newLanguages.data.unshift(defaultLanguage);

    return newLanguages;
}