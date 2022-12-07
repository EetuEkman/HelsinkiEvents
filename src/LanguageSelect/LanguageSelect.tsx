import React from "react";
import { AvailableLanguages, LOCAL_STORAGE_KEYS } from "../App";
import ReactFlagsSelect from "react-flags-select";

interface Props {
    appLanguage: string;
    setAppLanguage: React.Dispatch<React.SetStateAction<string>>;
}

export default function LanguageSelect(props: Props) {
    const toReactFlagSelectValue = (availableLanguage: string) => {
        switch(availableLanguage) {
            case AvailableLanguages.english:
                return "GB"
            case AvailableLanguages.finnish:
                return "FI"
            default:
                return ""
        }
    }

    const handleChange = (value: string) => {
        switch (value) {
            case "FI":
                props.setAppLanguage(al => AvailableLanguages.finnish);

                localStorage.setItem(LOCAL_STORAGE_KEYS.appLanguage, AvailableLanguages.finnish);

                break;
            case "GB":
                props.setAppLanguage(al => AvailableLanguages.english);


                localStorage.setItem(LOCAL_STORAGE_KEYS.appLanguage, AvailableLanguages.english);

                break;
        }

        
    }

    return (
        <div className="language-select">
            <ReactFlagsSelect
                selected={toReactFlagSelectValue(props.appLanguage)}
                countries={["FI", "GB"]}
                customLabels={{ FI: "Suomi", GB: "English" }}
                onSelect={handleChange}>
            </ReactFlagsSelect>
        </div>
    )
}