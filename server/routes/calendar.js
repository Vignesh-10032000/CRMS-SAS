const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const events = await prisma.calendarEvent.findMany({
      where: { assignedToId: req.user.id },
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, date, time, duration, type, leadId, contactId, projectId, assignee, assignedToId } = req.body;
    const event = await prisma.calendarEvent.create({
      data: {
        title: title || 'New Event',
        date: date || new Date().toISOString().split('T')[0],
        time: time || '09:00',
        duration: duration || '1h',
        type: type || 'Meeting',
        leadId: leadId || null,
        contactId: contactId || null,
        projectId: projectId || null,
        assignedToId: (typeof assignee === 'string' && assignee.length > 20) ? assignee : req.user.id
      }
    });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const event = await prisma.calendarEvent.findUnique({ where: { id: req.params.id } });
    if (!event || event.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    const { title, date, time, duration, type, leadId, contactId, projectId, assignee, assignedToId } = req.body;
    const updated = await prisma.calendarEvent.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(date !== undefined ? { date } : {}),
        ...(time !== undefined ? { time } : {}),
        ...(duration !== undefined ? { duration } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(leadId !== undefined ? { leadId } : {}),
        ...(contactId !== undefined ? { contactId } : {}),
        ...(projectId !== undefined ? { projectId } : {}),
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
    const event = await prisma.calendarEvent.findUnique({ where: { id: req.params.id } });
    if (!event || event.assignedToId !== req.user.id) return res.status(404).json({ message: 'Not found' });

    await prisma.calendarEvent.delete({ where: { id: req.params.id } });
    res.json({ message: 'Removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
