import React from "react";
import Event from "../models/Event";

interface Props {
    event: Event;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EventDetails(props: Props) {
    const placeImage = props.event.linkedLocation?.linkedImage;
    const noImageAvailable = require("../Assets/no_image_available.png");

    return (
        <div className="event-details">
            <div className="event">
                <h1>{props.event.name?.fi}</h1>
                <h2><span>{new Date(props.event.start_time).toLocaleString()}</span><span>-</span><span>{new Date(props.event.end_time).toLocaleString()}</span></h2>
            </div>
            <div className="event-description" dangerouslySetInnerHTML={{ __html: props.event.description?.fi! }}></div>

            {
                props.event.offers ? <div className="event-offers">
                    {
                        props.event.offers?.map((offer, index) => <div key={index} className="offer">
                            {offer.price?.fi ? <span>Hinta {offer.price?.fi}</span> : <></>}
                            {offer.info_url?.fi ? <span>Lisätiedot: <a href={offer.info_url?.fi}>{offer.info_url?.fi}</a></span> : <></>}
                        </div>)
                    }
                </div>
                    : <></>
            }

            {
                props.event.linkedLocation ?
                    <div className="event-place">

                        {
                            placeImage ? <img src={placeImage.url} alt={placeImage?.alt_text}></img> : <img src={noImageAvailable} alt="No image available"></img>
                        }

                        <div className="event-place-information">
                            <h3>Paikka</h3>
                            <div>{props.event.linkedLocation.name?.fi}</div>
                            <div>{props.event.linkedLocation.street_address?.fi}</div>
                            <div>{props.event.linkedLocation.postal_code} {props.event.linkedLocation.address_locality?.fi}</div>
                            <div>{props.event.linkedLocation.telephone?.fi}</div>
                            <div>{props.event.linkedLocation.email}</div>
                            <div><a href={props.event.linkedLocation.info_url?.fi} target="_blank">{props.event.linkedLocation.info_url?.fi}</a></div>
                        </div>
                    </div>
                    :
                    <div className="event-place"></div>
            }

            {
                props.event.external_links ? <div className="event-details-external-links">
                    {props.event.external_links.map(externalLink =>
                        <div className="event-details-external-link"><a href={externalLink.link}>{externalLink.name}</a></div>)
                    }
                </div> : <></>
            }

            <div className="event-details-images">
                {props.event.images?.map(image => <img key={image.id} src={image.url}></img>)}
            </div>
            
            <button onClick={props.onClick}>Return</button>
        </div>
    )
}