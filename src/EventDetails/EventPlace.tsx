import React from "react";
import Event from "../models/Event";
import Place from "../models/Place";
import Image from "../models/Image";
import { faPhone, faEnvelope, faHouse } from "@fortawesome/free-solid-svg-icons";
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
                    <h3>Paikka</h3>
                    <div>{place?.name?.fi}</div>
                    <div>{place?.street_address?.fi}</div>
                    <div>{place?.postal_code} {place?.address_locality?.fi}</div>
                    { place.telephone?.fi ? <div><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>{place?.telephone?.fi}</div> : <></> }
                    { place.telephone?.en ? <div><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>{place?.telephone?.en}</div> : <></> }
                    { place.telephone?.se ? <div><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>{place?.telephone?.se}</div> : <></> }
                    { place.email ? <div><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon><a href={"mailto:" + place?.email}>{place?.email}</a></div> : <></>}
                    <div><a href={place?.info_url?.fi} target="_blank">{place?.info_url?.fi}</a></div>
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