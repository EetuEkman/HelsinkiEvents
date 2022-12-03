import Image from "./Image";

export interface KeywordResource {
    "@id": string;
}

interface Name {
    fi: string;
    sv: string;
    en: string;
}

export default interface KeywordSet {
    "id": string,
    "keywords": KeywordResource[];
    "usage": string,
    "created_time": string,
    "last_modified_time": string,
    "image": Image,
    "data_source": string,
    "organization": null,
    "name": Name,
    "@id": string,
    "@context": string,
    "@type": string;
}