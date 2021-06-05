import AWS from "aws-sdk";
import { makeid } from "../helpers/functions/index.js";

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const getSignedUrl = async (userId, contentType) => {
  try {
    const key = `${userId}/${makeid(10)}.${contentType.slice(6)}`;
    const url = await S3.getSignedUrl("putObject", {
      Bucket: "krowdee-prime-123",
      ContentType: contentType,
      Key: key,
    });

    return { key, url };
  } catch (error) {
    throw error;
  }
  // return url.url
};
