import React from "react";
import Event from "../models/Event"
import Working from "./Working";

interface Props {
    events: Event[];
    isWorking: boolean;
    onClick: React.MouseEventHandler<HTMLLIElement>
}

export default function EventList(props: Props) {
    const noImageAvailable = require("../Assets/no_image_available.png");

    return (
        <ul id="event-list">
            {
                props.isWorking ? <Working></Working> :

                    props.events.map((event, index) => {
                        return (
                            <li key={index} data-index={index} onClick={props.onClick}>
                                {
                                    event.end_time
                                        ? <span>{new Date(event.start_time).toLocaleDateString()} - {new Date(event.end_time).toLocaleDateString()}</span>
                                        : <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                }

                                <span>{event.name?.fi}</span>

                                {event.images![0] ? <img src={event.images![0].url}></img> : <img src={noImageAvailable}></img>}
                            </li>
                        )
                    })
            }
        </ul>

    )
}