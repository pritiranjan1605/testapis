const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const router = express.Router();

mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

router.post('/authenticate', async (req, res) => {
    const { userId, password, passKey } = req.body;

    try {
        const collection = mongoose.connection.collection('users');

        const user = await collection.findOne({ userId });

        if (!user) {
            return res.status(401).json({ message: 'Login failed, user not found' });
        }

        const isPasswordMatch = password === user.password; 
        const isPassKeyMatch = passKey === user.passKey;

        if (isPasswordMatch && isPassKeyMatch) {
            const encryptedPassword = bcrypt.hashSync(userId, 10); 

            await collection.updateOne(
                { userId },
                { $set: { encryptedPassword } }
            );

            res.status(200).json({
                message: 'Login successful',
                encryptedPassword,
                sessionValidFor: '1 hour' 
            });
        } else {
            res.status(401).json({ message: 'Login failed, invalid credentials' });
        }
    } catch (error) {
        console.error('Error during authentication:', error.message);
        res.status(500).json({ message: 'Internal server error', details: error.message });
    }
});
module.exports = router;
