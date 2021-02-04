const Mongoose = require('mongoose');
require('dotenv/config');

const connectDB = async () => {
    Mongoose.connect(process.env.DB_URI, { 
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true 
        }, async () => console.log("Connected")
    );
}
module.exports = connectDB;