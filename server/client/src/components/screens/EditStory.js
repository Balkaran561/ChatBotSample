import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import M from 'materialize-css';
import FileUploader, { uploadFileToCloudinary } from '../FileUploader';

const EditStory = () => {
    const history = useHistory();
    const [file, setFile] = useState(null);
    const [existingFile, setExistingFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const { storyId } = useParams();
    const fileInput = useRef();

    const uploadFile = (e) => {
        setFile(e.target.files[0]);
        setExistingFile(null);
    }
    const removeFile = () => {
        fileInput.current.value = ""; // to allow upload the same file that user removed
        setFile(null)
        setExistingFile(null);
    }

    const editStory = async () => {
        setLoading(true);
        const fileUrl = await uploadFileToCloudinary(file);
        fetch(`/editstory/${storyId}`, {
            method: "put",
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
                    M.toast({ html: "Edited Story Successfully!", classes: "#43a047 green darken-1" });
                    history.push('/');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    
    useEffect(()=>{
        fetch(`/story/${storyId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setExistingFile(result.story.file);
            })
    },[])

    return <FileUploader
        file={file}
        existingFile={existingFile}
        removeFile={removeFile}
        fileInputRef={fileInput}
        uploadFile={uploadFile}
        submitButtonLabel="Edit Story"
        submit={editStory}
        loading={loading}
    />
}

export default EditStory