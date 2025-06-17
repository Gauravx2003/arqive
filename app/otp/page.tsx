"use client";
import { useState } from "react";

export default function OTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setMessage("Sending...");
    const res = await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStep(2);
      setMessage("OTP sent to email.");
    } else {
      setMessage("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    setMessage("Verifying...");
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      setMessage("✅ OTP verified. You're logged in!");
    } else {
      const data = await res.json();
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Custom OTP Login</h1>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Your email"
            className="border p-2 w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={sendOtp}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={verifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      <p className="mt-4 text-sm text-gray-700">{message}</p>
    </div>
  );
}
