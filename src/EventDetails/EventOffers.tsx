import React, { useContext } from "react";
import { AppLanguageContext, AvailableLanguages } from "../App";
import Event from "../models/Event";

interface Props {
    event: Event;
}

export default function EventOffers(props: Props) {
    const appLanguageContext = useContext(AppLanguageContext);

    return (
        props.event.offers
            ?
            props.event.offers.length > 0
                ?
                <div className="event-offers">
                    {
                        props.event.offers.map((offer, index) => <div key={index} className="offer">
                            {
                                appLanguageContext === AvailableLanguages.finnish
                                    ?
                                    (offer.price?.fi ? <div><span>Hinta {offer.price?.fi}</span></div> : null)
                                    :
                                    (offer.price?.en ? <div><span>Price {offer.price?.en}</span></div> : null)
                            }

                            {
                                appLanguageContext === AvailableLanguages.finnish
                                    ?
                                    (offer.info_url?.fi ? <div><span>Lisätiedot: <a href={offer.info_url?.fi}>{offer.info_url?.fi}</a></span></div> : null)
                                    :
                                    (offer.info_url?.fi ? <div><span>More information: <a href={offer.info_url?.en}>{offer.info_url?.en}</a></span></div> : null)
                            }
                        </div>
                        )
                    }
                </div>
                : null
            : null
    )
}