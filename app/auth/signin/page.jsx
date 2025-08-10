"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (res.ok) {
            router.push("/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-6">

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500">Login to your account</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="relative mt-1">
                            <Mail className="absolute top-2.5 left-3 text-gray-400" size={18} />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <Lock className="absolute top-2.5 left-3 text-gray-400" size={18} />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="form-checkbox" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold">
                        <LogIn size={18} className="mr-2" />
                        Login
                    </Button>
                </form>

                <div className="text-center text-gray-500">or</div>

                <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2"
                >
                    <Chrome size={20} />
                    Login with Google
                </Button>

                <div className="text-center pt-2 text-sm text-gray-600">
                    Don’t have an account?
                    <a href="/auth/signup" className="ml-1 text-blue-600 hover:underline">Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
