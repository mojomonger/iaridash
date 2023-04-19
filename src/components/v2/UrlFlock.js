import React, { useState } from 'react';

/*
assumes urlArray is an array of url objects wrapped in a data object:
    [
        {
            data: {
                url : <url>,
                status_code : <status_code>,
                <other url info>
            },
            status_code: XXX
        },
        ...
    ]

and filterDef property is a filter object definition of the form:

    {
        caption: "caption here",
        desc: "", // ? tooltip text?
        filterFunction: () => { <return callback function to filter> }
    }

example:
    {
        caption: "General",
        desc: "",
        filterFunction: () => (d) => {return d.type === "general"},
    }

useSort and sort: apply sorting if set to true, use ASC if sortDir is true, DESC otherwise
 */
export default function UrlFlock({ urlArray, urlFilterDef, isLoading }) {

    // const [sort, setSort] = useState("status");
    const sort = "status";
    const [sortDir, setSortDir] = useState(true);

    let urls = [];

    if (!urlArray || urlArray.length === 0) {
        urls = <p>No URLs to show!</p>;
    }
    else {
        // filter the urls if filter defined
        const filteredUrls = urlFilterDef
            ? urlArray.filter( (urlFilterDef.filterFunction)() )
            : urlArray;

        // sort if specified
        if (sort === "status") {
            filteredUrls.sort((a,b) => {
                // use status code of -1 if there was a problem with status code
                const statusA = a.data && a.data.status_code !== undefined ? a.data.status_code : -1;
                const statusB = b.data && b.data.status_code !== undefined ? b.data.status_code : -1;

                // respect sortDir
                if (statusA < statusB) return sortDir ? -1 : 1;
                if (statusA > statusB) return sortDir ? 1 : -1;
                return 0;
            })
        }

        // iterate over array of url objects to create rendered output
        const rows = filteredUrls.map((u, i) => {

            // TODO: we should sanitize earlier on in the process to save time here...

            // if url object is problematic...
            if (!u.data || u.data.url === undefined || u.data.status_code === undefined)
                return <div className={`url-row url-row-error`} key={i}>
                    <div className={"url-name"}>{u.data.url ? u.data.url : `ERROR: No url for index ${i}`}</div>
                    <div className={"url-status"}>{-1}</div>
                </div>;

            // else show with styling for url status type
            return <div className={`url-row ${u.data.status_code === 0 
                ? "url-is-unknown" : ""} ${u.data.status_code >= 300 && u.data.status_code < 400 
                ? "url-is-redirect" : ""} ${u.data.status_code >= 400 && u.data.status_code < 500
                ? "url-is-notfound" : ""} ${u.data.status_code >= 500 && u.data.status_code < 600
                ? "url-is-error" : ""}`} key={i}>
                <div className={"url-name"}><a href={u.data.url} target={"_blank"} rel={"noreferrer"} key={i}>{u.data.url}</a></div>
                <div className={"url-status"}>{u.data.status_code}</div>
            </div>

        } )

        const label = `${filteredUrls.length} Filtered URLs: ${urlFilterDef ? urlFilterDef.caption : "No Filter"}`;

        urls = <>
            <h4 style={{color:"grey"}}>{label}</h4>
            {/* USE ONLY WHEN DEBUG <p>sort = {sort?"true":"false"}</p>*/}
            <div className={"url-list"}>
                <div className={"url-row url-header-row"}>
                    <div className={"url-name"} >url</div>
                    <div className={"url-status"} onClick={() => {
                        // console.log("arf");
                        setSortDir(!sortDir);
                    }
                    }>status</div>
                </div>
                {rows}
            </div>
        </>
    }

    return <>
        <div className={"url-flock"}>
            {/*<h3>URLs</h3>*/}
            {urls}
        </div>
    </>
}