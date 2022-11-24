import React from "react";
import QueryParameters from "../models/QueryParameters";

interface Props {
    label: string;
    queryParameters: QueryParameters;
    setQueryParamaters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

export default function DatePicker(props: Props) {

    function onDateChange(event: React.ChangeEvent<HTMLInputElement>) {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let id = event.currentTarget.id;

        let value = event.currentTarget.value;

        if(id === "From") {
            queryParameters.start = value;
        } else {
            queryParameters.end = value;
        }
        
        props.setQueryParamaters(queryParameters);
    }

    return(
        <>
            <label htmlFor={props.label}>{props.label}</label>
            {props.label === "From" ? <input type="date" id={props.label} value={props.queryParameters.start} onChange={onDateChange}/> : <input type="date" id={props.label} value={props.queryParameters.end} onChange={onDateChange}/>}
        </>
    )
}