import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store/store';
import type { RegisterPayload } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onClose: () => void;
  onSwitchToLogin: () => void;// new prop to open login modal
}

  const RegisterForm: React.FC<RegisterFormProps> = ({ onClose,onSwitchToLogin }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>();

  const onSubmit: SubmitHandler<RegisterPayload> = async (data) => {
    try {
      const result = await dispatch(registerUser(data));

      if (registerUser.fulfilled.match(result)) {
        toast.success("Registration successful! You can now log in.", {
          duration: 5000,
          position: "top-right",
        });

        onClose();
        onSwitchToLogin();
      } else {
        toast.error(result.payload || "Registration failed.", {
          duration: 5000,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto relative animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Create Your Patient Account</h2>
      <p className="text-center text-gray-600 mb-4">Sign up to book appointments and access health services.</p>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  );
};

export default RegisterForm;
