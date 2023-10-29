const { Model } = require("sequelize");
const AWS = require("aws-sdk");

const uploadToS3= (data, filename) =>{
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IM_USER_KEY = process.env.IM_USER_KEY;
    const IM_USER_SECRET = process.env.IM_USER_SECRET;
    let s3bucket = new AWS.S3({
      accessKeyId: IM_USER_KEY,
      secretAccessKey: IM_USER_SECRET,
    });
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read", 
    };
  
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log("something went wrong", err);
          reject(err);
        } else {
          console.log("success", s3response);
          resolve(s3response);
        }
      });
    });
  }

  module.exports ={
    uploadToS3
  }

