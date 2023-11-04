// Import the `Model` class from the "sequelize" library
const { Model } = require("sequelize");

// Import the "aws-sdk" library
const AWS = require("aws-sdk");

// Define a function named "uploadToS3" that takes "data" and "filename" as parameters
const uploadToS3 = (data, filename) => {
  // Retrieve the S3 bucket name from an environment variable
  const BUCKET_NAME = process.env.BUCKET_NAME;

  // Retrieve the AWS IAM user's access key from an environment variable
  const IM_USER_KEY = process.env.IM_USER_KEY;

  // Retrieve the AWS IAM user's secret access key from an environment variable
  const IM_USER_SECRET = process.env.IM_USER_SECRET;

  // Create a new instance of the AWS S3 service using the IAM user's credentials
  let s3bucket = new AWS.S3({
    accessKeyId: IM_USER_KEY,
    secretAccessKey: IM_USER_SECRET,
  });

  // Define the parameters for uploading the file to S3
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename, // The name of the file in the S3 bucket
    Body: data, // The data/content of the file
    ACL: "public-read", // Set the access control to "public-read" (can be accessed publicly)
  };

  // Return a Promise that resolves or rejects based on the S3 upload operation
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        // If there's an error during upload, log the error and reject the Promise
        console.log("something went wrong", err);
        reject(err);
      } else {
        // If the upload is successful, log the success and resolve the Promise with the S3 response
        console.log("success", s3response);
        resolve(s3response);
      }
    });
  });
};

// Export the "uploadToS3" function so it can be used in other parts of the application
module.exports = {
  uploadToS3,
};

