const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema ({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String}
})

module.exports = mongoose.model("User", userSchema);