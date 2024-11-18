const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  try {
    // Create default home
    const home = await prisma.home.create({
      data: {
        name: 'My Home'
      }
    });

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || 'admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@homeautomation.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'ADMIN',
        homeId: home.id,
        permissions: {
          canControlDevices: true,
          canCreateScenes: true,
          canCreateAutomations: true,
          canViewHistory: true,
          canManageRooms: true,
          allowedRooms: []
        }
      }
    });

    console.log('Database initialized with admin user:', admin.email);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 