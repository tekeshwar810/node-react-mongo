const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://tekeshwar810_db_user:wbfb1129U905mBik@cluster0.pvgrwhh.mongodb.net/user_management`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.info('Database Connected...');
    } catch (error) {
        console.error('Database Not Connected...', error);
        process.exit(1);
    }
};

module.exports = connectDB;