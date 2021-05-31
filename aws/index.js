import AWS from "aws-sdk";
import { makeid } from "../helpers/functions/index.js";
import awsKeys from "./awsKeys.js";

const { accessKeyId, secretAccessKey } = awsKeys;

const S3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
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
