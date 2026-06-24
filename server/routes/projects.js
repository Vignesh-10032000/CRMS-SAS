const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { assignedToId: req.user.id },
      include: { contacts: true },
      orderBy: { dueDate: 'asc' }
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { contactIds, name, status, progress, dueDate, assignee, assignedToId } = req.body;
    const project = await prisma.project.create({
      data: {
        name: name || 'New Project',
        status: status || 'Active',
        progress: progress !== undefined ? Number(progress) : 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: (typeof assignee === 'string' && assignee.length > 20) ? assignee : req.user.id,
        contacts: contactIds ? { connect: contactIds.map(id => ({ id })) } : undefined
      },
      include: { contacts: true }
    });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project || project.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const { contactIds, name, status, progress, dueDate, assignee, assignedToId } = req.body;
    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(progress !== undefined ? { progress: Number(progress) } : {}),
        ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
        ...((typeof assignee === 'string' && assignee.length > 20) ? { assignedToId: assignee } : {}),
        contacts: contactIds ? { set: contactIds.map(id => ({ id })) } : undefined
      },
      include: { contacts: true }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project || project.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
