import Image from "./models/Image";
import Place from "./models/Place";

const IMAGE_URL = "https://api.hel.fi/linkedevents/v1/image/";

const MAX_RETRIES = 2;

export function getNeededImageIds(images: Image[], places: Place[]): number[] {
    let requiredImageIds = places.map(place => place.image);

    let filteredRequiredImageIds = requiredImageIds.filter(imageId => imageId !== null && imageId !== undefined) as number[];

    let knownImageIds = images.map(image => image.id);

    let neededImageIds = filteredRequiredImageIds.filter(id => !knownImageIds.includes(id!));

    return neededImageIds;
}

/**
 * 
 * @param objects unasserted array of image objects
 * @returns asserted array of image objects
 */

export function assertImages(objects: Object[]): Image[] {
    let images = objects.map(object => object as Image)

    return images;
}

/**
 * 
 * @param id image object identifier
 * @returns unasserted image object
 */

async function fetchImage(id: number): Promise<Object> {
    let url = IMAGE_URL + id.toString();

    let working = false;

    let retries = 0;

    let response = await fetch(url);

    // Retry fetch

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

    return json;
}

/**
 * 
 * @param ids array of image ids
 * @returns promise of unasserted image objects
 */

export default async function fetchImages(ids: number[]): Promise<Object[]> {
    let promises = ids.map(id => fetchImage(id));

    let images = await Promise.all(promises);

    return images;
}