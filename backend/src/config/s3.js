const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    // Si se configuran credenciales en el .env (desarrollo local), las usamos.
    // De lo contrario, en EC2, el SDK detectará automáticamente el IAM Role.
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    } : undefined
});

module.exports = s3;
