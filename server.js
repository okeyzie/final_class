require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;
const userRouter = require('./router/user');

const app = express();

app.use(express.json());

app.use('/api/users', userRouter);

app.use((error, req, res, next) =>{
    if(error){
        return res.status(500).json({
            message:error.message
        })
    };
    next();
});


mongoose.connect(DATABASE_URI).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
