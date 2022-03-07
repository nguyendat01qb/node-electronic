require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@webshop.pouir.mongodb.net/webshop?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            },
        );
        console.log('Mongodb connected successful');
    } catch (error) {
        console.log('Mongodb connect failured');
    }
}

module.exports = { connectDB };