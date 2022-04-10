import React from "react";

const FilePreview = ({ file, existingFile, removeFile }) => {
  const isImgaeFormat = (fileName) =>
    fileName
      .substring(fileName.lastIndexOf(".") + 1, fileName.length)
      .match(/(jpg|jpeg|png|gif)$/i);

  if (!file && !existingFile)
    return (
      <img
        className="upload-img"
        src="https://www.worldloppet.com/wp-content/uploads/2018/10/no-img-placeholder.png"
      />
    );
  let fileName;
  let fileUrl;
  if (existingFile) {
    fileName = existingFile;
    fileUrl = existingFile;
  } else {
    fileName = file.name;
    fileUrl = URL.createObjectURL(file);
  }
  return isImgaeFormat(fileName) ? (
    <div style={{ position: "relative" }}>
      <img className="upload-img" src={fileUrl}></img>
      {
        <a
          className="btn-floating red"
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            zIndex: "1",
            cursor: "pointer",
          }}
        >
          <i className="small material-icons col s2" onClick={removeFile}>
            delete
          </i>
        </a>
      }
    </div>
  ) : (
    <div style={{ position: "relative" }}>
      <video
        className="upload-img"
        frameBorder="0"
        controls
        src={fileUrl}
      ></video>
      {
        <a
          className="btn-floating red"
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            zIndex: "1",
            cursor: "pointer",
          }}
        >
          <i className="small material-icons col s2" onClick={removeFile}>
            delete
          </i>
        </a>
      }
    </div>
  );
};

export default FilePreview;
