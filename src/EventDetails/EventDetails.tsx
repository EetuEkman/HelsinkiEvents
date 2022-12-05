import React, { useContext } from "react";
import Event from "../models/Event";
import Image from "../models/Image";
import Place from "../models/Place";
import EventExternalLinks from "./EventExternalLinks";
import EventOffers from "./EventOffers";
import EventPlace from "./EventPlace";
import { AppLanguageContext, AvailableLanguages } from '../App';

interface Props {
    event: Event;
    places: Place[];
    placeImages: Image[];
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EventDetails(props: Props) {
    const appLanguageContext = useContext(AppLanguageContext);

    const getFinnishDescription = (event: Event): JSX.Element => {
        if (event.description?.fi) {
            if (event.description.fi.length > 0) {
                return <div className="event-description" dangerouslySetInnerHTML={{ __html: event.description.fi }}></div>
            }
        }

        if (event.short_description?.fi) {
            if (event.short_description.fi.length > 0) {
                return <div className="event-description" dangerouslySetInnerHTML={{ __html: event.short_description.fi}}></div>
            }
        }

        return <div className="event-description"></div>
    }

    const getEnglishDescription = (event: Event): JSX.Element => {
        if (event.description?.en) {
            if (event.description.en.length > 0) {
                return <div className="event-description" dangerouslySetInnerHTML={{ __html: event.description.en }}></div>
            }
        }

        if (event.short_description?.en) {
            if (event.short_description.en.length > 0) {
                return <div className="event-description" dangerouslySetInnerHTML={{ __html: event.short_description.en}}></div>
            }
        }

        return getFinnishDescription(event);
    }

    const getDescription = (event: Event, appLanguage:string) => {
        switch(appLanguage) {
            case AvailableLanguages.finnish:
                return getFinnishDescription(event);
            case AvailableLanguages.english:
                return getEnglishDescription(event);
            default:
                return getEnglishDescription(event);
        }
    }

    return (
        <div className="event-details">
            <div className="event">
                <h2>{props.event.name?.fi}</h2>
                <h3><span>{new Date(props.event.start_time).toLocaleString()}</span><span>-</span><span>{new Date(props.event.end_time).toLocaleString()}</span></h3>
            </div>

            {
                getDescription(props.event, appLanguageContext)
            }
            
            <EventOffers event={props.event}></EventOffers>

            <EventExternalLinks event={props.event}></EventExternalLinks>

            {
                props.event.images
                    ?
                    props.event.images.length > 0
                        ?
                        <div className="event-details-images">
                            {props.event.images?.map(image => <img key={image.id} src={image.url}></img>)}
                        </div>
                        :
                        null
                    : null
            }

            <EventPlace event={props.event} places={props.places} placeImages={props.placeImages}></EventPlace>

            <button onClick={props.onClick}>{ appLanguageContext === AvailableLanguages.finnish ? "Palaa" : "Return"}</button>
        </div>
    )
}