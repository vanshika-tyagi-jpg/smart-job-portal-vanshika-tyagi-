const mongoose = require("mongoose");

const uri =
  "mongodb+srv://vanshikatyagi719_db_user:tyagivan@cluster0.flapq7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });