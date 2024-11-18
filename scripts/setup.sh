#!/bin/bash

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push database schema
npm run prisma:push

# Create admin user
npm run setup-admin

# Build the application
npm run build 