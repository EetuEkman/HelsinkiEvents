import React from "react";
import Meta from "../models/Meta";

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
    return Math.floor(itemCount / itemsPerPage);
}

export default function Navigation(props: Props) {
    const pages = getMaxPages(props.meta.count, 20);

    return (
        <div id="navigation-container">
            {
                props.meta.count === 0 ?
                    <></>
                    :
                    <>
                        {props.meta.previous && props.isWorking === false
                            ?
                            <button data-direction="previous" onClick={props.onClick}>Previous</button>
                            :
                            <button disabled>Previous</button>
                        }
                        <span>{getPageNumberFromPreviousUrl(props.meta.previous)} / {pages}</span>
                        {
                            props.meta.next && props.isWorking === false
                                ?
                                <button data-direction="next" onClick={props.onClick}>Next</button>
                                :
                                <button disabled>Next</button>
                        }
                    </>
            }
        </div>
    )
}