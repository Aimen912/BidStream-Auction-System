const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://bidstream_user:Test123@bidstreamcluster.firumlq.mongodb.net/BidStreamDB?appName=BidStreamCluster")

.then(() => {
    console.log("Connected");
    process.exit();
})

.catch(err => {
    console.log(err);
});
