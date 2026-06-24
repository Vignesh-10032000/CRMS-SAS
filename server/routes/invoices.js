const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        client: req.body.client || 'Unknown',
        amount: parseFloat(req.body.amount) || 0,
        date: req.body.date || req.body.dueDate || new Date().toISOString().split('T')[0],
        status: req.body.status || 'Draft',
        assignedToId: req.user.id
      }
    });
    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice || invoice.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const updated = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        ...(req.body.client ? { client: req.body.client } : {}),
        ...(req.body.amount !== undefined ? { amount: parseFloat(req.body.amount) } : {}),
        ...(req.body.date || req.body.dueDate ? { date: req.body.date || req.body.dueDate } : {}),
        ...(req.body.status ? { status: req.body.status } : {})
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
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice || invoice.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.json({ message: 'Removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
