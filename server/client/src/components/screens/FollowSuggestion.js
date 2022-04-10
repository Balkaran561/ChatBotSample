import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PreLoader from '../Preloader';

const FollowSuggestion = () => {
    const [followSuggestions, setFollowSuggestions] = useState([]);
    const [followSuggestionLoading, setFollowSuggestionLoading] = useState(false);

    useEffect(() => {
        setFollowSuggestionLoading(true);
        getFollowSuggestions();
    }, [])

    const getFollowSuggestions = () => {
        fetch('/followSuggestions', {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setFollowSuggestions(result.suggestions);
                setFollowSuggestionLoading(false);
            })
    }

    return (
        <div className="home">
            {
                followSuggestionLoading ?
                    <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                        <PreLoader />
                    </div>
                    :
                    <div className="card home-card">
                        <ul className="collection with-header">
                            <li className="collection-header card-title">Follow Suggestions</li>
                            {
                                followSuggestions.map(suggestion => {
                                    return (
                                        <li className="collection-item avatar">
                                            <Link to={`/profile/${suggestion.username}`}>
                                                <img src={`${suggestion.profPic}`} alt="" class="circle" />
                                                <span className="title">{suggestion.username}</span>
                                            </Link>
                                            <p className="grey-text" style={{ paddingBottom: "13px", fontSize: "0.8em" }}>{suggestion.commonCount} common follower(s)</p>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
            }
        </div>
    )
}

export default FollowSuggestion