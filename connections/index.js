const mongoose = require("mongoose");
async function connectMongoDB(url){
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
}
module.exports = { connectMongoDB };