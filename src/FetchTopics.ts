import Keyword from "./models/Keyword";
import KeywordSet from "./models/KeywordSet";

const TOPICS_URL = "https://api.hel.fi/linkedevents/v1/keyword_set/helsinki:topics/";

const MAX_RETRIES = 2;

export function assertKeywordSet(object: Object): KeywordSet {
    return {...object} as KeywordSet;
}

export async function fetchKeywordSet(setName: string): Promise<Object> {
    let url: string = "";

    switch (setName) {
        case "topics":
            url = TOPICS_URL;
            break;
    }

    let working = false;

    let retries = 0;

    let response = await fetch(url);

    while (!response.ok && retries <= MAX_RETRIES) {
        if (!working) {
            working = true;

            retries += 1;

            response = await fetch(TOPICS_URL)
                .then(response => {
                    working = false;
                    
                    return response;
                });
        }
    }

    let json = await response.json();

    return json;
}

async function fetchKeyword(url: string): Promise<Object> {
    let working = false;

    let retries = 0;

    let response = await fetch(url);

    while (!response.ok && retries <= MAX_RETRIES) {
        if (!working) {
            working = true;

            retries += 1;

            response = await fetch(TOPICS_URL)
                .then(response => {
                    working = false;
                    
                    return response;
                });
        }
    }

    let json = await response.json();

    return json;
}

function assertKeyword(object: Object): Keyword {
    return {...object} as Keyword;
}

async function fetchKeywords(ids: string[]): Promise<Object[]> {
    let promises = ids.map(id => fetchKeyword(id));

    let keywords = await Promise.all(promises);

    return keywords;
}

function assertKeywords(objects: Object[]): Keyword[] {
    let keywords = objects.map(object => object as Keyword);

    return keywords;
}

export default async function fetchTopics(keywordSet: KeywordSet): Promise<Keyword[]> {
    let ids = keywordSet.keywords.map(keyword => keyword["@id"]);

    let topics = fetchKeywords(ids).then(ks => assertKeywords(ks));

    return topics;
}