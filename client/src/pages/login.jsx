import React, { useCallback, useEffect, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

import { FaFacebook, FaRegUser } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineAtSymbol } from 'react-icons/hi';
import { HiOutlineMail } from 'react-icons/hi';
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import Input from '@/components/common/Input';
import { useLoginMutation, useSocialAuthMutation, useRegisterMutation } from '../redux/features/auth/authApi';
import { useSelector } from 'react-redux';

function Login() {
    const router = useRouter();

    const [registerMutation] = useRegisterMutation();
    const [loginMutation] = useLoginMutation();
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

    const { data } = useSession();
    const { user } = useSelector((state) => state.auth);

    const [variant, setVariant] = useState('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!user) {
            if (data) {
                const { email, name, image } = data?.user;
                socialAuth({ email, name, profilePicture: image });
            }
        }
    }, [data, user]);

    useEffect(() => {
        if (isSuccess) {
            router.push('/');
        }
    }, [isSuccess]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
    });

    const toggleVariant = useCallback(() => {
        reset();
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else setVariant('LOGIN');
    }, [variant]);

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
                    router.push('/');
                }
            } catch (error) {
                toast.error('Please try against!');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="text-[#333] bg-primary-200">
            <div className="min-h-screen flex justify-center">
                <div className=" grid items-center gap-4 w-full">
                    <div className="bg-white shadow-lg min-w-[450px] justify-self-center rounded-md p-8 max-w-md max-md:mx-auto">
                        <form className="space-y-5 flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
                            <Image src="/chat.png" width={80} height={80} alt="Picture of the author" />

                            <div className="mb-10 flex flex-col items-center">
                                <h3 className="text-4xl font-semibold mb-2">
                                    {variant === 'LOGIN' ? 'Welcome Back' : 'Create New Account'}
                                </h3>
                                <p className="text-base flex">
                                    {variant === 'LOGIN' ? "Don't have an account? " : 'Already have an account? '}

                                    <span
                                        onClick={toggleVariant}
                                        className="text-primary-300
                                        font-semibold hover:underline ml-1
                                        whitespace-nowrap"
                                    >
                                        {variant === 'LOGIN' ? 'Sign Up' : 'Login'}
                                    </span>
                                </p>
                            </div>

                            <div className="w-full relative ">
                                <HiOutlineMail
                                    className="absolute bottom-[15px] left-3 z-1 cursor-pointer text-gray-500"
                                    size={20}
                                />
                                <Input
                                    id="email"
                                    placeholder="Email"
                                    type="email"
                                    register={register}
                                    errors={errors}
                                    autofocus={true}
                                    disabled={isLoading}
                                    required={true}
                                />
                            </div>

                            {variant === 'REGISTER' && (
                                <div className="w-full relative ">
                                    <FaRegUser
                                        className="absolute bottom-4 left-3 z-1 cursor-pointer text-gray-500"
                                        size={18}
                                    />
                                    <Input
                                        id="name"
                                        placeholder="Full name"
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                        required={true}
                                    />
                                </div>
                            )}

                            {variant === 'REGISTER' && (
                                <div className="w-full relative ">
                                    <HiOutlineAtSymbol
                                        className="absolute bottom-[15px] left-3 z-1 cursor-pointer text-gray-500"
                                        size={20}
                                    />
                                    <Input
                                        id="username"
                                        placeholder="Username"
                                        type="username"
                                        register={register}
                                        errors={errors}
                                        disabled={isLoading}
                                        required={true}
                                    />
                                </div>
                            )}

                            <div className="w-full mt-4 relative mb-1">
                                <MdLockOutline
                                    className="absolute bottom-4 left-3 z-1 cursor-pointer text-gray-500"
                                    size={20}
                                />
                                <Input
                                    id="password"
                                    placeholder="Password"
                                    type={!show ? 'password' : 'text'}
                                    register={register}
                                    errors={errors}
                                    disabled={isLoading}
                                    required={true}
                                />

                                {!show ? (
                                    <AiOutlineEyeInvisible
                                        className="absolute bottom-4 right-3 z-1 cursor-pointer text-dark"
                                        size={20}
                                        onClick={() => setShow(true)}
                                    />
                                ) : (
                                    <AiOutlineEye
                                        className="absolute bottom-4 right-3 z-1 cursor-pointer text-dark"
                                        size={20}
                                        onClick={() => setShow(false)}
                                    />
                                )}
                            </div>

                            {variant === 'LOGIN' && (
                                <div className="self-end">
                                    <div className="text-base">
                                        <a
                                            href="jajvascript:void(0);"
                                            className="text-primary-300 hover:underline font-semibold "
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="!mt-8 w-full">
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full shadow-xl text-lg py-2.5 px-4 font-semibold rounded text-white bg-dark hover:bg-black hover:shadow-2xl focus:outline-none tracking-wide"
                                >
                                    {variant === 'LOGIN' ? 'Login' : 'Register'}
                                </button>
                            </div>
                        </form>

                        <h5 className="my-6 flex before:flex-1 before:border-b before:mr-2 before:my-auto before:border-gray-500 after:flex-1 after:border-b after:ml-2 after:my-auto after:border-gray-500 text-center font-Poppins text-[15px] text-black ">
                            Or connect with
                        </h5>

                        <div className="flex items-center justify-center space-x-6">
                            <FcGoogle size={40} className="cursor-pointer " onClick={() => signIn('google')} />
                            <AiFillGithub
                                size={40}
                                className="cursor-pointer  text-gray-800"
                                onClick={() => signIn('github')}
                            />
                            <FaFacebook
                                size={37}
                                className="cursor-pointer text-[#1075db]"
                                onClick={() => signIn('google')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
