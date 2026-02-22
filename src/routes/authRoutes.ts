import express from 'express';
import { login, register, logout, refreshToken, getProfile, getAllUsernames } from '@/controllers/authController';
import { authenticateUser } from '@/middlewares/authentication';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken)
router.get('/me', authenticateUser, getProfile);
router.get('/users', getAllUsernames);
router.post('/test', authenticateUser, (req, res) => {
    res.send('Test route is working!');
});

export default router;