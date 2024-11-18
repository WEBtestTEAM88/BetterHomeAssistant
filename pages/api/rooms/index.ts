import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const rooms = await prisma.room.findMany({
          include: {
            devices: true
          }
        });
        res.status(200).json(rooms);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 