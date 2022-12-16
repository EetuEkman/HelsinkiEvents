import React, { useContext } from 'react';
import Keyword from '../models/Keyword';
import Languages from '../models/Languages';
import QueryParameters from '../models/QueryParameters';
import DatePicker from "./DatePicker"
import TextInput from './TextInput';
import Select, { GroupBase, MultiValue, StylesConfig, ThemeConfig } from "react-select";
import Ordering from './Ordering';
import Language from './Language';
import { AppLanguageContext, AvailableLanguages } from '../App';

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
    const appLanguageContext: string = useContext(AppLanguageContext);

    function getTopicOptions(appLanguage: string) {
        switch (appLanguage) {
            case AvailableLanguages.english:
                return props.topics.map(topic => { return { value: topic.id, label: topic.name.en } as Option });
            case AvailableLanguages.finnish:
                return props.topics.map(topic => { return { value: topic.id, label: topic.name.fi } as Option });
            default:
                return props.topics.map(topic => { return { value: topic.id, label: topic.name.en } as Option });                
        }
    }

    const topicOptions = getTopicOptions(appLanguageContext);

    // Create a list of selected options for the react select by filtering the available options with the topic values in the query parameters.
    const selectedTopicOptions: Option[] = topicOptions.filter(option => props.queryParameters.topics.includes(option.value));

    // Create a list of available audience options for the react select component from the audience keywords.
    const audienceOptions = appLanguageContext === AvailableLanguages.finnish
    ?
    props.audiences.map(audience => { return { value: audience.id, label: audience.name.fi } as Option })
    :
    props.audiences.map(audience => { return { value: audience.id, label: /* Some english audience names are not set, use finnish audience names instead. */ (audience.name.en ? audience.name.en : audience.name.fi) } as Option });

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

    // Style config for the react-select.
    const styles: StylesConfig<Option, true, GroupBase<Option>> = {
        container: base => ({
            ...base,
            width: "15em"
        })
    }

    return (
        <div id='search-container'>
            <TextInput queryParameters={props.queryParameters} setQueryParameters={props.setQueryParameters}></TextInput>

            <div className="date">
                <DatePicker start={true} label="From" queryParameters={props.queryParameters} setQueryParamaters={props.setQueryParameters}></DatePicker>
                <DatePicker end={true} label="To" queryParameters={props.queryParameters} setQueryParamaters={props.setQueryParameters}></DatePicker>
            </div>

            <div className='price'>
                {
                    appLanguageContext === AvailableLanguages.finnish
                    ?
                    <label htmlFor="isFree">Ilmainen</label>
                    :
                    null
                }

                {
                    appLanguageContext === AvailableLanguages.english
                    ?
                    <label htmlFor="isFree">Is free</label>
                    :
                    null
                }
                
                <input type="checkbox" id="isFree" checked={props.queryParameters.isFree ? true : false} onChange={handlePriceChange}></input>
            </div>

            <Language languages={props.languages} queryParameters={props.queryParameters} setQueryParameters={props.setQueryParameters}></Language>
            
            <div className='topics'>
                {
                    appLanguageContext === AvailableLanguages.finnish
                        ?
                        <label htmlFor='topics'>Aihepiirit</label>
                        :
                        <label htmlFor='topics'>Topics</label>
                }

                <Select id='topics' theme={theme => ({ ...theme, colors: { ...theme.colors, primary25: "#cccccc" } })} onChange={handleTopicChange} value={selectedTopicOptions} options={topicOptions} placeholder={appLanguageContext === AvailableLanguages.finnish ? "Valitse" : "Select"} styles={styles} isMulti></Select>
            </div>

            <div className='audiences'>
            {
                    appLanguageContext === AvailableLanguages.finnish
                        ?
                        <label htmlFor='audiences'>Yleisöt</label>
                        :
                        <label htmlFor='audiences'>Audiences</label>
                }
                <Select id='audiences' theme={theme => ({...theme, colors: {...theme.colors, primary25: "#cccccc"}})} onChange={handleAudienceChange} value={selectedAudienceOptions} options={audienceOptions} placeholder={appLanguageContext === AvailableLanguages.finnish ? "Valitse" : "Select"} styles={styles} isMulti></Select>
            </div>
            
            <Ordering queryParameters={props.queryParameters} setQueryParameters={props.setQueryParameters}></Ordering>

            <div className='get-events'>
                <button onClick={props.onClick}>{ appLanguageContext === AvailableLanguages.finnish ? "Hae tapahtumat" : "Get events"}</button>
            </div>
        </div>
    )
}