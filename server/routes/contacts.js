const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, company, role, status, lastContact, assignee, assignedToId } = req.body;
    const contact = await prisma.contact.create({
      data: {
        name: name || 'Unknown',
        email: email || null,
        phone: phone || null,
        company: company || null,
        role: role || null,
        status: status || 'Active',
        lastContact: lastContact || null,
        assignedToId: (typeof assignee === 'string' && assignee.length > 20) ? assignee : req.user.id
      }
    });
    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({ where: { id: req.params.id } });
    if (!contact || contact.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const { name, email, phone, company, role, status, lastContact, assignee, assignedToId } = req.body;
    const updated = await prisma.contact.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(company !== undefined ? { company } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(lastContact !== undefined ? { lastContact } : {}),
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
    const contact = await prisma.contact.findUnique({ where: { id: req.params.id } });
    if (!contact || contact.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.contact.delete({ where: { id: req.params.id } });
    res.json({ message: 'Contact removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
