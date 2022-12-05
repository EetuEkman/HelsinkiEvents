import React, { useContext } from "react"
import { AppLanguageContext, AvailableLanguages } from "../App";
import QueryParameters from "../models/QueryParameters";

interface Props {
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

export default function TextInput(props: Props) {
    const appLanguageContext = useContext(AppLanguageContext);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let currentTarget = event.currentTarget;

        let value = currentTarget.value;

        let newQueryParameters = { ...props.queryParameters } as QueryParameters;

        newQueryParameters.text = value;

        props.setQueryParameters(queryParameters => newQueryParameters);
    }

    return (
        <div className="text-input-container">
            {
                appLanguageContext === AvailableLanguages.finnish
                    ?
                    <label htmlFor="text">Teksti</label>
                    :
                    <label htmlFor="text">Text</label>
            }

            <input type="text" id="text" value={props.queryParameters.text} onChange={onChange}></input>
        </div>
    )
}