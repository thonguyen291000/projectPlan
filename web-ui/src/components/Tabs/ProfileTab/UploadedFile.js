import React from "react";
//icons
import file_icon from "../../../assets/icons/file_purple.png";
import image_icon from "../../../assets/icons/image_purple.png";
import video_icon from "../../../assets/icons/video_purple.png";
import download_icon from "../../../assets/icons/download.png";
//Logic
import { fileSizeCal } from "../../../funcs/fileSizeCal";

const UploadedFile = ({ file, index }) => {
  const checkType = () => {
    switch (file.type) {
      case "file":
        return <img src={file_icon} />;
      case "image":
        return <img src={image_icon} />;
      case "video":
        return <img src={video_icon} />;
      default:
        return <></>;
    }
  };

  return (
    <div key={index}>
      <div className="card_content">
        <div className="file_image_video_icon">{checkType()}</div>
        <div className="content">
          <div>
            <h5>{file.filename}</h5>
            <p>{fileSizeCal(file.size)}</p>
          </div>
        </div>
        <a href={file.url} className="action">
          <img src={download_icon} />
        </a>
      </div>
    </div>
  );
};

export default UploadedFile;
