import React, { useContext } from "react";
import Meta from "../models/Meta";
import { AppLanguageContext, AvailableLanguages } from "../App";

interface Props {
    meta: Meta;
    isWorking: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
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

export default function Navigation(props: Props) {
    const appLanguageContext = useContext(AppLanguageContext);

    const pages = getMaxPages(props.meta.count, 20);

    return (
        <div id="navigation-container">
            {
                props.meta.count === 0 ?
                    null
                    :
                    <>
                        {props.meta.previous && props.isWorking === false
                            ?
                            <button data-direction="previous" onClick={props.onClick}>{ appLanguageContext === AvailableLanguages.finnish ? "Edellinen" : "Previous" }</button>
                            :
                            <button disabled>{ appLanguageContext === AvailableLanguages.finnish ? "Edellinen" : "Previous" }</button>
                        }
                        <span>{getPageNumberFromPreviousUrl(props.meta.previous)} / {pages}</span>
                        {
                            props.meta.next && props.isWorking === false
                                ?
                                <button data-direction="next" onClick={props.onClick}>{ appLanguageContext === AvailableLanguages.finnish ? "Seuraava" : "Next" }</button>
                                :
                                <button disabled>{ appLanguageContext === AvailableLanguages.finnish ? "Seuraava" : "Next" }</button>
                        }
                    </>
            }
        </div>
    )
}