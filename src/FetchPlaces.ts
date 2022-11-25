import Place from "./models/Place";
import Event from "./models/Event";
import Events from "./models/Events";

const MAX_RETRIES = 2;

export function getNeededPlaceIds(events: Event[], places: Place[]): string[] {
    let requiredIds = events.map(event => event.location['@id']);

    let knownIds = places.map(place => place['@id']);

    let neededIds = requiredIds.filter(id => !knownIds.includes(id));

    return neededIds;
}

/**
 * 
 * @param objects unasserted array of place objects
 * @returns asserted array of place objects
 */

export function assertPlaces(objects: Object[]): Place[] {
    let places = objects.map(object => object as Place)

    return places;
}

/**
 * 
 * @param id Place object identifier, same as the resource url
 * @returns unasserted place object
 */

async function fetchPlace(id: string): Promise<Object> {
    let working = false;

    let retries = 0;

    let response = await fetch(id);

    // Retry fetch

    while (!response.ok && retries <= MAX_RETRIES) {
        if (!working) {
            working = true;

            retries += 1;

            response = await fetch(id)
                .then(response => {
                    working = false;
                    
                    return response;
                });
        }
    }

    let json = await response.json();

    return json;
}

/**
 * 
 * @param ids array of place ids
 * @returns promise of array of unasserted place objects
 */

export default async function fetchPlaces(ids: string[]): Promise<Object[]> {
    let promises = ids.map(id => fetchPlace(id));

    let places = await Promise.all(promises);

    return places;
}