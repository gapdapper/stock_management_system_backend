import type { Request, Response } from 'express';

export const webhookHandler = async (req: Request, res: Response) => {
    try {
        const event = req.body;
        console.log('Received webhook event:', event.events[0].source);
        res.status(200).send('Webhook received successfully');
    } catch (error) {
        res.status(500).send('Error processing webhook');
    }
};