const mongoose = require('mongoose');
const User = require('./skema/user.js');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
        
        // Auto-create developer account jika belum ada
        await initializeDeveloperAccount();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Bikin developer account otomatis
async function initializeDeveloperAccount() {
    try {
        const developerExists = await User.findOne({ username: 'developer' });
        
        if (!developerExists) {
            // Ambil password dari environment variable, atau gunakan yang default
            const devPassword = process.env.DEVELOPER_PASSWORD || 'Dev@2024!SecurePass';
            
            const developer = new User({
                username: 'developer',
                nisn: '0000000001',
                password: devPassword, // Akan di-hash otomatis
                role: 'developer'
            });
            
            await developer.save();
            console.log('✓ Developer account created successfully');
            console.log('⚠️  PENTING: Ubah password developer di environment variable DEVELOPER_PASSWORD');
        } else {
            console.log('✓ Developer account already exists');
        }
    } catch (error) {
        console.error('Error creating developer account:', error);
    }
}

module.exports = connectDB;