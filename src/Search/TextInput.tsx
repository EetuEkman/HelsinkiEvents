import React from "react"
import QueryParameters from "../models/QueryParameters"

interface Props {
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

export default function TextInput(props: Props) {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let currentTarget = event.currentTarget;

        let value = currentTarget.value;

        let newQueryParameters = {...props.queryParameters} as QueryParameters;

        newQueryParameters.text = value;

        props.setQueryParameters(queryParameters => newQueryParameters);
    }

    return (
        <div className="text-input-container">
            <label htmlFor="text">Text</label>
            <input type="text" id="text" value={props.queryParameters.text} onChange={onChange}></input>
        </div>
    )
}