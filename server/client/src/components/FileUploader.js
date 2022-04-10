import React from 'react';
import FilePreview from './FilePreview';
import PreLoader from './Preloader';

export const uploadFileToCloudinary = async (file, url="https://api.cloudinary.com/v1_1/phongcloudinary/upload") => {
    const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "phongstagram");
        data.append("cloud_name", "phongcloudinary");
        let cloudinaryRes = await fetch(url, {
            method: "post",
            body: data
        });
        let fetchedData = await cloudinaryRes.json();      
        return fetchedData.url;
}

const FileUploader = (
    {   
        file,
        existingFile,
        removeFile,
        fileInputRef,
        uploadFile,
        submitButtonLabel,
        submit,
        loading
    }) => {
    return <div className="card input-field"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"
            }}>

            <div className="card-image" style={{ padding: "20px" }}>
                <FilePreview file={file} existingFile={existingFile} removeFile={removeFile}/>
            </div>
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #1976d2 blue darken-1">
                    <span>Upload Image/Video</span>
                    <input type="file" accept="image/jpg,image/jpeg,image/png,image/gif,video/mp4,video/mp3" 
                        ref={fileInputRef} onChange={uploadFile} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="No Image" disabled />
                </div>
            </div>
            <button className="btn waves-effect waves-light #1976d2 blue darken-1"
                onClick={submit}
            >
                {submitButtonLabel}
            </button>

            {
                loading && <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
                        <PreLoader/>
                </div>
            }

        </div>
}

export default FileUploader;