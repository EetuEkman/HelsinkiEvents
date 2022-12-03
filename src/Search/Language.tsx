import React from "react";
import Languages from "../models/Languages";
import QueryParameters from "../models/QueryParameters";

interface Props {
    languages: Languages;
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

export default function Language(props: Props) {
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let queryParameters = { ...props.queryParameters } as QueryParameters;

        let currentTarget = event.currentTarget;

        let language = currentTarget.value;

        queryParameters.language = language;

        props.setQueryParameters(qp => queryParameters);
    }

    return (
        <div className='language'>
            <label htmlFor="language">Language</label>
            <select id="language" name="language" value={props.queryParameters.language} onChange={handleLanguageChange}>
                {
                    props.languages.data.map(language => <option key={language.id} value={language.id}>{language.name.fi}</option>)
                }
            </select>
        </div>
    )
}