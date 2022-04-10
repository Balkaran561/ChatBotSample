import React, { useState, useEffect, useContext } from 'react';
import CarouselSlider from '../CarouselSlider';
import HomePostOptions from '../HomePostOptions';
import PreLoader from '../Preloader';
import { UserContext } from '../../App';
import M from 'materialize-css';
import CommentsModal from '../CommentsModal';
import LikesModal from '../LikesModal';
import { Link } from 'react-router-dom';
import StoriesSlider from '../../components/StoriesSlider';
import ReportPostModal from '../ReportPostModal';

const Home = () => {
    const [data, setData] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(4);
    const [postsSize, setPostsSize] = useState(0);
    const [likedPostLoading, setLikedPostLoading] = useState(null);

    const [stories, setStories] = useState([]);
    const [storyPosters, setStoryPosters] = useState([]);
    const [currentStoryUser, setCurrentStoryUser]=useState();
    const [currentStories, setCurrentStories]=useState([]);
    const [storiesLoading, setStoriesLoading]=useState(false);

    useEffect(() => {
        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals, {});
    }, [])

    useEffect(() => {
        setDataLoading(true);
        setStoriesLoading(true);
        getPosts({ skip, limit });
        getStories();
    }, [])

    const getStories = () => {
        fetch('/getsubstories', {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setStories([...stories, ...result.stories]);

                const allStoryPostedByUsers = result.stories.map(story => story.postedBy);
                const uniqueStoryPostedByUsers = Array.from(
                    new Set(allStoryPostedByUsers.map(user => user._id)
                    ))
                    .map(_id => {
                        return {
                            _id,
                            username: allStoryPostedByUsers.find(story => story._id === _id).username,
                            profPic: allStoryPostedByUsers.find(story => story._id === _id).profPic
                        }
                    });

                setStoryPosters([...storyPosters, ...uniqueStoryPostedByUsers]);
                setStoriesLoading(false);
            })
    }

    const getPosts = (variables) => {
        fetch('/getsubposts', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                skip: variables.skip,
                limit: variables.limit
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                setData([...data, ...result.posts]);
                setPostsSize(result.postsSize);
                setDataLoading(false);
            })
    }

    const onLoadMore = () => {
        let newSkip = skip + limit;
        getPosts({ skip: newSkip, limit });
        setSkip(newSkip);
    }

    const likePost = (id) => {
        setLikedPostLoading(id);
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
                console.log(newData);
                setLikedPostLoading(null);
            }).catch(err => console.log(err))
    }

    const unlikePost = (id) => {
        setLikedPostLoading(id);
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
                setLikedPostLoading(null);
            }).catch(err => console.log(err))
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);

                var commentinput = document.getElementsByClassName(`cominput-${postId}`)[0];
                commentinput.value = "";
                commentinput.blur();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.filter(item => {
                    return item._id !== result._id;
                })
                setData(newData);
                M.toast({ html: "Deleted Post Successfully!", classes: "#43a047 green darken-1" });
            })
    }

    const deleteComment = (postId, commentId) => {

        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                });
                setData(newData);
            });
    };

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

    const deleteStory = (storyId) => {
        fetch(`/deletestory/${storyId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);

                if(stories.filter(story=>story.postedBy._id===result.postedBy._id).length===1){
                    const newStoryPosters=storyPosters.filter(user=>{
                        return user._id!=result.postedBy._id;
                    }) 
                    setStoryPosters(newStoryPosters);
                }

                const newStories = stories.filter(story => {
                    return story._id !== result._id;
                })

                const newCurrentStories = currentStories.filter(story => {
                    return story._id !== result._id;
                })

                setStories(newStories);
                setCurrentStories(newCurrentStories);
                                
                M.toast({ html: "Deleted Story Successfully!", classes: "#43a047 green darken-1" });
            })
    }

    return (

        <div className="home">
            <ReportPostModal />
            
            <div id="storiesByUserModal" className="modal modal-fixed-footer story-modal">
                <div className="modal-content">
                    {
                        state && currentStoryUser && currentStories && currentStories.length > 0 ?
                            <StoriesSlider deleteStory={deleteStory} currentStories={currentStories} currentStoryUser={currentStoryUser} state={state}/>
                            :
                            <></>
                    }
                </div>
                <div className="modal-footer">
                    <a className="modal-close btn-flat">Close</a>
                </div>
            </div>

            {
                storiesLoading?
                <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                    <PreLoader />
                </div>
                :
                storyPosters && storyPosters.length > 0 &&
                <div className="card home-card story-pane" style={{ overflowX: "scroll" }}>
                    <div className="card-content" style={{ display: "flex" }}>
                        {
                            storyPosters.map((storyposter) => {
                                return (
                                    <a key={storyposter._id} className="modal-trigger" data-target="storiesByUserModal" 
                                    onClick={()=>{
                                        setCurrentStoryUser(storyposter);
                                        setCurrentStories(stories.filter(story=>story.postedBy._id===storyposter._id));
                                    }}
                                    href="#!">
                                        <img className="story-profPic" src={storyposter.profPic} />
                                    </a>
                                )
                            })
                        }
                    </div>
                </div>
            }

            {
                dataLoading?
                <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                    <PreLoader />
                </div>
                :
                data && data.length > 0 ?
                    <>
                        {data.map(item => {
                            return (
                                <div className="card home-card" key={item._id}>
                                    <div className="card-content">
                                        <span className="card-title">
                                            <Link to={item.postedBy._id == state._id ? "/profile" : `/profile/${item.postedBy.username}`}>
                                                <img className="small-profPic" src={item.postedBy.profPic} />
                                                {item.postedBy.username}</Link>
                                            <i className="material-icons right activator" style={{ cursor: "pointer" }}>more_vert</i></span>

                                        <p className="grey-text" style={{ paddingBottom: "13px", fontSize: "0.8em" }}>
                                        <i className="material-icons" style={{fontSize: "1.2em", verticalAlign:"text-bottom", paddingRight:"5px" }}>access_time</i>
                                            {new Date(item.createdAt).toLocaleString()}</p>
                                        {
                                            item.location &&
                                            <p className="grey-text" style={{ paddingBottom: "13px", fontSize: "0.8em" }}>
                                                <i className="material-icons" style={{fontSize: "1.2em",verticalAlign:"text-bottom", paddingRight:"5px" }}>location_on</i>
                                                {item.location.label}</p>
                                        }
                                        
                                        <CarouselSlider item={item} />

                                        {
                                            likedPostLoading === item._id ?
                                                <div className="preloader-wrapper small active" style={{ width: "24px", height: "24px" }}>
                                                    <div className="spinner-layer spinner-blue-only">
                                                        <div className="circle-clipper left">
                                                            <div className="circle"></div>
                                                        </div><div className="gap-patch">
                                                            <div className="circle"></div>
                                                        </div><div className="circle-clipper right">
                                                            <div className="circle"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                item.likes.find(record => record._id === state._id)
                                                    ? <i className="material-icons"
                                                        style={{ color: "red", cursor: "pointer" }}
                                                        onClick={() => { unlikePost(item._id) }}
                                                    >favorite</i>
                                                    : <i className="material-icons"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => { likePost(item._id) }}
                                                    >favorite_border</i>
                                        }

                                        <LikesModal item={item} state={state} followUser={followUser} unfollowUser={unfollowUser} />

                                        <p><span style={{ fontWeight: "500" }}>{item.postedBy.username}</span> {item.caption}</p>

                                        {item.comments.length > 0
                                            ?
                                            <div><CommentsModal item={item} state={state} deleteComment={deleteComment} />
                                                <p style={{ textOverflow: "ellipsis", overflow: "hidden" }}><span style={{ fontWeight: "500", paddingRight: "3px" }}>{item.comments[item.comments.length - 1].postedBy.username}</span>{item.comments[item.comments.length - 1].text}</p></div>
                                            : null
                                        }


                                        <textarea type="text" placeholder="Add a comment" className={`cominput-${item._id} stylized-input`}
                                            onKeyDown={e => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    makeComment(e.target.value, item._id);
                                                }
                                            }}
                                        />


                                    </div>
                                    <div className="card-reveal">
                                        <span className="card-title">Options<i className="material-icons right">close</i></span>
                                        <HomePostOptions item={item} state={state} deletePost={deletePost} followUser={followUser} unfollowUser={unfollowUser} />
                                    </div>
                                </div>
                            )
                        })}
                        {postsSize >= limit &&
                            <div style={{ margin: "30px auto", width: "fit-content" }}>
                                <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                                    onClick={() => onLoadMore()}>
                                    Load More
                                </button>
                            </div>}
                    </>
                    : <h5 style={{ display: "flex", justifyContent: "center", color: "gray", margin: "50px" }}>No posts on your feed!</h5>
            }
        </div>
    )
}

export default Home