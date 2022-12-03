import * as React from 'react';
import Keyword from '../models/Keyword';
import Languages from '../models/Languages';
import QueryParameters from '../models/QueryParameters';
import DatePicker from "./DatePicker"
import TextInput from './TextInput';
import Select, { MultiValue } from "react-select";
import Ordering from './Ordering';
import Language from './Language';

interface Props {
    languages: Languages;
    topics: Keyword[];
    audiences: Keyword[];
    queryParameters: QueryParameters;
    setQueryParameters: React.Dispatch<React.SetStateAction<QueryParameters>>;
    onClick: React.MouseEventHandler<HTMLButtonElement>
}

// Used for react-select.
interface Option {
    value: string;
    label: string;
}

export default function Search(props: Props) {
    // Create a list of available options for react select component from the topic keywords.
    const topicOptions: Option[] = props.topics.map(topic => { return { value: topic.id, label: topic.name.fi } as Option });

    // Create a list of selected options for the react select by filtering the available options with the topic values in the query parameters.
    const selectedTopicOptions: Option[] = topicOptions.filter(option => props.queryParameters.topics.includes(option.value));

    // Create a list of available audience options for the react select component from the audience keywords.
    const audienceOptions: Option[] = props.audiences.map(audience => { return { value: audience.id, label: audience.name.fi } as Option });

    // List of selected audience options for the react select.
    const selectedAudienceOptions: Option[] = audienceOptions.filter(option => props.queryParameters.audiences.includes(option.value));

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let currentTarget = event.currentTarget;

        let checked = currentTarget.checked;

        if (checked) {
            queryParameters.isFree = true;
        } else {
            queryParameters.isFree = false;
        }

        props.setQueryParameters(qp => queryParameters);
    }

    const handleTopicChange = (options: MultiValue<Option>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let topics = options.map(option => option.value);

        queryParameters.topics = topics;

        props.setQueryParameters(qp => queryParameters);
    }

    const handleAudienceChange = (options: MultiValue<Option>) => {
        let queryParameters = {...props.queryParameters} as QueryParameters;

        let audiences = options.map(option => option.value); 

        queryParameters.audiences = audiences;

        props.setQueryParameters(qp => queryParameters);
    }
    
    return (
        <div id='search-container'>
            <TextInput queryParameters={props.queryParameters} setQueryParameters={props.setQueryParameters}></TextInput>

            <div className="date">
                <DatePicker label="From" queryParameters={props.queryParameters} setQueryParamaters={props.setQueryParameters}></DatePicker>
                <DatePicker label="To" queryParameters={props.queryParameters} setQueryParamaters={props.setQueryParameters}></DatePicker>
            </div>

            <div className='price'>
                <label htmlFor="isFree">Is free</label>
                <input type="checkbox" id="isFree" checked={props.queryParameters.isFree ? true : false} onChange={handlePriceChange}></input>
            </div>

            <Language languages={props.languages} queryParameters={props.queryParameters} setQueryParameters={props.setQueryParameters}></Language>
            
            <div className='topics'>
                <label htmlFor='topics'>Topics</label>
                <Select id='topics' onChange={handleTopicChange} value={selectedTopicOptions} options={topicOptions} isMulti ></Select>
            </div>

            <div className='audiences'>
                <label htmlFor='audiences'>Audiences</label>
                <Select id='audiences' onChange={handleAudienceChange} value={selectedAudienceOptions} options={audienceOptions} isMulti></Select>
            </div>
            
            <Ordering queryParameters={props.queryParameters} setQueryParameters={props.setQueryParameters}></Ordering>

            <div className='get-events'>
                <button onClick={props.onClick}>Get events</button>
            </div>
        </div>
    )
}