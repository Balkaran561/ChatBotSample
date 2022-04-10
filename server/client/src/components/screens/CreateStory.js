import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import FileUploader, { uploadFileToCloudinary } from '../FileUploader';

const CreateStory = () => {
    const history = useHistory();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInput = useRef();

    const uploadFile = (e) => {
        setFile(e.target.files[0]);
    }
    const removeFile = () => {
        fileInput.current.value = ""; // to allow upload the same file that user removed
        setFile(null)
    }

    const addStory = async () => {
        setLoading(true);     
        const fileUrl = await(uploadFileToCloudinary(file));
        fetch("/createstory", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                file: fileUrl
            })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-1" });
                }
                else {
                    M.toast({ html: "Created Story Successfully!", classes: "#43a047 green darken-1" });
                    history.push('/');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    
    return <FileUploader
        file={file}
        removeFile={removeFile}
        fileInputRef={fileInput}
        uploadFile={uploadFile}
        submitButtonLabel="Create Story"
        submit={addStory}
        loading={loading}
        />
}

export default CreateStory