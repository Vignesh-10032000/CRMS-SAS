const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@vglcrm.in' },
    update: {},
    create: {
      email: 'demo@vglcrm.in',
      password: hashedPassword,
      name: 'Demo Admin',
      role: 'Super Admin',
      phone: '+91 98765 43210'
    },
  });

  console.log(`Upserted Demo Admin (ID: ${demoUser.id})`);

  // Create another user
  const salesUser = await prisma.user.upsert({
    where: { email: 'sales@vglcrm.in' },
    update: {},
    create: {
      email: 'sales@vglcrm.in',
      password: hashedPassword,
      name: 'Sales Rep',
      role: 'Sales Rep',
      phone: '+91 98765 43211'
    },
  });

  // Seed Leads
  const leads = [
    { name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 9876543210', company: 'Rajesh Textiles', status: 'New', source: 'WhatsApp', score: 85, assignedToId: demoUser.id },
    { name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211', company: 'Priya Designs', status: 'Contacted', source: 'Website', score: 65, assignedToId: salesUser.id },
    { name: 'Arun Prakash', email: 'arun@example.com', phone: '+91 9876543212', company: 'Tech Solutions', status: 'Qualified', source: 'Referral', score: 90, assignedToId: demoUser.id }
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
  }

  // Seed Contacts
  const contacts = [
    { name: 'Vijay Singh', email: 'vijay@example.com', phone: '+91 9876543213', company: 'Singh Enterprises', role: 'CEO', assignedToId: demoUser.id },
    { name: 'Anita Patel', email: 'anita@example.com', phone: '+91 9876543214', company: 'Patel Agencies', role: 'Manager', assignedToId: salesUser.id }
  ];

  for (const contact of contacts) {
    await prisma.contact.create({ data: contact });
  }

  // Seed Deals
  const deals = [
    { name: 'Website Redesign', value: 120000, expectedDate: new Date('2024-08-15'), probability: 75, status: 'Proposal', assignedToId: demoUser.id },
    { name: 'CRM Implementation', value: 250000, expectedDate: new Date('2024-07-30'), probability: 90, status: 'Negotiation', assignedToId: demoUser.id }
  ];

  for (const deal of deals) {
    await prisma.deal.create({ data: deal });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
