import React, { useContext } from "react";
import { AppLanguageContext, AvailableLanguages } from "../App";
import QueryParameters from "../models/QueryParameters";

interface Props {
    label: string;
    start?: boolean;
    end?: boolean;
    queryParameters: QueryParameters;
    setQueryParamaters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

export default function DatePicker(props: Props) {
    const appLanguageContext = useContext(AppLanguageContext);

    const getLabelText = (labelText: string, appLanguage: string): string => {
        switch(appLanguage) {
            case AvailableLanguages.finnish:
                switch(labelText) {
                    case "From":
                        return "Alku";
                    case "To":
                        return "Loppu"
                }
            default:
                return labelText;
        }
    }

    function onDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        let queryParameters = { ...props.queryParameters } as QueryParameters;

        let value = event.currentTarget.value;

        if (props.start) {
            queryParameters.start = value;
        }

        if (props.end) {
            queryParameters.end = value;
        }

        props.setQueryParamaters(queryParameters);
    }

    return (
        <>
            <label htmlFor={props.label}>{getLabelText(props.label, appLanguageContext)}</label>
            {
                props.start
                    ?
                    <input type="date" id={props.label} value={props.queryParameters.start} onChange={onDateChange} />
                    :
                    props.end
                        ?
                        <input type="date" id={props.label} value={props.queryParameters.end} onChange={onDateChange} />
                        :
                        null
            }
        </>
    )
}