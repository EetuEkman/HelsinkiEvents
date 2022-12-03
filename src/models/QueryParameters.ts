/**
 * Represents the event search options.
 * Used to build the query string used in querying the api.
 * Used as a state of the search options.
 */
export default interface QueryParameters {
    text: string;
    start: string;
    end: string;
    isFree: boolean;
    language: string;
    orderBy: string;
    orderByDescending: boolean;
    topics: string[];
    audiences: string[];
}

/**
 * Defined order options.
 */
export enum OrderBy {
    lastModifiedTime = "last_modified_time",
    startTime = "start_time",
    endTime = "end_time",
    name = "name",
    duration = "duration"
}