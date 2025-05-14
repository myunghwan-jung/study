// Import necessary libraries
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';

dotenv.config();

const app = express();
const port = 80;

// DynamoDB setup
const dynamoDBClient = new DynamoDBClient({ region: process.env.REGION });
const tableName = process.env.DYNAMODB_TABLE_NAME;

// Enable CORS for all requests
app.use(cors());
app.use(express.json());

// Healthcheck API
app.get('/health', (req, res) => {
    console.log('Healthcheck endpoint hit');
    res.status(200).json({ status: 'Healthy' });
});

// POST endpoint to register a new URL with a shortlink
app.post('/register', async (req, res) => {
    try {
        const { url } = req.body;

        // Validate input
        if (!url) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }

        // Generate a random 5-letter shortlink
        const shortlink = nanoid(5);

        // Save the URL and shortlink to DynamoDB
        await dynamoDBClient.send(new PutItemCommand({
            TableName: tableName,
            Item: {
                url: { S: url },
                shortlink: { S: shortlink }
            }
        }));

        res.status(201).json({ message: 'URL registered successfully', shortlink });
    } catch (error) {
        console.error('Error registering URL:', error);
        res.status(500).json({ error: 'Failed to register URL' });
    }
});

// GET endpoint to redirect to the URL based on the shortlink
app.get('/ln/:shortlink', async (req, res) => {
    try {
        const { shortlink } = req.params;

        // Query DynamoDB using the shortlink global secondary index
        const queryResult = await dynamoDBClient.send(new QueryCommand({
            TableName: tableName,
            IndexName: 'shortlink-index',
            KeyConditionExpression: '#shortlink = :shortlink',
            ExpressionAttributeNames: {
                '#shortlink': 'shortlink'
            },
            ExpressionAttributeValues: {
                ':shortlink': { S: shortlink }
            }
        }));

        if (queryResult.Items && queryResult.Items.length > 0) {
            const url = queryResult.Items[0].url.S;
            res.redirect(302, url);
        } else {
            res.status(404).json({ error: 'Shortlink not found' });
        }
    } catch (error) {
        console.error('Error retrieving URL:', error);
        res.status(500).json({ error: 'Failed to retrieve URL' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
