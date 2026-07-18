import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { CodeforcesService } from '../services/cfService';

const getJWTToken = (user: any) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_cp_tracker_2026';
  return jwt.sign(
    { id: user._id, email: user.email, cfHandle: user.cfHandle },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, cfHandle } = req.body;

    if (!email || !password || !cfHandle) {
      return res.status(400).json({ message: 'All fields (email, password, cfHandle) are required.' });
    }

    // 1. Verify Codeforces Handle
    const isValidHandle = await CodeforcesService.verifyHandle(cfHandle);
    if (!isValidHandle) {
      return res.status(400).json({ message: `Codeforces handle '${cfHandle}' is invalid or does not exist.` });
    }

    // 2. Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const existingUserByHandle = await User.findOne({ cfHandle: new RegExp(`^${cfHandle}$`, 'i') });
    if (existingUserByHandle) {
      return res.status(400).json({ message: 'Codeforces handle is already registered by another account.' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create User
    const newUser = new User({
      email,
      passwordHash,
      cfHandle,
      cfRating: 0,
      cfRank: 'unrated',
      cfAvatar: ''
    });

    await newUser.save();

    // 5. Initial Sync of Codeforces Data in background
    try {
      await CodeforcesService.syncUserData(cfHandle, true);
    } catch (err) {
      console.warn(`Initial CF sync for ${cfHandle} failed, will try again later.`, (err as Error).message);
    }

    // Fetch user again to get synced data
    const user = await User.findById(newUser._id);

    const token = getJWTToken(user);

    res.status(201).json({
      token,
      user: {
        id: user?._id,
        email: user?.email,
        cfHandle: user?.cfHandle,
        cfRating: user?.cfRating,
        cfRank: user?.cfRank,
        cfAvatar: user?.cfAvatar
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Sync user data on login to keep dashboard fresh (async background sync)
    CodeforcesService.syncUserData(user.cfHandle, false).catch(err => {
      console.error(`Background sync on login for ${user.cfHandle} failed:`, err.message);
    });

    const token = getJWTToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        cfHandle: user.cfHandle,
        cfRating: user.cfRating,
        cfRank: user.cfRank,
        cfAvatar: user.cfAvatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
