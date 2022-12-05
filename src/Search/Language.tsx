import React, { useContext } from "react";
import Languages from "../models/Languages";
import QueryParameters from "../models/QueryParameters";
import { AppLanguageContext, AvailableLanguages } from "../App";

interface Props {
    languages: Languages;
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

export default function Language(props: Props) {
    // Languages from the API are only available in Finnish.
    const finnishToEnglish = (language: string | undefined) => {
        if (language) {
            language = language.toLowerCase();
        }

        switch (language) {
            case "ei valittu":
                return "None selected";
            case "englanti":
                return "English";
            case "ruotsi":
                return "Swedish";
            case "suomi":
                return "Finnish";
            case "venäjä":
                return "Russian";
            case "viro":
                return "Estonian";
            case "ranska":
                return "French";
            case "somali":
                return "Somali";
            case "espanja":
                return "Spanish";
            case "turkki":
                return "Turkki";
            case "persia":
                return "Persia";
            case "arabia":
                return "Arabian";
            case "kiina":
                return "Chinese";
            default:
                return language;
        }
    }

    const getLabel = (appLanguage: string) => {
        switch(appLanguage) {
            case AvailableLanguages.finnish:
                return <label htmlFor="language">Kieli</label>
            case AvailableLanguages.english:
                return <label htmlFor="language">Language</label>
            default:
                return <label htmlFor="language">Language</label>
        }
    }

    // Builds options for the language select based on app language.
    // Language names in English are seemingly not available in the API.
    const getOptions = (appLanguage: string) => {
        switch (appLanguage) {
            case AvailableLanguages.finnish:
                return props.languages.data
                    .map(language => <option key={language.id} value={language.id}>{language.name.fi}</option>)
            case AvailableLanguages.english:
                return props.languages.data
                    .map(language => <option key={language.id} value={language.id}>{finnishToEnglish(language.name.fi)}</option>)
            default:
                return props.languages.data
                    .map(language => <option key={language.id} value={language.id}>{finnishToEnglish(language.name.fi)}</option>)
        }
    }

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let queryParameters = { ...props.queryParameters } as QueryParameters;

        let currentTarget = event.currentTarget;

        let language = currentTarget.value;

        queryParameters.language = language;

        props.setQueryParameters(qp => queryParameters);
    }

    const appLanguageContext = useContext(AppLanguageContext);

    return (
        <div className='language'>
            {getLabel(appLanguageContext)}

            <select id="language" name="language" value={props.queryParameters.language} onChange={handleLanguageChange}>
                {getOptions(appLanguageContext)}
            </select>
        </div>
    )
}