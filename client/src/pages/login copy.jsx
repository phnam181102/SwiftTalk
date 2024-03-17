import Button from '@/components/common/Button';
import ButtonSocial from '@/components/common/Button/ButtonSocial';
import Input from '@/components/common/Input';
import {
    useLoginMutation,
    useRegisterMutation,
} from '@/redux/features/auth/authApi';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

function Login() {
    const [variant, setVariant] = useState('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [registerMutation] = useRegisterMutation();
    const [loginMutation] = useLoginMutation();
    const router = useRouter();

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else setVariant('LOGIN');
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data, event) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
            try {
                const result = await registerMutation(data);

                if (result.error) {
                    if ('data' in result.error) {
                        const errorData = result.error;
                        toast.error(errorData.data.message);
                    }
                } else {
                    toast.success('Register success!');
                }
            } catch (error) {
                toast.error('Please try against!');
            }
            setIsLoading(false);
        }

        if (variant === 'LOGIN') {
            try {
                const result = await loginMutation(data);

                if (result.error) {
                    if ('data' in result.error) {
                        const errorData = result.error;
                        toast.error(errorData.data.message);
                    }
                } else {
                    toast.success('Login success!');
                    router.push('/onboarding');
                }
            } catch (error) {
                toast.error('Please try against!');
            }
            setIsLoading(false);
        }
    };

    const socialAction = (action) => {};

    return (
        <div className="flex justify-center items-center h-screen flex-col gap-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadown sm:rounded-lg sm:px-10">
                    <form
                        className="space-y-3"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {variant === 'REGISTER' && (
                            <Input
                                id="name"
                                label="Name"
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                            />
                        )}
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            register={register}
                            errors={errors}
                        />
                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            register={register}
                            errors={errors}
                        />
                        <div>
                            <Button
                                disabled={isLoading}
                                fullWidth
                                type="submit"
                            >
                                {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <ButtonSocial
                                icon={BsGithub}
                                onClick={() => socialAction('github')}
                            />
                            <ButtonSocial
                                icon={BsGoogle}
                                onClick={() => socialAction('google')}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                        <div>
                            {variant === 'LOGIN'
                                ? 'New to Messenger?'
                                : 'Already have an account?'}
                        </div>
                        <div
                            onClick={toggleVariant}
                            className="underline cursor-pointer"
                        >
                            {variant === 'LOGIN'
                                ? 'Create an account'
                                : 'Login'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
