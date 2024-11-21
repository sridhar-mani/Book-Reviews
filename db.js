  // db.js - Remove the pg Client
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  module.exports = prisma;
