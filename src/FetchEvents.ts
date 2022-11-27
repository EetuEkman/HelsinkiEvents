import Events from "./models/Events";
import QueryParameters from "./models/QueryParameters";

const EMPTY_QUERY_PARAMETERS: QueryParameters = {
    text: "",
    isFree: false,
    start: "",
    end: "",
    language: "none"
}

const MAX_RETRIES = 2;

const EVENTS_URL = "https://api.hel.fi/linkedevents/v1/event/?format=json";

/**
 * Fetches a events object from the events resource with query parameters
 * @param url url to the events resource
 * @param queryParameters query parameters object
 * @returns 
 */

export default async function fetchEvents(url: string = EVENTS_URL, queryParameters = EMPTY_QUERY_PARAMETERS): Promise<Object> {
    let working = false;

    let retries = 0;

    if (queryParameters.text.length > 0) {
        url = url + "&text=" + queryParameters.text;
    }

    if (queryParameters.start.length > 0) {
        url = url + "&start=" + queryParameters.start;
    }

    if (queryParameters.end.length > 0) {
        url = url + "&end=" + queryParameters.end;
    }

    if (queryParameters.isFree) {
        url = url + "&is_free=true"
    }

    if (queryParameters.language !== "none") {
        url = url + "&language=" + queryParameters.language;
    }

    

    let response = await fetch(url);

    while (!response.ok && retries <= MAX_RETRIES) {
        if (!working) {
            working = true;

            retries += 1;

            response = await fetch(url)
                .then(response => {
                    working = false;
                    
                    return response;
                });
        }
    }

    let events = await response.json();

    return events;
}

/**
 * Asserts the unasserted events object to a events object type
 * @param fetchedEvents unasserted events object
 * @returns arrerted events object
 */

export function assertEvents(fetchedEvents: Object): Events {
    let events = { ...fetchedEvents } as Events;

    return events;
}