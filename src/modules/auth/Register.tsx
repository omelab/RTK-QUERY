/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../../components/FormInput';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../redux/api/auth/userApi';
import { toast } from 'react-toastify';

const registerSchema = object({
  name: string().min(1, 'Full name is required').max(100),
  email: string()
    .min(1, 'Email address is required')
    .email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(2, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  password_confirmation: string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirmation, {
  path: ['passwordConfirm'],
  message: 'Passwords do not match',
});

export type RegisterInput = TypeOf<typeof registerSchema>;

export const RegisterPage = () => {
  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // 👇 Calling the Register Mutation
  const [register, { isLoading, isSuccess, error, isError }] =
    useRegisterMutation();

  const navigate = useNavigate();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSuccess) {
      toast.success('User registered successfully');
      navigate('/login');
    }

    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el, {
            position: 'top-right',
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: 'top-right',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    // 👇 Executing the RegisterUser Mutation
    register(values);
  };

  const checkToster = () => {
    toast.success('User registered successfully');
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xs">
        <Link to={'#'} className="pt-4 pb-4 text-center" onClick={checkToster}>
          Already have an account?
        </Link>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <FormInput name="name" label="Full Name" />
            <FormInput name="email" label="Email" />
            <FormInput name="password" label="Password" />
            <FormInput name="password_confirmation" label="Password Confirm" />

            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isLoading}
              >
                Register
              </button>
            </div>
          </form>
        </FormProvider>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
