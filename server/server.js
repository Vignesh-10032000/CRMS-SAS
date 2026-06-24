const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/support', require('./routes/support'));
app.use('/api/communications', require('./routes/communications'));
app.use('/api/users', require('./routes/users'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const seedDemoUser = async () => {
  try {
    const demoEmail = 'demo@vglcrm.in';
    const existing = await prisma.user.findUnique({ where: { email: demoEmail } });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo1234', salt);
      await prisma.user.create({
        data: {
          email: demoEmail,
          password: hashedPassword,
          name: 'Demo User',
          company: 'Vignesh Growth Lab',
          role: 'Super Admin'
        }
      });
      console.log('Demo user seeded successfully.');
    }
  } catch (err) {
    console.error('Failed to seed demo user:', err.message);
  }
};

app.listen(PORT, async () => {
  await seedDemoUser();
  console.log(`Server running on port ${PORT}`);
});
