import { Readable } from 'stream';
import { Storage } from '@google-cloud/storage';
import { UploadHandler } from '@remix-run/node';

const uploadStreamToCloudStorage = async (fileStream: Readable, fileName: string) => {
  const bucketName = 'YOUR_BUCKET_NAME';

  // Create Cloud Storage client
  const cloudStorage = new Storage();

  // Create a reference to the file.
  const file = cloudStorage.bucket(bucketName).file(fileName);

  async function streamFileUpload() {
    fileStream.pipe(file.createWriteStream()).on('finish', () => {
      // The file upload is complete
    });

    console.log(`${fileName} uploaded to ${bucketName}`);
  }

  streamFileUpload().catch(console.error);

  return fileName;
};

export const cloudStorageUploaderHandler: UploadHandler = async ({
  filename,
  stream: fileStream,
}) => {
  return await uploadStreamToCloudStorage(fileStream, filename);
};