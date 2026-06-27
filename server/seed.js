// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Canteen = require('./models/Canteen');
const Pack = require('./models/Pack');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');

    // Clear all existing data
    await User.deleteMany({});
    await Canteen.deleteMany({});
    await Pack.deleteMany({});
    console.log('Cleared old data.');

    // 1. Create users
    const vendor = await User.create({
      name: 'Canteen Manager',
      email: 'vendor@campus.com',
      password: 'password', // will be hashed automatically by the User model pre-save hook
      role: 'vendor',
      campusId: 'campus_1',
    });

    const customer = await User.create({
      name: 'Student Rahul',
      email: 'student@campus.com',
      password: 'password',
      role: 'customer',
      campusId: 'campus_1',
    });

    console.log('Users created:', vendor.email, customer.email);

    // 2. Create canteens (owned by the vendor)
    const canteen1 = await Canteen.create({
      owner: vendor._id,
      name: 'Main Cafeteria',
      location: { type: 'Point', coordinates: [77.1025, 28.7041] },
      address: 'Block A, Delhi Campus',
    });

    const canteen2 = await Canteen.create({
      owner: vendor._id,
      name: 'Food Court',
      location: { type: 'Point', coordinates: [77.1026, 28.7042] },
      address: 'Block B, Delhi Campus',
    });

    console.log('Canteens created:', canteen1.name, canteen2.name);

    // 3. Create some sample packs (set availableUntil to 30 minutes from now)
    const future = new Date(Date.now() + 30 * 60000);
    await Pack.create([
      {
        canteen: canteen1._id,
        description: 'Veg Thali',
        originalPrice: 150,
        discountedPrice: 60,
        quantity: 3,
        availableUntil: future,
        status: 'available',
      },
      {
        canteen: canteen1._id,
        description: 'Chicken Biryani',
        originalPrice: 200,
        discountedPrice: 80,
        quantity: 2,
        availableUntil: future,
        status: 'available',
      },
      {
        canteen: canteen2._id,
        description: 'Pasta',
        originalPrice: 120,
        discountedPrice: 48,
        quantity: 1,
        availableUntil: future,
        status: 'available',
      },
    ]);

    console.log('Sample packs created.');
    console.log('Seed complete!');
    console.log('Login as vendor: vendor@campus.com / password');
    console.log('Login as customer: student@campus.com / password');
    process.exit();
  })
  .catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });