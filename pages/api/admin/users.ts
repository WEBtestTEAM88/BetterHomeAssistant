import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  // Check if user is authenticated and is an admin
  if (!session?.user || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
      break;

    case 'POST':
      try {
        const { email, password, name, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        });

        res.status(201).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
      }
      break;

    case 'PUT':
      try {
        const { id, email, password, name, role } = req.body;
        const updateData: any = { email, name, role };

        if (password) {
          updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
          where: { id },
          data: updateData,
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        });

        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
} 