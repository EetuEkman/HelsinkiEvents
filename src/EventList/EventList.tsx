import React, { useContext } from "react";
import Event, { Name } from "../models/Event"
import Working from "./Working";
import { AppLanguageContext, AvailableLanguages } from '../App';

interface Props {
    events: Event[];
    isWorking: boolean;
    onClick: React.MouseEventHandler<HTMLLIElement>
}

export default function EventList(props: Props) {
    const appLanguageContext = useContext(AppLanguageContext);

    const getFinnishEventNameSpan = (event: Event) => {
        if (!event.name) {
            return <span>Tapahtuma</span>
        }

        return <span>{event.name.fi}</span>
    }

    const getEnglishEventNameSpan = (event: Event) => {
        if (!event.name) {
            return <span>Event</span>
        }

        if (!event.name.en) {
            return getFinnishEventNameSpan(event);
        }

        if (event.name.en.length === 0) {
            return getFinnishEventNameSpan(event);
        }

        return <span>{event.name.en}</span>
    }

    const getEventNameSpan = (event: Event, appLanguage: string) => {
        switch(appLanguage) {
            case AvailableLanguages.finnish:
                return getFinnishEventNameSpan(event);
            case AvailableLanguages.english:
                return getEnglishEventNameSpan(event)
            default:
                return getEnglishEventNameSpan(event);
        }
    }

    return (
        <ul id="event-list">
            {
                props.isWorking
                ?
                <Working></Working>
                :
                props.events.length > 0 ?
                    props.events.map((event, index) => {
                        return (
                            <li key={index} data-index={index} onClick={props.onClick}>
                                {
                                    event.end_time
                                        ? <span>{new Date(event.start_time).toLocaleDateString()} - {new Date(event.end_time).toLocaleDateString()}</span>
                                        : <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                }

                                { getEventNameSpan(event, appLanguageContext) }
  
                                { event.images![0] ? <img src={event.images![0].url}></img> : null }
                            </li>
                        )
                    })
                :
                <li style={{justifyContent: "center"}}>{appLanguageContext === AvailableLanguages.finnish ? "Ei tapahtumia." : "No events."}</li>
            }
        </ul>

    )
}