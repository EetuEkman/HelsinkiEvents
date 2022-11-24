import * as React from 'react';
import Languages from '../models/Languages';
import QueryParameters from '../models/QueryParameters';
import DatePicker from "./DatePicker"

interface Props {
    languages: Languages;
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

export default function Search(props: Props) {

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let currentTarget = event.currentTarget;

        let checked = currentTarget.checked;

        if (checked) {
            queryParameters.isFree = true;
        } else {
            queryParameters.isFree = false;
        }

        props.setQueryParameters(queryParameters);
    }

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let currentTarget = event.currentTarget;

        let language = currentTarget.value;

        queryParameters.language = language;

        props.setQueryParameters(queryParameters);
    }
    
    return (
        <div id='search-container'>
            <div className="date">
                <DatePicker label="From" queryParameters={props.queryParameters} setQueryParamaters={props.setQueryParameters}></DatePicker>
                <DatePicker label="To" queryParameters={props.queryParameters} setQueryParamaters={props.setQueryParameters}></DatePicker>
            </div>
            <div>
                <label htmlFor="isFree">Is free</label>
                <input type="checkbox" id="isFree" checked={props.queryParameters.isFree ? true : false} onChange={handlePriceChange}></input>
            </div>
            <div className='select-language'>
                <label htmlFor="language">Language</label>
                <select id="language" name="language" value={props.queryParameters.language} onChange={handleLanguageChange}>
                    {props.languages.data.map((language) => {
                        return <option key={language.id} value={language.id}>{language.name.fi}</option>
                    })}
                </select>
            </div>
            <div className='get-events'>
                <button onClick={props.onClick}>Get events</button>
            </div>
        </div>
    )
}