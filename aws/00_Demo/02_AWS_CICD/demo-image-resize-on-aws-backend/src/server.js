// Import necessary libraries
import express from 'express';
import bodyParser from 'body-parser';
import sharp from 'sharp';
import cors from 'cors';

const app = express();
const port = 80;

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON bodies with large payloads
app.use(bodyParser.json({ limit: '10mb' }));

// Healthcheck API
app.get('/health', (req, res) => {
    console.log('Healthcheck endpoint hit');
    res.status(200).json({ status: 'Healthy' });
});
// POST API to receive base64 image, resize, and return
app.post('/resize', async (req, res) => {
    try {
        console.log('Received request at /resize endpoint');

        const { imageBase64, width, height } = req.body;
        console.log('Request body:', { width, height });

        // Validate input
        if (!imageBase64 || !width || !height) {
            console.error('Validation error: Missing imageBase64, width, or height');
            return res.status(400).json({ error: 'Missing imageBase64, width, or height in request body.' });
        }

        // Remove the data URI prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        console.log('Decoded buffer size:', buffer.length);

        // Check image format and metadata
        const metadata = await sharp(buffer).metadata();
        console.log('Image metadata:', metadata);

        // Resize the image using sharp
        console.log('Resizing image to width:', width, 'height:', height);
        const resizedBuffer = await sharp(buffer)
            .resize(parseInt(width), parseInt(height))
            .toBuffer();

        console.log('Image resized successfully');

        // Convert the resized image back to base64
        const resizedBase64 = resizedBuffer.toString('base64');
        console.log('Converted resized image back to base64');

        // Send the resized image back as a response
        console.log('Sending response with resized image');
        res.json({
            resizedImageBase64: resizedBase64,
            comment: "Hello, This is Version 2"
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process the image. Please check your input.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});