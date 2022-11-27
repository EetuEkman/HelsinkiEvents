import React from "react";
import Event from "../models/Event";
import Image from "../models/Image";
import Place from "../models/Place";
import EventExternalLinks from "./EventExternalLinks";
import EventOffers from "./EventOffers";
import EventPlace from "./EventPlace";

interface Props {
    event: Event;
    places: Place[];
    placeImages: Image[];
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EventDetails(props: Props) {
    return (
        <div className="event-details">
            <div className="event">
                <h2>{props.event.name?.fi}</h2>
                <h3><span>{new Date(props.event.start_time).toLocaleString()}</span><span>-</span><span>{new Date(props.event.end_time).toLocaleString()}</span></h3>
            </div>

            <div className="event-description" dangerouslySetInnerHTML={{ __html: props.event.description?.fi! }}></div>

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
                        <></>
                    : <></>
            }

            <EventPlace event={props.event} places={props.places} placeImages={props.placeImages}></EventPlace>

            <button onClick={props.onClick}>Return</button>
        </div>
    )
}