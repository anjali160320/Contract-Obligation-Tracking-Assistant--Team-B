import api from '../../../services/api';

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@contractiq.com' && password === 'Password123!') {
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        resolve({ token, user: { email } });
      } else {
        reject(new Error('Invalid email or password. Use admin@contractiq.com / Password123!'));
      }
    }, 1500);
  });
};

export const forgotPassword = async (email) => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const resetPassword = async (token, newPassword) => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
