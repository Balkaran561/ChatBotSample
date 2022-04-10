import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

const CameraPhoto = ({isCameraOpen,setIsCameraOpen,takenPhoto,updateTakenPhoto}) => {

    var handleTakePhoto = (dataUri) => {
        updateTakenPhoto(dataUri);
        setIsCameraOpen(false);
    }

    const retakePhoto = () => {
        updateTakenPhoto();
        setIsCameraOpen(true);
    }

    return (
        <div style={{
            margin: "5px auto",
            textAlign: "center"
        }}>
            {
                takenPhoto
                    ?
                    <>
                        <img src={takenPhoto} />

                        <div>
                            <button
                                onClick={() => retakePhoto()}
                                className="btn waves-effect waves-light #1976d2 blue darken-1">Retake Photo</button>
                        </div>
                    </>
                    :
                    isCameraOpen&&
                    <Camera
                        onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                    />
            }

        </div>
    )
}

export default CameraPhoto