// Script untuk reset developer account
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./skema/user.js');

const resetDeveloperAccount = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Hapus akun developer lama
        const deleted = await User.deleteOne({ username: 'developer' });
        console.log(`Deleted old developer account: ${deleted.deletedCount} document(s)`);

        // Buat akun developer baru dengan password dari .env
        const devPassword = process.env.DEVELOPER_PASSWORD || 'Dev@2024!SecurePass';
        
        const developer = new User({
            username: 'developer',
            nisn: '0000000001',
            password: devPassword,
            role: 'developer'
        });

        await developer.save();
        console.log('✓ Developer account successfully reset!');
        console.log('Username: developer');
        console.log('NISN: 0000000001');
        console.log(`Password: ${devPassword}`);
        console.log('\n⚠️  Password is now set from DEVELOPER_PASSWORD in .env file');

        process.exit(0);
    } catch (error) {
        console.error('Error resetting developer account:', error);
        process.exit(1);
    }
};

resetDeveloperAccount();
