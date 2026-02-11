import express from 'express';

const router = express.Router();

// WHY: Simple code-based login - no JWT, no user database
// Just verify the access code matches the environment variable
router.post('/verify', (req, res) => {
    try {
        const { code } = req.body;

        // WHY: Compare with environment variable ACCESS_CODE
        if (code === process.env.ACCESS_CODE) {
            return res.json({
                success: true,
                message: 'Access granted'
            });
        }

        // WHY: Incorrect code
        return res.status(401).json({
            success: false,
            message: 'Incorrect access code'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
