import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onClose: () => void;
}

interface LoginPayload {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>();

  const onSubmit = async (data: LoginPayload) => {
       
    try {
      const result = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(result)) {
        const message = result.payload.message;
        if (message) {
          toast.success(message, { duration: 5000, position: "bottom-right" });
        }

        onClose();
        navigate(from, { replace: true });
      } else {
        toast.error(result.payload || "Login failed", {
          duration: 5000,
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again.", {
        duration: 5000,
        position: "bottom-right",
      });
    }

  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Patient Login</h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('email', { required: 'Email is required' })}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input
          {...register('password', { required: 'Password is required' })}
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
    </div>
  );
};

export default LoginForm;
