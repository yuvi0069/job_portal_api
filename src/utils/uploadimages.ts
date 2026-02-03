import dotenv from "dotenv";
import * as stream from "stream";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadImageToS3 = async (
  fileStream: stream.Readable,
  folder: string,
  originalname: string,
  mimetype: string
): Promise<string | undefined> => {
  if (!fileStream) {
    console.log("No file");
    return "no";
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `${folder}/${originalname}`,
    Body: fileStream,
    ContentType: mimetype,
  };

  try {
    const upload = new Upload({
      client: s3,
      params: params,
      leavePartsOnError: false,
    });

    const uploadResult = await upload.done();

    return uploadResult.Location;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Error uploading image to S3");
  }
};
export const deleteFileFromS3 = async (fileUrl: string): Promise<boolean> => {
  if (!fileUrl) {
    console.log("No URL provided");
    return false;
  }

  const regex = /^https:\/\/([^\/]+)\/(.*)$/; // Regex to match the structure of the S3 URL
  const match = fileUrl.match(regex);
  let fileKey;
  if (match && match[2]) {
    // Return the file key (after the bucket name)
    fileKey = match[2];
  } else {
    return false;
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
  };

  try {
    const deleteCommand = new DeleteObjectCommand(params);
    await s3.send(deleteCommand);
    console.log("File deleted successfully from S3");
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return false;
  }
};
