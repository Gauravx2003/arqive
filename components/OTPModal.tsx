"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendEmailOTP, verifysecret } from "@/lib/actions/user.action";

const OTPModal = ({
  email,
  accountId,
}: {
  email: string;
  accountId: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const sessionId = await verifysecret({
        accountId,
        password,
      });

      if (sessionId) {
        // Success animation delay
        setTimeout(() => {
          router.push("/");
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting OTP:", error);
      setError("Invalid OTP code. Please try again.");
    }

    setIsLoading(false);
  };

  const resendOTP = async () => {
    setIsResending(true);
    setError(null);
    try {
      await sendEmailOTP({ email });
      // Show success feedback
      setTimeout(() => setIsResending(false), 2000);
    } catch {
      setError("Failed to resend OTP. Please try again.");
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.slice(0, 2) + "*".repeat(username.length - 2);
    return maskedUsername + "@" + domain;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[420px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-0 overflow-hidden z-50">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8 text-white relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <AlertDialogHeader className="text-center space-y-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-center leading-tight">
              Verify Your Email
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-100 text-sm leading-relaxed text-center">
              We&aposve sent a 6-digit code to
              <div className="font-semibold text-white mt-2 text-base">
                {maskEmail(email)}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {/* OTP Input */}
          <div className="text-center space-y-4">
            <p className="text-slate-600 text-sm font-medium">
              Enter the verification code
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={password} onChange={setPassword}>
                <InputOTPGroup className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-12 text-lg font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 bg-slate-50 focus:bg-white"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <AlertDialogFooter className="flex-col space-y-4 px-0 pb-0">
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={password.length !== 6 || isLoading}
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={20}
                    height={20}
                    className="animate-spin mr-2"
                  />
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </AlertDialogAction>

            {/* Resend OTP */}
            <div className="text-center space-y-3 pt-2">
              <p className="text-slate-500 text-sm">
                Didn&apost receive the code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={resendOTP}
                disabled={isResending}
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium transition-colors duration-200 h-auto p-2 text-sm"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={16}
                      height={16}
                      className="animate-spin mr-1"
                    />
                    Sending...
                  </div>
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>

            {/* Security Info */}
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 pt-4 pb-2">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>This code expires in 10 minutes</span>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
