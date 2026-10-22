
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { httpError } from '../lib/utils.js';

const cookieName = 'dakshayani_session';

const secret = () => {
  if (
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error(
      'Set JWT_SECRET (32+ characters) in environment variables'
    );
  }

  return process.env.JWT_SECRET;
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export function issueCookie(res, user) {
  const token = jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      ver: user.sessionVersion || 0,
    },
    secret(),
    {
      expiresIn: '7d',
    }
  );

  res.cookie(cookieName, token, cookieOptions);
}

export function clearCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[cookieName];

    if (!token) {
      throw httpError(401, 'Please log in to continue');
    }

    const data = jwt.verify(token, secret());

    const user = await User.findById(data.sub);

    if (
      !user ||
      user.status !== 'active' ||
      user.role !== data.role ||
      (user.sessionVersion || 0) !== data.ver
    ) {
      throw httpError(401, 'Session expired. Please log in again');
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(
      httpError(401, 'Please log in to continue')
    );
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  return next(httpError(403, 'Admin access required'));
};

export const requireCustomer = (req, res, next) => {
  if (req.user?.role === 'customer') {
    return next();
  }

  return next(httpError(403, 'Customer access required'));
};
