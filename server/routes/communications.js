const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { time: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const message = await prisma.message.create({
      data: {
        type: req.body.type || 'Email',
        content: req.body.content || '',
        contactName: req.body.contactName || 'Unknown',
        time: req.body.time || new Date().toISOString().split('T')[1].substring(0,5),
        direction: req.body.direction || 'outbound',
        assignedToId: req.user.id
      }
    });
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const message = await prisma.message.findUnique({ where: { id: req.params.id } });
    if (!message || message.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const updated = await prisma.message.update({
      where: { id: req.params.id },
      data: {
        ...(req.body.type ? { type: req.body.type } : {}),
        ...(req.body.content ? { content: req.body.content } : {}),
        ...(req.body.contactName ? { contactName: req.body.contactName } : {}),
        ...(req.body.time ? { time: req.body.time } : {}),
        ...(req.body.direction ? { direction: req.body.direction } : {})
      }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await prisma.message.findUnique({ where: { id: req.params.id } });
    if (!message || message.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.message.delete({ where: { id: req.params.id } });
    res.json({ message: 'Removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
