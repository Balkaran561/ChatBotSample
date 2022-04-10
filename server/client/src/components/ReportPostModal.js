import React, { useContext, useState} from 'react';
import M from "materialize-css";
import {UserContext} from "../App";

const reportPost = (postId, reason) => {
    if(!reason || reason.length == 0) {
        M.toast({ html: "Please add a reason", classes: "#c62828 red darken-1" });
    } else {
        fetch('/report', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                reason
            })
        })
            .then(res => res.json())
            .then((result) => {
                if(!result.error) {
                    M.toast({ html: "Reported Post Successfully!", classes: "#43a047 green darken-1" });
                }
                var elem = document.querySelector("#reportPostModal");
                M.Modal.init(elem);
                elem.M_Modal.close();
            }).catch(err => {
                console.log(err);
            })
    }
    
}

const ReportPostModal = ()=> {
    const { state } = useContext(UserContext);
    const [reason, setReason] = useState("");
    const handleTextChange = (event) => {
        setReason(event.target.value);
    }

    return (
        <div id="reportPostModal" className="modal modal-fixed-footer small-modal">
            <div className="modal-content">
                <h4 className='styled-title'>Report Post</h4>
                <div className="file-field input-field">
                    <textarea style={{height:"80px"}} type="text" placeholder="Add a reason" className="stylized-input"
                    onChange={handleTextChange} value={reason}/>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                            onClick={() => reportPost(state.reportPostId, reason)}>
                            Report</button>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <a href="#!" className="modal-close btn-flat">Close</a>
            </div>
        </div>
    )
    
}

export default ReportPostModal;