//Library
import s3 from "react-aws-s3";

const config = {
  bucketName: process.env.REACT_APP_BUCKET_NAME,
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
};

export const uploadFileS3bucket = (file) => {
  const s3Client = new s3(config);
    console.log(file)
  s3Client.uploadFile(file, file.name.replace(/\..+$/, "")).then((data) => {
    console.log(data);
    if (data === 204) {
      console.log("success");
    } else {
      console.log("fail");
    }
  });
};
