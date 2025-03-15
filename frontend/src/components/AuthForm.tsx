// import { useState } from 'react';
// import axios from 'axios';

// interface LoginFormProps {
//   onLogin: (user: any) => void;
// }

// const LoginForm = ({ onLogin }: LoginFormProps) => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('/api/auth/login', credentials);
//       localStorage.setItem('token', res.data.token);
//       onLogin(res.data.user);
//     } catch (err) {
//       console.error('Login failed:', err);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-xl font-semibold mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Username</label>
//           <input
//             type="text"
//             value={credentials.username}
//             onChange={(e) => setCredentials({...credentials, username: e.target.value})}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Password</label>
//           <input
//             type="password"
//             value={credentials.password}
//             onChange={(e) => setCredentials({...credentials, password: e.target.value})}
//             className="w-full p-2 border rounded-md"
//             required
//           />
//         </div>
//         <button 
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

import { useState } from 'react';
import axios from 'axios';
import { AuthCredentials, AuthFormProps } from '../types/types';

const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState<AuthCredentials>({
    username: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Client-side validation
    if (!isLogin) {
      if (credentials.password !== credentials.passwordConfirm) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }
      if (credentials.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? {
        username: credentials.username,
        password: credentials.password
      } : {
        username: credentials.username,
        password: credentials.password,
      };

      const { data } = await axios.post(endpoint, payload);
      
      localStorage.setItem('token', data.token);
      onAuthSuccess(data.user);
    } catch (err: any) {
      const serverError = err.response?.data?.error;
      setError(serverError || 
        (isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-80 mx-auto">
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 rounded-l-md transition-colors ${
            isLogin 
              ? 'bg-blue-600 text-white cursor-default'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 rounded-r-md transition-colors ${
            !isLogin 
              ? 'bg-blue-600 text-white cursor-default'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Register
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={credentials.passwordConfirm || ''}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
        )}

        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;