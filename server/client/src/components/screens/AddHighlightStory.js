import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../App';
import { Link, useHistory } from 'react-router-dom';
import PreLoader from '../Preloader';
import M from "materialize-css";

const AddHighlightStory = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [stories, setStories] = useState([]);
    const [storiesToHighlight, setStoriesToHighlight] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetch('/myUnhighlightedStories', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setStories([...stories, ...result.stories]);
                setLoading(false);
            })
    }, [])

    const checkStory = (storyId) => {
        if (storiesToHighlight.some(sid => sid === storyId)) {
            var newStoriesToHighlight = storiesToHighlight.filter(sid => sid !== storyId);
            setStoriesToHighlight(newStoriesToHighlight);
        }
        else {
            setStoriesToHighlight([...storiesToHighlight, storyId]);
        }
    }

    const highlightStories=()=>{
        setLoading(true);
        fetch('/highlightStories', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                storyIds: storiesToHighlight
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-1" });
                }
                else {
                    M.toast({ html: "Highlighted Story Successfully!", classes: "#43a047 green darken-1" });
                    history.push('/profile');
                }
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            <div style={{ textAlign: "center", margin: "10px auto" }}>
                <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                 onClick={() => highlightStories()}
                >
                    Highlight Checked Stories
                </button>
            </div>

            <div className="row">
                {
                    loading ?
                        <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                            <PreLoader />
                        </div>
                        :
                        stories.map(story => {
                            return (
                                <div className="card col s4" key={story._id}>
                                    <div className="card-content">

                                        <label>
                                            <input type="checkbox" onClick={() => checkStory(story._id)} />
                                            <span></span>
                                        </label>

                                        <p className="card-title" style={{ paddingBottom: "13px", fontSize: "0.8em" }}>{new Date(story.createdAt).toLocaleString()}</p>
                                        <div className="card-image" style={{ height: "200px" }}>
                                            {
                                                story.file.substring(story.file.lastIndexOf('.') + 1, story.file.length).match(/(jpg|jpeg|png|gif)$/i) ?
                                                    <img src={story.file} style={{ height: "100%", objectFit: "cover" }} />
                                                    : <video className="responsive-video" src={story.file} frameBorder="0" controls style={{ height: "100%", objectFit: "cover" }} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </div>
    )
}

export default AddHighlightStory