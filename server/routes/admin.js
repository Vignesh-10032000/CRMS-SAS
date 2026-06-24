const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// Middleware to ensure user is an Admin
const ensureAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || (user.role !== 'Admin' && user.role !== 'Super Admin')) {
      return res.status(403).json({ message: 'Access denied: Admin only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying admin' });
  }
};

// @route   GET /api/admin/settings
// @desc    Get all system settings
router.get('/settings', auth, ensureAdmin, async (req, res) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching settings' });
  }
});

// @route   PUT /api/admin/settings
// @desc    Upsert a system setting
router.put('/settings', auth, ensureAdmin, async (req, res) => {
  try {
    const { key, value, category } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ message: 'Key and value are required' });
    }

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value, category: category || 'General' },
      create: { key, value, category: category || 'General' },
    });
    
    res.json(setting);
  } catch (error) {
    console.error('Save setting error:', error);
    res.status(500).json({ message: 'Server error saving setting' });
  }
});

// @route   GET /api/admin/roles
// @desc    Get all role permissions
router.get('/roles', auth, ensureAdmin, async (req, res) => {
  try {
    const permissions = await prisma.rolePermission.findMany();
    // Group permissions by role
    const rolePerms = permissions.reduce((acc, curr) => {
      if (!acc[curr.role]) acc[curr.role] = [];
      acc[curr.role].push(curr.permission);
      return acc;
    }, {});
    res.json(rolePerms);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching roles' });
  }
});

// @route   PUT /api/admin/roles
// @desc    Toggle a permission for a role
router.put('/roles', auth, ensureAdmin, async (req, res) => {
  try {
    const { role, permission, enabled } = req.body;
    
    if (!role || !permission) {
      return res.status(400).json({ message: 'Role and permission are required' });
    }

    if (enabled) {
      // Add permission
      await prisma.rolePermission.upsert({
        where: { role_permission: { role, permission } },
        update: {},
        create: { role, permission },
      });
    } else {
      // Remove permission
      await prisma.rolePermission.deleteMany({
        where: { role, permission },
      });
    }
    
    // Return updated permissions for this role
    const updated = await prisma.rolePermission.findMany({ where: { role } });
    res.json(updated.map(p => p.permission));
  } catch (error) {
    console.error('Toggle role permission error:', error);
    res.status(500).json({ message: 'Server error toggling permission' });
  }
});

module.exports = router;
