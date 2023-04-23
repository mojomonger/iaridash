import React, {useState} from "react";
import ArrayDisplay from "../ArrayDisplay";

/* pageData should have:
    links []
    timestamp
    isodate
    id
    served_from_cache
 */
export default function PageInfo({ pageData }) {

    const [showDetail, setShowDetail] = useState(false);

    return <div className="page-info">
        <h3>PDF Page Analyzed: <a href={pageData.pathName} target={"_blank"} rel={"noreferrer"}>{pageData.pathName}</a
            > <button onClick={()=>setShowDetail(!showDetail)} className={"more-button"}>{ showDetail ? "less" : "more" } details</button>
        </h3>

        {pageData
            ? <div className={ showDetail ? "detail-show" : "detail-hide" }>

                <p>endpoint: <a href={pageData.endpoint} target={"_blank"} rel={"noreferrer"}>{pageData.endpoint}</a></p>
                <p>media type: {pageData.mediaType}</p>

                <div style={{display: "flex", flexDirection: "row"}}>

                    <ArrayDisplay arr={[
                        {'IARI version': pageData.version},
                        {'media type': pageData.mediaType},
                        {'id': pageData.id},
                    ]}/>

                    <ArrayDisplay arr={[
                        {'timestamp': pageData.timestamp ? new Date(pageData.timestamp * 1000).toString() : ""}, // times 1000 b/c of milliseconds
                        {'isodate': pageData["isodate"]},
                        {'servedFromCache': pageData['served_from_cache'] ? "true" : "false"},

                    ]} styleObj={{marginLeft: "1em"}}/>
                </div>
            </div>

            : <p>Nothing to display - pageData is missing.</p>
        }

    </div>

}