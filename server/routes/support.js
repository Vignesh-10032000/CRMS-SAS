const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const ticket = await prisma.ticket.create({
      data: {
        subject: req.body.subject || 'Support Request',
        priority: req.body.priority || 'Medium',
        status: req.body.status || 'Open',
        contactId: req.body.contactId || null,
        assignedToId: req.user.id
      }
    });
    res.json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket || ticket.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const updated = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        ...(req.body.subject ? { subject: req.body.subject } : {}),
        ...(req.body.priority ? { priority: req.body.priority } : {}),
        ...(req.body.status ? { status: req.body.status } : {}),
        ...(req.body.contactId !== undefined ? { contactId: req.body.contactId } : {})
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
    const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
    if (!ticket || ticket.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.ticket.delete({ where: { id: req.params.id } });
    res.json({ message: 'Removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
