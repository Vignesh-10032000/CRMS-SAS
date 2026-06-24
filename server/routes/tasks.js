const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, type, dueDate, priority, status, completed, assignee, assignedToId } = req.body;
    const task = await prisma.task.create({
      data: {
        title: title || 'New Task',
        type: type || 'To Do',
        priority: priority || 'Medium',
        status: status || 'Todo',
        completed: completed || false,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId: (typeof assignee === 'string' && assignee.length > 20) ? assignee : req.user.id
      }
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task || task.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const { title, type, dueDate, priority, status, completed, assignee, assignedToId } = req.body;
    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(priority !== undefined ? { priority } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(completed !== undefined ? { completed } : {}),
        ...(dueDate !== undefined ? { dueDate: new Date(dueDate) } : {}),
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
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task || task.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
