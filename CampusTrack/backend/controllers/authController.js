const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');
const dbStore = require('../models/dbStore');

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both email address and password.'
        });
      }

      const user = await dbStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials. User not found.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      if (user.account_status !== 'active') {
        return res.status(403).json({
          success: false,
          error: 'Your account is currently suspended or inactive. Please contact transport admin.'
        });
      }

      const token = jwt.sign(
        { userId: user.user_id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Audit login
      await dbStore.createAuditLog({
        actor_user_id: user.user_id,
        action: 'USER_LOGIN',
        entity_type: 'USER',
        entity_id: user.user_id,
        metadata: { role: user.role, timestamp: new Date().toISOString() }
      });

      // Role specific profile details
      let profile = null;
      if (user.role === 'student') {
        profile = await dbStore.getStudentByUserId(user.user_id);
      } else if (user.role === 'driver') {
        profile = await dbStore.getDriverByUserId(user.user_id);
      }

      return res.json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          account_status: user.account_status,
          profile
        }
      });
    } catch (err) {
      console.error('[AuthController.login]', err);
      return res.status(500).json({ success: false, error: 'Internal server authentication error.' });
    }
  },

  async me(req, res) {
    try {
      const user = req.user;
      let profile = null;
      if (user.role === 'student') {
        profile = await dbStore.getStudentByUserId(user.user_id);
      } else if (user.role === 'driver') {
        profile = await dbStore.getDriverByUserId(user.user_id);
      }

      return res.json({
        success: true,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          account_status: user.account_status,
          profile
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to retrieve profile.' });
    }
  },

  async logout(req, res) {
    return res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  }
};

module.exports = authController;
