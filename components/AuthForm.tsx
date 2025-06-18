"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { SignIn, signInWithPassword } from "@/lib/actions/user.action";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateAccount } from "@/lib/actions/user.action";
import OTPModal from "./OTPModal";
import { useRouter } from "next/navigation";

type FormType = "sign-in" | "sign-up";
type SignInMethod = "otp" | "password";

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

// Placeholder avatar options
const avatarOptions = [
  "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436180.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-punk-hair-jacket_23-2149436198.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869119.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303045.jpg?ga=GA1.1.1990715703.1750079039&w=740",
  "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?ga=GA1.1.1990715703.1750079039&w=740",
];

const authformSchema = (formType: FormType) => {
  return z.object({
    fullname:
      formType === "sign-up"
        ? z.string().min(2, {
            message: "Full Name must be at least 2 characters.",
          })
        : z.string().optional(),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password:
      formType === "sign-up"
        ? z.string().min(8, {
            message: "Password must be at least 8 characters.",
          })
        : z.string().optional(),
    avatar:
      formType === "sign-up"
        ? z.string().min(1, {
            message: "Please select an avatar.",
          })
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [signInMethod, setSignInMethod] = useState<SignInMethod>("password");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formSchema = authformSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      avatar: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === "sign-up") {
        const user = await CreateAccount({
          email: values.email,
          fullname: values.fullname || "",
          avatar: values.avatar || "",
          password: values.password || "",
        });
        setAccountId(user.accountId);
      } else {
        // Sign-in logic
        if (signInMethod === "password") {
          if (!values.password) {
            setError("Password is required for password sign-in.");
            return;
          }

          const result = await signInWithPassword({
            email: values.email,
            password: values.password,
          });

          if (result.sessionId) {
            router.push("/");
          }
        } else {
          // OTP sign-in
          const user = await SignIn({ email: values.email });
          setAccountId(user.accountId);
        }
      }
    } catch (error: unknown) {
      let message = "An unknown error occurred.";
      if (error instanceof Error) {
        message = error.message;
      } else if (isErrorWithMessage(error)) {
        message = error.message;
      }

      if (message.includes("User already exists.")) {
        setError("This email is already registered.");
      } else if (message.includes("User not found. Please sign up first.")) {
        setError("This email is not registered.");
      } else if (message.includes("Invalid credentials")) {
        setError("Invalid email or password.");
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {type === "sign-in" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-slate-600 text-base">
            {type === "sign-in"
              ? "Sign in to access your files"
              : "Join Arqive to start managing your files"}
          </p>
        </div>

        {/* Sign-in Method Toggle */}
        {type === "sign-in" && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-3">
              Choose sign-in method:
            </p>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSignInMethod("password")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  signInMethod === "password"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                🔑 Password
              </button>
              <button
                type="button"
                onClick={() => setSignInMethod("otp")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  signInMethod === "otp"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                📧 Email OTP
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="pl-12 h-12 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-slate-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                        className="pl-12 h-12 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            {(type === "sign-up" ||
              (type === "sign-in" && signInMethod === "password")) && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={
                            type === "sign-up"
                              ? "Create a strong password"
                              : "Enter your password"
                          }
                          {...field}
                          className="pl-12 pr-12 h-12 border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          <svg
                            className="h-5 w-5 text-slate-400 hover:text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {showPassword ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            )}
                          </svg>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                    {type === "sign-up" && (
                      <p className="text-xs text-slate-500 mt-1">
                        Password must be at least 8 characters long
                      </p>
                    )}
                  </FormItem>
                )}
              />
            )}

            {/* Avatar Selection - Only for sign-up */}
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Choose Your Avatar
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                        {avatarOptions.map((avatarUrl, index) => (
                          <div
                            key={index}
                            className={`relative cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                              field.value === avatarUrl
                                ? "ring-2 ring-indigo-500 ring-offset-2 shadow-lg"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => field.onChange(avatarUrl)}
                          >
                            <div className="aspect-square rounded-full overflow-hidden bg-white border-2 border-slate-200">
                              <Image
                                src={avatarUrl}
                                alt={`Avatar option ${index + 1}`}
                                width={60}
                                height={60}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {field.value === avatarUrl && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <span className="flex items-center justify-center">
                {type === "sign-in"
                  ? signInMethod === "password"
                    ? "Sign In with Password"
                    : "Send OTP"
                  : "Create Account"}
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loading"
                    width={20}
                    height={20}
                    className="ml-2 animate-spin"
                  />
                )}
              </span>
            </Button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Switch Form Type */}
            <div className="text-center pt-4">
              <p className="text-slate-600 text-sm">
                {type === "sign-in"
                  ? "Don't have an account yet?"
                  : "Already have an account?"}
                <Link
                  href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                  className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 hover:underline"
                >
                  {type === "sign-in" ? "Sign Up" : "Sign In"}
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">
                  Secure Authentication
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
              <svg
                className="h-4 w-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>256-bit SSL encryption</span>
            </div>
          </form>
        </Form>
      </div>

      {/* OTP Modal - Only show for OTP sign-in or sign-up */}
      {accountId && (type === "sign-up" || signInMethod === "otp") && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
