import AWS from "aws-sdk";


const s3 = new AWS.S3({
  region: "eu-central-1",
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESSKEY,
});

export const S3MediaSender = async (fileInput:File) => {
  const params = {
    Bucket: "chatappv2/",
    Key: fileInput.name,
    Body: fileInput,
    ACL: "public-read",
  };

  const dataS3 = await s3.upload(params).promise();

  return dataS3.Location;
};
