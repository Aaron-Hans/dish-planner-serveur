import AWS from 'aws-sdk';

// Configuration AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const mimeTypes: { [key: string]: string } = {
  "jpg": "image/jpeg",
  "jpeg": "image/jpeg",
  "png": "image/png",
};

/**
 * Upload un fichier sur Amazon S3 depuis un Buffer (Form)
 * @param fileBuffer - Contenu du fichier sous forme de Buffer
 * @param folder - Dossier cible dans le bucket (ex: "products" ou "recipes")
 * @param fileName - Nom du fichier sur S3 (optionnel, sinon auto-généré)
 * @returns URL du fichier uploadé sur S3
 */
export const uploadBufferToS3 = async (fileBuffer: Buffer, folder: string, fileName?: string): Promise<string> => {
  try {
    const finalFileName = fileName || `${Date.now()}.jpg`;
    const extension = finalFileName.split('.').pop()?.toLowerCase() || "jpg"; 
    const fileType = mimeTypes[extension] || "image/jpeg"; 

    const key = `images/${folder}/${finalFileName}`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: 'dishplanner-bucket',
      Key: key,
      Body: fileBuffer,
      ContentType: fileType, 
    };

    console.log(`🛠️ Uploading file: ${finalFileName}, Type: ${fileType}`);
    const data = await s3.upload(params).promise();
    console.log(`✅ Fichier uploadé avec succès : ${data.Location}`);
    return data.Location;
  } catch (error) {
    console.error('❌ Erreur lors de l’upload sur S3 :', error);
    throw error;
  }
};
