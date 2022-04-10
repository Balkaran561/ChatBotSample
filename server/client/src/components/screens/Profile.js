import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../../App';
import { Link, useHistory } from 'react-router-dom';
import PreLoader from '../Preloader';
import { uploadFileToCloudinary } from '../FileUploader';
import M from "materialize-css";
import HighlightStoriesSlider from '../../components/HighlightStoriesSlider';

const Profile = () => {
    const history = useHistory();
    const [profilePosts, setProfilePosts] = useState();
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");
    const [audio, setAudio] = useState("");
    const [cover, setCover] = useState("");
    const [highlightedStories,setHighlightedStories]=useState([]);

    let profileAudio = useRef();
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    useEffect(() => {
        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals, {});
        var materialboxes = document.querySelectorAll('.materialboxed');
        M.Materialbox.init(materialboxes, {});
    }, [])

    useEffect(() => {
        //cleans up audio on component unmount
        return () => {
            if (profileAudio.current) {
                profileAudio.current.pause();
            }
        }
    }, [])

    useEffect(() => {
        fetch('/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setProfilePosts(result.myposts);
            })
    }, [])

    useEffect(()=>{
        if(state&&state._id){
            fetch(`/highlightedStories/${state._id}`, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                }
            })
                .then(res => res.json())
                .then(result => {
                    setHighlightedStories([...highlightedStories,...result.stories]);
                })
        }
    },[state])

    const removeHighlightStory=(storyId)=>{
        fetch('/unhighlightStory', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                storyId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-1" });
                }
                else {
                    M.toast({ html: "Unhighlighted Story Successfully!", classes: "#43a047 green darken-1" });
                    var newHighlighedStories=highlightedStories.filter(story=>story._id!==storyId);
                    setHighlightedStories(newHighlighedStories);
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const updateProfPic = () => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "phongstagram");
            data.append("cloud_name", "phongcloudinary");
            fetch("https://api.cloudinary.com/v1_1/phongcloudinary/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fetch('/updateprofpic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            profPic: data.url
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(result);
                            localStorage.setItem("user", JSON.stringify({ ...state, profPic: result.profPic }));
                            dispatch({ type: "UPDATEPROFPIC", payload: result.profPic });
                        }).then(() => {
                            var elem = document.querySelector("#updateProfPicModal");
                            M.Modal.init(elem);
                            elem.M_Modal.close();
                        })
                }).catch(err => {
                    console.log(err);
                })
        }
        else {
            M.toast({ html: "Please select an image!", classes: "#c62828 red darken-1" });
        }
    }

    const updateProfAudio = () => {
        if (audio) {
            const data = new FormData();
            data.append("file", audio);
            data.append("upload_preset", "phongstagram");
            data.append("cloud_name", "phongcloudinary");
            fetch("https://api.cloudinary.com/v1_1/phongcloudinary/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fetch('/updateprofaudio', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            profAudio: data.url
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(result);
                            localStorage.setItem("user", JSON.stringify({ ...state, profAudio: result.profAudio }));
                            dispatch({ type: "UPDATEPROFAUDIO", payload: result.profAudio });
                        }).then(() => {
                            var elem = document.querySelector("#updateProfAudioModal");
                            M.Modal.init(elem);
                            elem.M_Modal.close();
                        })
                }).catch(err => {
                    console.log(err);
                })
        }
        else {
            M.toast({ html: "Please select an audio!", classes: "#c62828 red darken-1" });
        }
    }

    const updateCoverPic = async () => {
        if (cover) {
            const coverPicUrl = await uploadFileToCloudinary(cover, "https://api.cloudinary.com/v1_1/phongcloudinary/image/upload");
            fetch('/updateprofcoverpic', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    profCoverPic: coverPicUrl
                })
            })
                .then(res => res.json())
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({ ...state, profCoverPic: result.profCoverPic }));
                    dispatch({ type: "UPDATEPROFCOVERPIC", payload: result.profCoverPic });
                }).then(() => {
                    var elem = document.querySelector("#updateProfCoverModal");
                    M.Modal.init(elem);
                    elem.M_Modal.close();
                })

        }
        else {
            M.toast({ html: "Please select a cover image!", classes: "#c62828 red darken-1" });
        }
    }

    useEffect(() => {
        if (state && state.profAudio) {
            var audio = new Audio(state.profAudio);
            audio.loop = true;
            profileAudio.current = audio;
        }
    }, [state])

    const startAudio = () => {
        profileAudio.current.play();
        setIsAudioPlaying(true);
    }

    const pauseAudio = () => {
        profileAudio.current.pause();
        setIsAudioPlaying(false);
    }

    const followUser = (followId) => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: followId
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } });
                localStorage.setItem("user", JSON.stringify(result));
            })
    }

    const unfollowUser = (followId) => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: followId
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                dispatch({ type: "UPDATE", payload: { following: result.following, followers: result.followers } });
                localStorage.setItem("user", JSON.stringify(result));
            })
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0px auto" }}>
            
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                {
                    state && state.profCoverPic
                        ?
                        <img className="materialboxed cover-img"
                            src={state.profCoverPic} />
                        :
                        <div className="no-cover-img"></div>
                }

                <a className="btn-floating btn-large waves-effect waves-light #1976d2 blue darken-1 modal-trigger"
                    href="#updateProfCoverModal"
                    style={{ width: "40px", height: "40px", right: "50px", top: "10px", position: "absolute" }}>
                    <i className="material-icons" style={{ lineHeight: "40px" }}>photo</i>
                </a>
            </div>

            <div id="highlightedStoriesModal" className="modal modal-fixed-footer story-modal">
                <div className="modal-content">
                    {
                        state && highlightedStories && highlightedStories.length > 0 ?
                            <HighlightStoriesSlider removeHighlightStory={removeHighlightStory} currentHighlightStories={highlightedStories} currentStoryUser={state} state={state}/>
                            :
                            <></>
                    }
                </div>
                <div className="modal-footer">
                    <Link className="btn-flat" to="/addHighlightStory">Add More</Link>
                    <a className="modal-close btn-flat">Close</a>
                </div>
            </div>


            <div id="followersModal" className="modal modal-fixed-footer small-modal">
                <div className="modal-content">
                    <h4 className="styled-title">Followers</h4>

                    <ul className="collection">
                        {state && state.followers.length > 0 ?
                            state.followers.map((item) => {
                                return <li key={item._id} className="collection-item avatar">
                                    <Link to={item._id == state._id ? "/profile" : `/profile/${item.username}`}>
                                        <img src={item.profPic} alt="" className="circle" />
                                        <h6 style={{ fontWeight: "500" }} className="title">{item.username}</h6>
                                    </Link>

                                    {
                                        state._id === item._id ?
                                            null :
                                            !state.following || (state.following && !state.following.some(user => user._id === item._id)) ?
                                                <button className="secondary-content btn-small waves-effect waves-light #1976d2 blue darken-1"
                                                    onClick={() => followUser(item._id)}>
                                                    Follow</button>
                                                :
                                                <button className="secondary-content btn-small waves-effect waves-light #ef5350 red lighten-1"
                                                    onClick={() => unfollowUser(item._id)}>
                                                    Unfollow</button>
                                    }
                                </li>

                            })
                            : null}
                    </ul>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close btn-flat">Close</a>
                </div>
            </div>

            <div id="followingModal" className="modal modal-fixed-footer small-modal">
                <div className="modal-content">
                    <h4 className="styled-title">Following</h4>

                    <ul className="collection">
                        {state && state.following.length > 0 ?
                            state.following.map((item) => {
                                return <li key={item._id} className="collection-item avatar">
                                    <Link to={item._id == state._id ? "/profile" : `/profile/${item.username}`}>
                                        <img src={item.profPic} alt="" className="circle" />
                                        <h6 style={{ fontWeight: "500" }} className="title">{item.username}</h6>
                                    </Link>

                                    {
                                        state._id === item._id ?
                                            null :
                                            !state.following || (state.following && !state.following.some(user => user._id === item._id)) ?
                                                <button className="secondary-content btn-small waves-effect waves-light #1976d2 blue darken-1"
                                                    onClick={() => followUser(item._id)}>
                                                    Follow</button>
                                                :
                                                <button className="secondary-content btn-small waves-effect waves-light #ef5350 red lighten-1"
                                                    onClick={() => unfollowUser(item._id)}>
                                                    Unfollow</button>
                                    }
                                </li>
                            })
                            : null}
                    </ul>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close btn-flat">Close</a>
                </div>
            </div>

            <div id="updateProfPicModal" className="modal modal-fixed-footer small-modal">
                {state ?
                    <>

                        <div className="modal-content">
                            <h4 className='styled-title'>Update Profile Pic</h4>

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {
                                    !image ? <img className="upload-profPic"
                                        src={state.profPic} />
                                        :
                                        <img className="upload-profPic"
                                            src={image ? URL.createObjectURL(image) : null}></img>
                                }
                            </div>

                            <div className="file-field input-field">
                                <div className="btn waves-effect waves-light #1976d2 blue darken-1">
                                    <span>Upload Pic</span>
                                    <input type="file" accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="No Image" disabled />
                                </div>

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                                        onClick={() => updateProfPic()}>
                                        Update Profile Pic</button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="modal-close btn-flat">Close</a>
                        </div>
                    </>

                    : "Loading..."}
            </div>


            <div id="updateProfAudioModal" className="modal modal-fixed-footer small-modal">
                {state ?
                    <>

                        <div className="modal-content">
                            <h4 className='styled-title'>Update Profile Audio</h4>

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {
                                    !audio ? <></>
                                        :
                                        <audio controls>
                                            <source src={audio ? URL.createObjectURL(audio) : null} />
                                        </audio>
                                }
                            </div>

                            <div className="file-field input-field">
                                <div className="btn waves-effect waves-light #1976d2 blue darken-1">
                                    <span>Upload Audio</span>
                                    <input type="file" accept="audio/*"
                                        onChange={(e) => setAudio(e.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="No Audio" disabled />
                                </div>

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                                        onClick={() => updateProfAudio()}>
                                        Update Profile Audio</button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="modal-close btn-flat">Close</a>
                        </div>
                    </>

                    : "Loading..."}
            </div>

            <div id="updateProfCoverModal" className="modal modal-fixed-footer small-modal">
                {state ?
                    <>
                        <div className="modal-content">
                            <h4 className='styled-title'>Update Profile Cover</h4>

                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {
                                    !cover ? <img className="upload-profCover" src={state.profCoverPic} />
                                        : <img className="upload-profCover" src={cover ? URL.createObjectURL(cover) : null}></img>
                                }
                            </div>

                            <div className="file-field input-field">
                                <div className="btn waves-effect waves-light #1976d2 blue darken-1">
                                    <span>Upload Cover</span>
                                    <input type="file" accept="image/*"
                                        onChange={(e) => setCover(e.target.files[0])} />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" placeholder="No Image" disabled />
                                </div>

                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                                        onClick={() => updateCoverPic()}>
                                        Update Profile Cover</button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <a href="#!" className="modal-close btn-flat">Close</a>
                        </div>
                    </>

                    : "Loading..."}
            </div>


            {profilePosts && state ?
                <>
                    <div className="row" style={{ margin: "15px auto" }}>
                        <div className="col s3">
                            <a className="modal-trigger" href="#updateProfPicModal">
                                <img className="upload-profPic"
                                    src={state ? state.profPic : "Loading..."} />
                            </a>
                        </div>

                        <div className="col s9"
                            style={{ display: "inline-grid", justifyContent: "center" }}>
                            <h4 className="styled-title" style={{ fontSize: "2em" }}>
                                {state ? state.username : "Loading..."}</h4>

                            <div>
                                {
                                    state && state.profAudio ?
                                        isAudioPlaying ?
                                            <a className="btn-floating btn-large waves-effect waves-light #1976d2 blue darken-1"
                                                onClick={() => pauseAudio()}
                                                style={{ width: "40px", height: "40px" }}>
                                                <i className="material-icons" style={{ lineHeight: "40px" }}>pause</i></a>
                                            :
                                            <a className="btn-floating btn-large waves-effect waves-light #1976d2 blue darken-1"
                                                onClick={() => startAudio()}
                                                style={{ width: "40px", height: "40px" }}>
                                                <i className="material-icons" style={{ lineHeight: "40px" }}>play_arrow</i></a>
                                        :
                                        <></>
                                }

                                <a className="btn-floating btn-large waves-effect waves-light #1976d2 blue darken-1 modal-trigger"
                                    href="#updateProfAudioModal"
                                    style={{ width: "40px", height: "40px", marginLeft: "10px" }}>
                                    <i className="material-icons" style={{ lineHeight: "40px" }}>music_note</i>
                                </a>

                                <a className="btn-floating btn-large waves-effect waves-light #1976d2 blue darken-1 modal-trigger" 
                                    href="#highlightedStoriesModal"
                                    style={{ width: "40px", height: "40px", marginLeft: "10px" }}>
                                    <i className="material-icons" style={{ lineHeight: "40px" }}>stars</i>
                                </a>

                            </div>
                        </div>
                    </div>


                    <div className="row" style={{ border: "solid lightgrey", borderWidth: "1px 0px", padding: "20px" }}>
                        <div className="col s4" style={{ textAlign: "center" }}>
                            <span style={{ fontWeight: "500" }}>{profilePosts.length}</span> posts
                        </div>

                        <div className="col s4" style={{ textAlign: "center" }}>
                            <a className="modal-trigger" href="#followersModal">
                                <span style={{ fontWeight: "500" }}>{state.followers ? state.followers.length : "0"}</span> followers
                            </a>
                        </div>

                        <div className="col s4" style={{ textAlign: "center" }}>
                            <a className="modal-trigger" href="#followingModal">
                                <span style={{ fontWeight: "500" }}>{state.following ? state.following.length : "0"}</span> following
                            </a>
                        </div>
                    </div>

                    {
                        profilePosts.length > 0 ?
                            <div className="gallery">
                                {profilePosts.map((item) => {
                                    return (
                                        <div className="gallery-item" key={item._id}>
                                            <Link to={`/post/${item._id}`}>
                                                {
                                                    item.photos[0].substring(item.photos[0].lastIndexOf('.') + 1, item.photos[0].length).match(/(jpg|jpeg|png|gif)$/i) ?
                                                        <img src={item.photos[0]} />
                                                        : <video onTouchEnd={() => history.push(`/post/${item._id}`)}
                                                            style={{ backgroundColor: "black" }} width="200" height="200" src={`${item.photos[0]}#t=0.1`} preload="metadata" />
                                                }


                                                {
                                                    item.photos.length > 1 &&
                                                    <div className="gallery-ind">
                                                        <i className="material-icons">collections</i>
                                                    </div>
                                                }
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                            : <h5 style={{ display: "flex", justifyContent: "center", color: "gray", margin: "50px" }}>No posts on profile!</h5>}
                </>
                :
                <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                    <PreLoader />
                </div>}
        </div>
    )
}

export default Profile