import React from "react";
import Event from "../models/Event"
import Working from "./Working";

interface Props {
    events: Event[];
    isWorking: boolean;
    onClick: React.MouseEventHandler<HTMLLIElement>
}

export default function EventList(props: Props) {
    return (
        <ul id="event-list">
            {
                props.isWorking
                ?
                <Working></Working>
                :
                props.events.length > 0 ?
                    props.events.map((event, index) => {
                        return (
                            <li key={index} data-index={index} onClick={props.onClick}>
                                {
                                    event.end_time
                                        ? <span>{new Date(event.start_time).toLocaleDateString()} - {new Date(event.end_time).toLocaleDateString()}</span>
                                        : <span>{new Date(event.start_time).toLocaleDateString()}</span>
                                }

                                <span>{event.name?.fi}</span>

                                {event.images![0] ? <img src={event.images![0].url}></img> : <></>}
                            </li>
                        )
                    })
                :
                <li style={{justifyContent: "center"}}>No events.</li>
            }
        </ul>

    )
}