import React from "react";
import { faInstagram, faFacebook, faYoutube, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Event from "../models/Event";
import ExternalLink from "../models/ExternalLink";

interface Props {
    event: Event;
}

function socialMediaLink(externalLink: ExternalLink, key: number): JSX.Element {
    let name = externalLink.name;
    let link = externalLink.link;

    switch (name) {
        case "extlink_instagram":
            return <div key={key}><a href={link}><FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon></a></div>
        case "extlink_facebook":
            return <div key={key}><a href={link}><FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon></a></div>
        case "extlink_youtube":
            return <div key={key}><a href={link}><FontAwesomeIcon icon={faYoutube}></FontAwesomeIcon></a></div>
        case "extlink_twitter":
            return <div key={key}><a href={link}><FontAwesomeIcon icon={faTwitter}></FontAwesomeIcon></a></div>
        default:
            return <div key={key} className="event-details-external-link"><a href={externalLink.link}>{externalLink.name}</a></div>
    }
}

export default function EventExternalLinks(props: Props) {
    return (
        props.event.external_links
            ?
            props.event.external_links.length > 0 ?
                <div className="event-details-external-links">
                    {
                        props.event.external_links.map((externalLink, index) =>
                            socialMediaLink(externalLink, index)
                        )
                    }
                </div> : <></>
            :
            <></>
    )
}