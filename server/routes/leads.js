const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// @route   GET /api/leads
// @desc    Get all leads for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/leads
// @desc    Create a lead
router.post('/', auth, async (req, res) => {
  try {
    const { name, company, email, phone, source, status, notes, contact, stage, score, assignee, assignedToId } = req.body;
    
    const lead = await prisma.lead.create({
      data: {
        name: contact || name || 'Unknown Contact',
        company: name || company || 'Unknown Company',
        email: email || null,
        phone: phone || null,
        source: source || 'Website',
        status: stage || status || 'New',
        score: Number(score) || 0,
        notes: notes || null,
        assignedToId: (typeof assignee === 'string' && assignee.length > 20) ? assignee : req.user.id
      }
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'Created Lead',
        details: `Lead ${name} from ${company}`,
        userId: req.user.id
      }
    });

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead
router.put('/:id', auth, async (req, res) => {
  try {
    // Check ownership
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead || lead.assignedToId !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found or unauthorized' });
    }

    const { name, company, email, phone, source, status, notes, contact, stage, score, assignee, assignedToId } = req.body;

    const updatedLead = await prisma.lead.update({
      where: { id: req.params.id },
      data: {
        ...(contact || name ? { name: contact || name } : {}),
        ...(name || company ? { company: name || company } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(source ? { source } : {}),
        ...(stage || status ? { status: stage || status } : {}),
        ...(score !== undefined ? { score: Number(score) } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...((typeof assignee === 'string' && assignee.length > 20) ? { assignedToId: assignee } : {})
      }
    });

    res.json(updatedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (!lead || lead.assignedToId !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found or unauthorized' });
    }

    await prisma.lead.delete({ where: { id: req.params.id } });
    
    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'Deleted Lead',
        details: `Lead ${lead.name} from ${lead.company}`,
        userId: req.user.id
      }
    });

    res.json({ message: 'Lead removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
