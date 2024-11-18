import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongoose';
import { Device } from '../../server/models/schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const devices = await Device.find({}).populate('room');
        res.status(200).json(devices);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch devices' });
      }
      break;

    case 'POST':
      try {
        const device = await Device.create(req.body);
        res.status(201).json(device);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create device' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 