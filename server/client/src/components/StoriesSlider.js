import React, { useEffect } from 'react';
import M from 'materialize-css';
import { Link } from 'react-router-dom';

const StoriesSlider = ({ deleteStory,currentStories, currentStoryUser, state }) => {

    useEffect(
        () => {
            var options = {
                fullWidth: true,
                indicators: true
            };
            var carousel = document.querySelectorAll('.carousel');
            M.Carousel.init(carousel, options);
        }, [currentStoryUser]
    )

    const chevronRight = () => {
        var elems = document.getElementById(`story-carousel-${currentStoryUser._id}`);
        var moveRight = M.Carousel.getInstance(elems);
        moveRight.next(1);
    }

    const chevronLeft = () => {
        var elems = document.getElementById(`story-carousel-${currentStoryUser._id}`);
        var moveLeft = M.Carousel.getInstance(elems);
        moveLeft.prev(1);
    }

    return (
        <div id={`story-carousel-${currentStoryUser._id}`} className="carousel carousel-slider" style={{ display: "inline-block" }}>

            {
                currentStories.length > 1 &&
                <div className="carousel-fixed-item center middle-indicator">
                    <div className="left">
                        <a href="#!" onClick={() => chevronLeft()} className="middle-indicator-text waves-effect waves-light content-indicator"><i
                            className="material-icons left  middle-indicator-text">chevron_left</i></a>
                    </div>

                    <div className="right">
                        <a href="#!" onClick={() => chevronRight()} className="middle-indicator-text waves-effect waves-light content-indicator"><i
                            className="material-icons right middle-indicator-text">chevron_right</i></a>
                    </div>
                </div>
            }

            {
                currentStories.map((story, index) => {
                    return (
                        <div className="carousel-item" key={story._id}>
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title">
                                        {currentStoryUser.username}
                                        <i className="material-icons right activator" style={{ cursor: "pointer" }}>more_vert</i></span>
                                    <p className="card-title" style={{ paddingBottom: "13px", fontSize: "0.8em" }}>{new Date(story.createdAt).toLocaleString()}</p>
                                    <div className="card-image" style={{height:"200px"}}>
                                        {
                                            story.file.substring(story.file.lastIndexOf('.') + 1, story.file.length).match(/(jpg|jpeg|png|gif)$/i) ?
                                                <img src={story.file} style={{height:"100%",objectFit:"cover"}} />
                                                : <video className="responsive-video" src={story.file} frameBorder="0" controls style={{height:"100%",objectFit:"cover"}}/>
                                        }
                                    </div>
                                </div>

                                <div className="card-reveal">
                                    <span className="card-title">Options<i className="material-icons right">close</i></span>


                                    <div className="collection">
                                        {/* <Link to={`/story/${story._id}`} className="collection-item">View Story</Link> */}
                                        {story.postedBy._id == state._id &&
                                            <div>
                                                <Link to={`/editstory/${story._id}`} className="collection-item">Edit Story</Link>
                                                <a href="#!" className="collection-item red-text" onClick={() => deleteStory(story._id)}>Delete Story</a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default StoriesSlider