import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    // Successful login, handle the response as needed
    res.json({ status: 'success', user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ status: 'success', message: 'Logout successful' });
});

// Current User
router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ status: 'success', user: req.user });
    } else {
        res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }
});

export { router };
