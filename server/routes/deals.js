const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const deals = await prisma.deal.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { order: 'asc' }
    });
    
    // Group by status for the kanban board
    const columns = {
      'New': deals.filter(d => d.status === 'New'),
      'Contacted': deals.filter(d => d.status === 'Contacted'),
      'Proposal': deals.filter(d => d.status === 'Proposal'),
      'Negotiation': deals.filter(d => d.status === 'Negotiation'),
      'Won': deals.filter(d => d.status === 'Won')
    };
    
    res.json(columns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, title, value, probability, expectedDate, company, status, assignee, assignedToId } = req.body;
    const deal = await prisma.deal.create({
      data: {
        name: name || title || 'New Deal',
        value: parseFloat(value) || 0,
        probability: parseInt(probability) || 50,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        company: company || null,
        status: status || 'New',
        order: 0,
        assignedToId: (typeof assignee === 'string' && assignee.length > 20) ? assignee : req.user.id
      }
    });
    res.json(deal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update deal status/move column
router.put('/:id/move', auth, async (req, res) => {
  try {
    const { status, order } = req.body;
    
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal || deal.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const updated = await prisma.deal.update({
      where: { id: req.params.id },
      data: { status, order }
    });
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal || deal.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const { name, title, value, probability, expectedDate, company, status, assignee, assignedToId } = req.body;
    const updated = await prisma.deal.update({
      where: { id: req.params.id },
      data: {
        ...(name || title ? { name: name || title } : {}),
        ...(value !== undefined ? { value: parseFloat(value) } : {}),
        ...(probability !== undefined ? { probability: parseInt(probability) } : {}),
        ...(expectedDate !== undefined ? { expectedDate: new Date(expectedDate) } : {}),
        ...(company !== undefined ? { company } : {}),
        ...(status !== undefined ? { status } : {}),
        ...((typeof assignee === 'string' && assignee.length > 20) ? { assignedToId: assignee } : {})
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
    const deal = await prisma.deal.findUnique({ where: { id: req.params.id } });
    if (!deal || deal.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.deal.delete({ where: { id: req.params.id } });
    res.json({ message: 'Deal removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
