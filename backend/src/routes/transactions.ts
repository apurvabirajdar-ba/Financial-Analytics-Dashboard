import express from 'express';
import { authenticate } from '../middleware/auth';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// Get all transactions with filters
router.get('/', authenticate, async (req, res) => {
  try {
    const { skip = 0, limit = 25, search, category, status, startDate, endDate, sortBy = 'date', sortOrder = 'desc' } = req.query;

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate as string);
      if (endDate) query.date.$lte = new Date(endDate as string);
    }

    if (search) {
      query.$or = [
        { category: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const transactions = await Transaction.find(query)
      .skip(parseInt(skip as string))
      .limit(parseInt(limit as string))
      .sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 });

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      page: Math.floor(parseInt(skip as string) / parseInt(limit as string)) + 1,
      totalPages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;