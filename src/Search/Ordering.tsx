import React, { useContext } from "react";
import { AppLanguageContext, AvailableLanguages } from "../App";
import QueryParameters, { OrderBy } from "../models/QueryParameters";

interface Props {
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
}

function getOrderingText(value: string, language: string = AvailableLanguages.finnish) {
    switch(language) {
        case AvailableLanguages.finnish:
            return finnishOrderingText(value);
        case AvailableLanguages.english:
            return englishOrderingText(value);
        default:
            return englishOrderingText(value);
    }
}

function finnishOrderingText(option: string) {
    switch (option) {
        case OrderBy.duration:
            return "Kesto";
        case OrderBy.endTime:
            return "Päättymisaika";
        case OrderBy.lastModifiedTime:
            return "Viimeinen muokkausaika";
        case OrderBy.name:
            return "Nimi"
        case OrderBy.startTime:
            return "Aloitusaika"
        default:
            return "Muu"
    }
}

function englishOrderingText(option: string) {
    switch (option) {
        case OrderBy.duration:
            return "Duration";
        case OrderBy.endTime:
            return "End time";
        case OrderBy.lastModifiedTime:
            return "Last modified";
        case OrderBy.name:
            return "Name"
        case OrderBy.startTime:
            return "Start time"
        default:
            return "Other"
    }
}

export default function Ordering(props: Props) {
    
    const appLanguageContext = useContext(AppLanguageContext);
    
    const handleOrderingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let currentTarget = event.currentTarget;

        let checked = currentTarget.checked;

        if (checked) {
            queryParameters.orderByDescending = true;
        } else {
            queryParameters.orderByDescending = false;
        }

        props.setQueryParameters(qp => queryParameters);
    }

    const handleOrderByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let currentTarget = event.currentTarget;

        let orderBy = currentTarget.value;

        queryParameters.orderBy = orderBy;

        props.setQueryParameters(qp => queryParameters);
    }

    return (
        <div className="ordering">
            <div>
                {
                    appLanguageContext === AvailableLanguages.finnish
                        ?
                        <label htmlFor="orderBy">Järjestys</label>
                        :
                        <label htmlFor="orderBy">Order by</label>
                }

                <select id="orderBy" value={props.queryParameters.orderBy} onChange={handleOrderByChange}>
                    {
                        Object.values(OrderBy).map((value, index) => <option key={index} value={value}>{getOrderingText(value, appLanguageContext)}</option>)
                    }
                </select>
            </div>

            <div>
                {
                    appLanguageContext === AvailableLanguages.finnish
                        ?
                        <label htmlFor="descending">Laskeutuva</label>
                        :
                        <label htmlFor="descending">Descending</label>
                }
                <input type="checkbox" id="descending" checked={props.queryParameters.orderByDescending ? true : false} onChange={handleOrderingChange}></input>
            </div>
        </div>
    )
}