import React from "react";
import Event from "../models/Event";

interface Props {
    event: Event;
}

export default function EventOffers(props: Props) {
    return (
        props.event.offers
            ?
            props.event.offers.length > 0 ?
            <div className="event-offers">
                {props.event.offers.map((offer, index) => <div key={index} className="offer">
                    {offer.price?.fi ? <div><span>Hinta {offer.price?.fi}</span></div> : <></>}
                    {offer.info_url?.fi ? <div><span>Lisätiedot: <a href={offer.info_url?.fi}>{offer.info_url?.fi}</a></span></div> : <></>}
                </div>)}</div>
                : <></>
            : <></>
    )
}