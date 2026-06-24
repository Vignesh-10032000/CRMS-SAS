const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id/role', auth, async (req, res) => {
  try {
    const requestingUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!['Admin', 'Super Admin'].includes(requestingUser.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { role } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role }
    });
    
    // Omit password
    const { password, ...userWithoutPassword } = updated;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
