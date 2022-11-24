interface LanguageName {
    fi?: string;
    se?: string;
    en?: string;
}

export default interface Language {
    id: string;
    name: LanguageName;
}