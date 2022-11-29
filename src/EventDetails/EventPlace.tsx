import React from "react";
import Event from "../models/Event";
import Place from "../models/Place";
import Image from "../models/Image";
import { faPhone, faEnvelope, faLocationDot, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    event: Event;
    places: Place[];
    placeImages: Image[];
}

export default function EventPlace(props: Props) {
    const place = props.places.find(place => place["@id"] === props.event.location["@id"]);

    let imageId = place?.image;

    const placeImage = props.placeImages.find(image => image.id === imageId);

    return (
        place
            ?
            <div className="event-place">
                <div className="event-place-information">
                    <div className="address">
                        <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                        <div>
                            <div>{place?.name?.fi}</div>
                            <div>{place?.street_address?.fi}</div>
                            <div>{place?.postal_code} {place?.address_locality?.fi}</div>
                        </div>
                    </div>
                    <div className="phone">
                        <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                        <div>
                            {place.telephone?.fi ? <div>{place?.telephone?.fi}</div> : <></>}
                            {place.telephone?.en ? <div>{place?.telephone?.en}</div> : <></>}
                            {place.telephone?.se ? <div>{place?.telephone?.se}</div> : <></>}
                        </div>
                    </div>
                    
                    { place.email ? <div className="email"><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon><a href={"mailto:" + place?.email}>{place?.email}</a></div> : <></>}
                    <div className="link">
                        <FontAwesomeIcon icon={faExternalLink}></FontAwesomeIcon>
                        <a href={place?.info_url?.fi} target="_blank">{place?.info_url?.fi}</a>
                    </div>
                </div>
                {
                    placeImage ?
                        <div className="event-place-image-container">
                            <img src={placeImage.url} alt={placeImage?.alt_text}></img>
                        </div>
                        :
                        <></>
                }
            </div>
            :
            <></>
    )
}