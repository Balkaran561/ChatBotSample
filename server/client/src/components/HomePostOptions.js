import React, { useContext } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const HomePostOptions = ({
  item,
  state,
  deletePost,
  followUser,
  unfollowUser,
}) => {
  const { dispatch } = useContext(UserContext);

  const onMouseOver = (event) => {
    console.log("tests");
    const el = event.target;
    let colorhex = [
      "#7AF377",
      "#3498DB",
      "#F1C530",
      "#F29C29",
      "#8E44AD",
      "#4AA086",
      "#E74C3C",
      "#65CC71",
      "#D3541B",
      "#EB4367",
      "#74F7D9",
      "#DDA8FC",
    ];
    el.style.backgroundColor = colorhex[Math.floor(Math.random() * 12)];
  };

  const onMouseOut = (event) => {
    console.log("mkkm");
    const el = event.target;
    let white = "#ffffff";
    el.style.backgroundColor = white;
  };

  return (
    <div className="collection">
      <Link
        to={`/post/${item._id}`}
        className="collection-item"
        onMouseEnter={(event) => onMouseOver(event)}
        onMouseOut={(event) => onMouseOut(event)}
      >
        View Post
      </Link>
      {item.postedBy._id == state._id ? (
        <div>
          <Link
            to={`/profile`}
            className="collection-item"
            onMouseEnter={(event) => onMouseOver(event)}
            onMouseOut={(event) => onMouseOut(event)}
          >
            View Profile test
          </Link>
          <Link to={`/editpost/${item._id}`} className="collection-item">
            Edit Post
          </Link>
          <a
            href="#!"
            className="collection-item red-text"
            onClick={() => deletePost(item._id)}
          >
            Delete Post
          </a>
        </div>
      ) : (
        <div>
          <Link
            to={
              state.username === item.postedBy.username
                ? "/profile"
                : `/profile/${item.postedBy.username}`
            }
            className="collection-item"
            onMouseEnter={(event) => onMouseOver(event)}
            onMouseOut={(event) => onMouseOut(event)}
          >
            View Profile
          </Link>
          {!state.following ||
          (state.following &&
            !state.following.some((user) => user._id === item.postedBy._id)) ? (
            <a
              href="#!"
              className="collection-item blue-text"
              onClick={() => followUser(item.postedBy._id)}
              onMouseEnter={(event) => onMouseOver(event)}
              onMouseOut={(event) => onMouseOut(event)}
            >
              Follow
            </a>
          ) : (
            <a
              href="#!"
              className="collection-item red-text"
              onClick={() => unfollowUser(item.postedBy._id)}
              onMouseEnter={(event) => onMouseOver(event)}
              onMouseOut={(event) => onMouseOut(event)}
            >
              Unfollow
            </a>
          )}
          <a
            className="collection-item red-text modal-trigger"
            href="#reportPostModal"
            onClick={() => {
              dispatch({
                type: "UPDATECURRENTREPORTPOSTID",
                payload: item._id,
              });
            }}
            onMouseEnter={(event) => onMouseOver(event)}
            onMouseOut={(event) => onMouseOut(event)}
          >
            Report Post
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePostOptions;
