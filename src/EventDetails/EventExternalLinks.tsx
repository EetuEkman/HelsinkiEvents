import React from "react";
import Event from "../models/Event";

interface Props {
    event: Event;
}

export default function EventExternalLinks(props: Props) {
    return (
        props.event.external_links
            ?
            props.event.external_links.length > 0 ?
                <div className="event-details-external-links">
                    {props.event.external_links.map((externalLink, index) =>
                        /* external link name like extlink_facebook,  */
                        <div key={index} className="event-details-external-link"><a href={externalLink.link}>{externalLink.name}</a></div>)
                    }
                </div> : <></>
            :
            <></>
    )
}