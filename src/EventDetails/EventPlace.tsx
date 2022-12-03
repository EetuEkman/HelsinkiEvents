import React, { useEffect } from "react";
import Event from "../models/Event";
import Place from "../models/Place";
import Image from "../models/Image";
import { faPhone, faEnvelope, faLocationDot, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Leaflet from "leaflet"

interface Props {
    event: Event;
    places: Place[];
    placeImages: Image[];
}

export default function EventPlace(props: Props) {
    const place = props.places.find(place => place["@id"] === props.event.location["@id"]);

    let imageId = place?.image;

    const placeImage = props.placeImages.find(image => image.id === imageId);

    // Leaflet map needs element to exist before initialization.

    useEffect(() => {
        // Place's position might not be set.

        if (place?.position) {
            let longitude = place?.position?.coordinates[0];
    
            let latitude = place?.position?.coordinates[1];

            // Center on the place coordinates.
        
            let map = Leaflet.map("map", {
                center: [latitude, longitude],
                zoom: 16
            });

            // Map pans back to the place coordinates on mouse out.

            map.addEventListener("mouseout", () => {
                map.panTo([latitude, longitude]);
            });

            // Add a marker at the place coordinates.

            Leaflet.marker([latitude, longitude]).addTo(map);

            // A "slippy map" requires tile layer. Tile layer provided by openstreetmap.

            Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 12,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        }
    }, [place])

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
                    {
                        place.telephone
                            ?
                            <div className="phone">
                                <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                                <div>
                                    {place.telephone?.fi ? <div>{place?.telephone?.fi}</div> : <></>}
                                    {place.telephone?.en ? <div>{place?.telephone?.en}</div> : <></>}
                                    {place.telephone?.se ? <div>{place?.telephone?.se}</div> : <></>}
                                </div>
                            </div>
                            :
                            <></>
                    }
                    {
                        place.email
                            ?
                            <div className="email"><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon><a href={"mailto:" + place?.email}>{place?.email}</a></div>
                            :
                            <></>
                    }
                    {
                        place.info_url ?
                            <div className="link">
                                <FontAwesomeIcon icon={faExternalLink}></FontAwesomeIcon>
                                <a href={place?.info_url?.fi} target="_blank">{place?.info_url?.fi}</a>
                            </div>
                            :
                            <></>
                    }
                </div>
                {
                    placeImage ?
                        <div className="event-place-image-container">
                            <img src={placeImage.url} alt={placeImage?.alt_text}></img>
                        </div>
                        :
                        <></>
                }

                {
                    // Needed for the Leaflet map.
                    place.position
                        ?
                        <div className="map-container">
                            <div id="map"></div>
                        </div>
                        :
                        <></>
                }
                
            </div>
            :
            <></>
    )
}