import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('Admin credentials not found in environment variables');
    }

    // Check if admin exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user with full permissions
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        permissions: {
          canControlDevices: true,
          canCreateScenes: true,
          canCreateAutomations: true,
          canViewHistory: true,
          canManageRooms: true,
          allowedRooms: []  // Empty array means access to all rooms
        }
      }
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Failed to create admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin(); 