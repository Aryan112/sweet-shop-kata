const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet'); // FIX: No { } brackets here!
const verifyToken = require('../middleware/authMiddleware');

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: "Access Denied" });
    next();
};

// GET all sweets
router.get('/', async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.json(sweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PURCHASE sweet
router.post('/:id/purchase', verifyToken, async (req, res) => {
    if (req.user.role === 'admin') return res.status(403).json({ message: "Admins cannot purchase." });
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (sweet.quantity > 0) {
            sweet.quantity -= 1;
            await sweet.save();
            res.json({ message: 'Purchase successful', sweet });
        } else {
            res.status(400).json({ message: 'Out of stock' });
        }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN ROUTES (Add, Delete, Restock)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const sweet = new Sweet(req.body);
    try { const newSweet = await sweet.save(); res.status(201).json(newSweet); } 
    catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try { await Sweet.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
    catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/:id/restock', verifyToken, isAdmin, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        sweet.quantity += (parseInt(req.body.amount) || 10);
        await sweet.save();
        res.json(sweet);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;