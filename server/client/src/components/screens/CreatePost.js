import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import PreLoader from '../Preloader';
import CameraPhoto from '../CameraPhoto';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const CreatePost = () => {
    const history = useHistory();
    const [caption, setCaption] = useState("");
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState();
    const [loading, setLoading] = useState(false);
    const [takenPhoto, setTakenPhoto] = useState();
    const [isCameraOpen,setIsCameraOpen]=useState(false);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems, {});
    }, [])

    const addImage = (e) => {
        setImages([...images, ...e.target.files]);
    }

    const postDetails = async () => {
        setLoading(true);
        const copyUrls = [];

        for (let im of images) {
            const data = new FormData();
            data.append("file", im);
            data.append("upload_preset", "phongstagram");
            data.append("cloud_name", "phongcloudinary");
            let cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/phongcloudinary/upload", {
                method: "post",
                body: data
            });
            let fetchedData = await cloudinaryRes.json();
            copyUrls.push(fetchedData.url);
        }
        console.log("photos array", copyUrls);
        setUrls(copyUrls);
    }

    const removeImage = (im) => {
        if (im.name) {
            const newImages = images.filter(image => image.name != im.name);
            setImages(newImages);
        }
        else {
            const newImages = images.filter(image => image != im);
            setImages(newImages);
        }
    }

    useEffect(() => {
        if (urls) {
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    caption,
                    photos: urls,
                    location: location
                })
            })
                .then(res => res.json())
                .then(data => {
                    setLoading(false);
                    console.log(data);
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-1" });
                    }
                    else {
                        M.toast({ html: "Created Post Successfully!", classes: "#43a047 green darken-1" });
                        history.push('/');
                    }
                }).catch(err => {
                    console.log(err);
                })
        }

    }, [urls])

    const updateTakenPhoto = (takenPhoto) => {
        setTakenPhoto(takenPhoto);
    }

    const addTakenPhoto = () => {
        if (takenPhoto) {
            setImages([...images, takenPhoto]);
        }
        else {
            M.toast({ html: "Photo not yet taken!", classes: "#c62828 red darken-1" });
        }
    }

    return (
        <>
            <div id="CameraPhotoModal" className="modal modal-fixed-footer fullscreen-modal">
                <div className="modal-content">
                    <h4 className='styled-title' style={{ textAlign: "left" }}>Take Photo</h4>
                    <CameraPhoto isCameraOpen={isCameraOpen} setIsCameraOpen={setIsCameraOpen} takenPhoto={takenPhoto} updateTakenPhoto={updateTakenPhoto}></CameraPhoto>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="btn-flat" onClick={() => addTakenPhoto()}>Upload Photo</a>
                    <a href="#!" className="modal-close btn-flat">Close</a>
                </div>
            </div>

            <div className="card input-field"
                style={{
                    margin: "30px auto",
                    maxWidth: "500px",
                    padding: "20px",
                    textAlign: "center"
                }}>

                <input type="text" placeholder="caption"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                />

                <GooglePlacesAutocomplete 
                    selectProps={{
                        placeholder: 'Location (optional)',
                        location,
                        onChange: setLocation,
                        isClearable: true                     
                      }}
                />

                <div className="card-image" style={{ padding: "20px" }}>
                    {
                        images.length === 0 ? <img className="upload-img" src="https://www.worldloppet.com/wp-content/uploads/2018/10/no-img-placeholder.png" />
                            :
                            images.map((im, i) =>
                                !im.name ?
                                    //taken photo
                                    <div key={i} style={{ position: "relative" }}>
                                        <img className="upload-img"
                                            src={images.length > 0 ? im : null}></img>
                                        <a className="btn-floating red" style={{ position: "absolute", right: "0px", top: "0px", zIndex: "1", cursor: "pointer" }}>
                                            <i className="small material-icons col s2" onClick={() => removeImage(im)}>delete</i></a>
                                    </div>
                                    :
                                    //uploaded photo
                                    im.name.substring(im.name.lastIndexOf('.') + 1, im.name.length).match(/(jpg|jpeg|png|gif)$/i) ?
                                        <div key={i} style={{ position: "relative" }}>
                                            <img className="upload-img"
                                                src={images.length > 0 ? URL.createObjectURL(im) : null}></img>
                                            <a className="btn-floating red" style={{ position: "absolute", right: "0px", top: "0px", zIndex: "1", cursor: "pointer" }}>
                                                <i className="small material-icons col s2" onClick={() => removeImage(im)}>delete</i></a>
                                        </div>
                                        :
                                        //uploaded video
                                        <div key={i} style={{ position: "relative" }}>
                                            <video className="upload-img" frameBorder="0" controls
                                                src={images.length > 0 ? URL.createObjectURL(im) : null}></video>
                                            <a className="btn-floating red" style={{ position: "absolute", right: "0px", top: "0px", zIndex: "1", cursor: "pointer" }}>
                                                <i className="small material-icons col s2" onClick={() => removeImage(im)}>delete</i></a>
                                        </div>)
                    }
                </div>

                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #1976d2 blue darken-1">
                        <span>Upload Image(s)</span>
                        <input type="file" accept="image/jpg,image/jpeg,image/png,image/gif,video/mp4" multiple
                            onChange={(e) => addImage(e)} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="No Image" disabled />
                    </div>
                </div>

                <div style={{ margin: "20px" }}>
                    <button className="btn waves-effect waves-light #1976d2 blue darken-1 modal-trigger" 
                    data-target="CameraPhotoModal"
                    onClick={()=>{setIsCameraOpen(true)}}
                    >Take Photo</button>
                </div>

                <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                    onClick={() => postDetails()}
                >
                    Submit Post
                </button>

                {loading ?
                    <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                        <PreLoader></PreLoader>
                    </div>
                    : null}

            </div>
        </>
    )
}

export default CreatePost