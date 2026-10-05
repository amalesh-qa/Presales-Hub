import { INITIAL_USERS } from '../mockData/defaultUsers';

const USERS_STORAGE_KEY = 'presales_hub_users_v1';
const SESSION_STORAGE_KEY = 'presales_hub_session_v1';
const OTP_STORAGE_KEY = 'presales_hub_active_otp_v1';

// Initialize users in LocalStorage if missing
export function getStoredUsers() {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse stored users:', err);
    return INITIAL_USERS;
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// 1. Email Lookup & Validation
export function validateEmail(email) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const foundUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!foundUser) {
    return {
      success: false,
      message: 'Email not found. Please contact your administrator.'
    };
  }

  return {
    success: true,
    user: foundUser
  };
}

// 2. Generate OTP
export function requestOtp(email) {
  const validation = validateEmail(email);
  if (!validation.success) {
    throw new Error(validation.message);
  }

  // Generate 6-digit numeric OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  const otpPayload = {
    email: validation.user.email,
    code,
    expiresAt
  };

  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpPayload));
  return { code, user: validation.user };
}

// 3. Verify OTP Code
export function verifyOtp(email, code) {
  const storedOtp = localStorage.getItem(OTP_STORAGE_KEY);
  if (!storedOtp) {
    return { success: false, message: 'OTP expired or not found. Please request a new code.' };
  }

  const payload = JSON.parse(storedOtp);
  if (payload.email.toLowerCase() !== email.trim().toLowerCase()) {
    return { success: false, message: 'Invalid OTP session.' };
  }

  if (Date.now() > payload.expiresAt) {
    localStorage.removeItem(OTP_STORAGE_KEY);
    return { success: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (payload.code !== code.trim()) {
    return { success: false, message: 'Incorrect OTP code. Please try again.' };
  }

  // Clear OTP and set active session
  localStorage.removeItem(OTP_STORAGE_KEY);
  const validation = validateEmail(email);
  const currentUser = validation.user;
  
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
  return { success: true, user: currentUser };
}

// Session Management
export function getCurrentSession() {
  const session = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch (e) {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(OTP_STORAGE_KEY);
}

// Admin User Management CRUD
export function addUser({ name, email, role }) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error(`User with email "${email}" already exists.`);
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: role || 'User',
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updatedUsers = [newUser, ...users];
  saveUsers(updatedUsers);
  return updatedUsers;
}

export function deleteUser(userId) {
  const currentSession = getCurrentSession();
  const users = getStoredUsers();

  const targetUser = users.find(u => u.id === userId);
  if (targetUser && currentSession && targetUser.email.toLowerCase() === currentSession.email.toLowerCase()) {
    throw new Error('You cannot delete your own active administrator account.');
  }

  const updatedUsers = users.filter(u => u.id !== userId);
  saveUsers(updatedUsers);
  return updatedUsers;
}
