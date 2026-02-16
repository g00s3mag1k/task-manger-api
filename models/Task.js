const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120, 
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 1000,
        },
        status: {
            type: String,
            enum: ["todo", "in_progress", "done"],
            default: "todo",
            index: true,
        },
},
    { timestamps: true}
);

module.exports = mongoose.model("Task", TaskSchema);