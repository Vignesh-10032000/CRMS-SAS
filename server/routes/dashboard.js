const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/metrics', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const [totalLeads, activeLeads, wonDeals, lostDeals, revenueAggr, tasksDue] = await Promise.all([
      prisma.lead.count({ where: { assignedToId: userId } }),
      prisma.lead.count({ where: { assignedToId: userId, status: { notIn: ['Won', 'Lost'] } } }),
      prisma.deal.count({ where: { assignedToId: userId, status: 'Won' } }),
      prisma.lead.count({ where: { assignedToId: userId, status: 'Lost' } }), // Assuming lead can be lost
      prisma.deal.aggregate({
        where: { assignedToId: userId, status: 'Won' },
        _sum: { value: true }
      }),
      prisma.task.count({ where: { assignedToId: userId, completed: false } })
    ]);

    const revenue = revenueAggr._sum.value || 0;
    const conversionRate = totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;

    res.json({
      totalLeads,
      activeLeads,
      wonDeals,
      lostDeals,
      revenue,
      conversionRate,
      tasksDue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Full reporting data for Reports module
router.get('/reports', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Group leads by source
    const leadsBySource = await prisma.lead.groupBy({
      by: ['source'],
      where: { assignedToId: userId },
      _count: { source: true }
    });
    const leadSourceData = leadsBySource.map(s => ({
      source: s.source,
      leads: s._count.source
    })).sort((a, b) => b.leads - a.leads);

    // Simple funnel based on lead status counts
    const statusCounts = await prisma.lead.groupBy({
      by: ['status'],
      where: { assignedToId: userId },
      _count: { status: true }
    });
    
    const countByStatus = (statusArr) => statusCounts
      .filter(s => statusArr.includes(s.status))
      .reduce((sum, s) => sum + s._count.status, 0);

    const totalLeads = countByStatus(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost']);
    const funnelStages = [
      { stage: 'Total Leads', count: totalLeads },
      { stage: 'Contacted', count: countByStatus(['Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won']) },
      { stage: 'Qualified', count: countByStatus(['Qualified', 'Proposal Sent', 'Negotiation', 'Won']) },
      { stage: 'Proposal', count: countByStatus(['Proposal Sent', 'Negotiation', 'Won']) },
      { stage: 'Won', count: countByStatus(['Won']) }
    ];

    const conversionFunnel = funnelStages.map((s, i, arr) => ({
      ...s,
      percentage: arr[0].count > 0 ? Math.round((s.count / arr[0].count) * 100) : 0
    }));

    // Mocking revenue time series and team performance since we don't have historical snapshots
    // In a real prod environment we'd group deals by expectedDate/updatedAt month
    const revenueData = [
      { month: 'Jan', revenue: 0, target: 10000 },
      { month: 'Feb', revenue: 0, target: 12000 },
      { month: 'Mar', revenue: 0, target: 15000 },
      { month: 'Apr', revenue: 0, target: 18000 },
      { month: 'May', revenue: 0, target: 20000 },
      { month: 'Jun', revenue: 0, target: 25000 }
    ];
    
    // Attempt to add real revenue to current month (simplification)
    const wonDealsAggr = await prisma.deal.aggregate({
      where: { assignedToId: userId, status: 'Won' },
      _sum: { value: true }
    });
    revenueData[5].revenue = wonDealsAggr._sum.value || 0;

    const teamPerformance = [
      { name: req.user.name || 'You', role: req.user.role || 'Admin', deals: await prisma.deal.count({where: {assignedToId: userId, status: 'Won'}}), revenue: wonDealsAggr._sum.value || 0, target: 25000, conversion: conversionFunnel[4].percentage }
    ];

    res.json({
      leadSourceData: leadSourceData.length ? leadSourceData : [{source: 'Website', leads: 0}],
      conversionFunnel,
      revenueData,
      teamPerformance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// Get recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const activity = await prisma.activityLog.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
