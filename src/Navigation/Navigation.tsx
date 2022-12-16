import React, { useContext } from "react";
import Meta from "../models/Meta";
import { AppLanguageContext, AvailableLanguages } from "../App";

interface Props {
    meta: Meta;
    isWorking: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    loadPage: (pageNumber: number) => void;
}

function getPageNumberFromPreviousUrl(url: string | undefined): string {
    if (!url) {
        return "1";
    }

    let index = url.indexOf("page=");

    if (index === -1) {
        return "2";
    }

    let subString = url.substring(index);

    let pageNumber = Number.parseInt(subString.replace("page=", "")) + 1;

    return pageNumber.toString();
}

function getMaxPages(itemCount: number, itemsPerPage: number): number {
    return Math.ceil(itemCount / itemsPerPage);
}

function pageNumberPrompt(appLanguage: string): number | null {
    let input: string | null;

    switch (appLanguage) {
        case AvailableLanguages.finnish:
            input = prompt("Sivunumero");

            while (input !== null && Number.isNaN(Number.parseInt(input))) {
                input = prompt("Sivunumero");
            }

            if (input === null) {
                return null;
            }

            return Number.parseInt(input);

        default:
            input = prompt("Page number");

            while (input !== null && Number.isNaN(Number.parseInt(input))) {
                input = prompt("Page number");
            }

            if (input === null) {
                return null;
            }

            return Number.parseInt(input);
    }
}

export default function Navigation(props: Props) {
    const appLanguage = useContext(AppLanguageContext);

    const pages = getMaxPages(props.meta.count, 20);

    const onPageNumberClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (props.meta.count <= 20) {
            return;
        }

        let pageNumber = pageNumberPrompt(appLanguage)

        if (pageNumber === null) {
            return;
        }

        props.loadPage(pageNumber);
    }

    return (
        <div id="navigation-container">
            {
                props.meta.count === 0 ?
                    null
                    :
                    <>
                        {props.meta.previous && props.isWorking === false
                            ?
                            <button data-direction="previous" onClick={props.onClick}>{appLanguage === AvailableLanguages.finnish ? "Edellinen" : "Previous"}</button>
                            :
                            <button disabled>{appLanguage === AvailableLanguages.finnish ? "Edellinen" : "Previous"}</button>
                        }
                        <span onClick={onPageNumberClick} className="page_number">{getPageNumberFromPreviousUrl(props.meta.previous)} / {pages}</span>
                        {
                            props.meta.next && props.isWorking === false
                                ?
                                <button data-direction="next" onClick={props.onClick}>{appLanguage === AvailableLanguages.finnish ? "Seuraava" : "Next"}</button>
                                :
                                <button disabled>{appLanguage === AvailableLanguages.finnish ? "Seuraava" : "Next"}</button>
                        }
                    </>
            }
        </div>
    )
}