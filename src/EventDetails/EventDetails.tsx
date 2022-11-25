import React from "react";
import Event from "../models/Event";
import Image from "../models/Image";
import Place from "../models/Place";

interface Props {
    event: Event;
    places: Place[];
    placeImages: Image[];
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function EventDetails(props: Props) {
    const place = props.places.find(place => place["@id"] === props.event.location["@id"]);

    let imageId = place?.image;

    const placeImage = props.placeImages.find(image => image.id === imageId);

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
                place ?
                    <div className="event-place">

                        {
                            placeImage ? <img src={placeImage.url} alt={placeImage?.alt_text}></img> : <img src={noImageAvailable} alt="No image available"></img>
                        }

                        <div className="event-place-information">
                            <h3>Paikka</h3>
                            <div>{place?.name?.fi}</div>
                            <div>{place?.street_address?.fi}</div>
                            <div>{place?.postal_code} {place?.address_locality?.fi}</div>
                            <div>{place?.telephone?.fi}</div>
                            <div>{place?.email}</div>
                            <div><a href={place?.info_url?.fi} target="_blank">{place?.info_url?.fi}</a></div>
                        </div>
                    </div>
                    :
                    <div className="event-place"></div>
            }

            {
                props.event.external_links ? <div className="event-details-external-links">
                    {props.event.external_links.map((externalLink, index) =>
                    /* external link name like extlink_facebook,  */
                        <div key={index} className="event-details-external-link"><a href={externalLink.link}>{externalLink.name}</a></div>)
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