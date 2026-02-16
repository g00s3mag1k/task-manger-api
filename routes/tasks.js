const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

// Protect all task routes
router.use(auth);

// GET /api/tasks - list tasks for logged-in user
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.json({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
});

// POST /api/tasks - create task
router.post("/", async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required." });
        }

        const task = await Task.create({
            userId: req.user.id,
            title: title.trim(),
            description: description?.trim() || "",
            status: status || "todo",
            dueDate: dueDate || null,
        });
        
        return res.status(201).json({ task });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ error: "Task not found." });
        return res.json({ task });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error."});
    }
});

// PATCH /api/tasks/:id - update task
router.patch("/:id", async (req, res) => {
    try {
        const updates = {};
        const allowed = ["title", "description", "status", "dueDate"];

        for (const key of allowed) {
            if (key in req.body) updates[key] = req.body[key];
        }

        if ("title" in updates && (!updates.title || !updates.title.trim())) {
            return res.status(400).json({ error: "Title cannot be empty." });
        }

        if ("title" in updates) updates.title = updates.title.trim();
        if ("description" in updates) updates.description = updates.description?.trim() || "";

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            }, 
            updates,
            {
                new: true
            }
        );

        if (!task) return res.status(404).json({ error: "Task not found." });

        return res.json({ task });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
});

// DELETE /api/tasks/:id - delete task
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findOneAndDelete(
            {
                _id: req.params.id,
                userId: req.user.id,
            }
        );

        if (!task) return res.status(404).json({ error: "Task not found." });

        return res.json({ ok: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;