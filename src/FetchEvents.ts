import Events from "./models/Events";
import QueryParameters, { OrderBy } from "./models/QueryParameters";

const EMPTY_QUERY_PARAMETERS: QueryParameters = {
    text: "",
    isFree: false,
    start: "",
    end: "",
    language: "none",
    orderBy: OrderBy.lastModifiedTime,
    orderByDescending: true,
    topics: [],
    audiences: []
}

const MAX_RETRIES = 2;

const EVENTS_URL = "https://api.hel.fi/linkedevents/v1/event/?format=json&page=1";

/**
 * 
 * @param url 
 * @param queryParameters 
 * @returns 
 */

function appendQueryParameters(url: string, queryParameters: QueryParameters): string {
    
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

    url = url + "&sort=";

    if (queryParameters.orderByDescending) {
        url = url + "-";
    }

    url = url + queryParameters.orderBy;

    if (queryParameters.topics.length > 0 || queryParameters.audiences.length > 0) {
        url = url + "&keyword_AND=";

        if (queryParameters.topics.length > 0) {
            let topics = queryParameters.topics.join();

            url = url + topics;
        }

        if (queryParameters.audiences.length > 0) {
            let audiences = queryParameters.audiences.join();

            if (queryParameters.topics.length > 0) {
                url = url + ",";
            }

            url = url + audiences;
        }
    }

    return url;
}
/**
 * Fetches a events object from the events resource with query parameters or without the query parameters if supplied with url.
 * @param url url to the events resource
 * @param queryParameters query parameters object
 * @returns 
 */

export default async function fetchEvents(url: string = EVENTS_URL, queryParameters = EMPTY_QUERY_PARAMETERS): Promise<Events> {
    let working = false;

    let retries = 0;

    // This function is also used by the pagination links to fetch the next set or "page" of events.
    // These links are included in the initial events object inside the meta member.
    // In this case the url is different than default EVENTS_URL.
    if (url === EVENTS_URL) {
        url = appendQueryParameters(url, queryParameters);
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

    let json = await response.json();

    let events = assertEvents(json);

    events.meta.current = url;

    return events;
}

/**
 * Asserts the unasserted events object to a events object type for type hints etc.
 * @param fetchedEvents unasserted events object
 * @returns asserted events object
 */

export function assertEvents(fetchedEvents: Object): Events {
    let events = { ...fetchedEvents } as Events;

    return events;
}