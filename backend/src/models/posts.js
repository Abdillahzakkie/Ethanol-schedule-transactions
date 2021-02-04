const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    from: {
        from: String,
        required: true,
    },
    raw: {
        type: String,
        required: true
    },
    tx: {
        type: Object,
        required: true,
    }
})

module.exports = mongoose.model("Posts", PostSchema);