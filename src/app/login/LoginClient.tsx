"use client";

import React, { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Mail, Lock, User as UserIcon, ShieldAlert, UserCheck, Check, Loader2, X, ArrowLeft } from "lucide-react";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// OAUTH_PROFILES removed for production

export default function LoginClient() {
  const router = useRouter();
  
  // Tabs: 'signin' or 'signup'
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Inputs
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState("RESEARCHER");
  
  // OTP Verification States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [serverOtpHash, setServerOtpHash] = useState("");
  const [otpResendCountdown, setOtpResendCountdown] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [sandboxOtpBypass, setSandboxOtpBypass] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClerkEnabled, setIsClerkEnabled] = useState(false);

  // OAuth States
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<"Google" | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthSuccess, setOauthSuccess] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (key && key !== "pk_test_placeholder" && key.startsWith("pk_")) {
      setIsClerkEnabled(true);
    }

    // Load Google Identity Services SDK script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    if (!idToken) return;

    setOauthLoading(true);
    setError("");

    try {
      // Decode JWT token payload
      const base64Url = idToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      const email = decoded.email;
      const name = decoded.name || email.split("@")[0];

      if (!isSupabaseConfigured) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error: authError } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (authError) throw authError;

      // Sync profile to database
      const syncRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          role: "RESEARCHER",
          triggerWelcome: true,
        }),
      });
      const syncData = await syncRes.json();
      if (syncData.error) throw new Error(syncData.error);

      if (data.session) {
        setOauthSuccess(true);
        setTimeout(() => {
          handleLoginSuccess(email, data.session.access_token);
          setActiveOAuthProvider(null);
          setOauthSuccess(false);
        }, 900);
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError(err.message || "Google Sign-In failed.");
      setOauthLoading(false);
    }
  };

  useEffect(() => {
    if (activeOAuthProvider === "Google" && typeof window !== "undefined" && (window as any).google) {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "244199810219-4oksv4kvm7u97n3vm98i2ad3qvhu3i64.apps.googleusercontent.com";
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button-container"),
          { theme: "outline", size: "large", width: 280 }
        );
      } catch (err) {
        console.error("Failed to render Google Sign-In button:", err);
      }
    }
  }, [activeOAuthProvider]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const checkRedirectSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.email) {
          const email = session.user.email;
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split("@")[0];

          // Sync user to database
          await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name,
              role: "RESEARCHER",
              triggerWelcome: true,
            }),
          });

          handleLoginSuccess(email, session.access_token);
        }
      } catch (err) {
        console.error("Failed to check Supabase redirect session:", err);
      }
    };

    checkRedirectSession();
  }, []);

  // handleRealOAuthSignIn removed

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpScreen && otpResendCountdown > 0) {
      timer = setTimeout(() => setOtpResendCountdown(otpResendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtpScreen, otpResendCountdown]);

  const handleLoginSuccess = (email: string, sessionToken: string) => {
    document.cookie = `healix_supabase_token=${sessionToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    
    router.refresh();
    if (email === "admin@healix.com") {
      router.push("/admin");
    } else {
      router.push("/projects");
    }
  };

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (!isSupabaseConfigured) {
        setError("Supabase authentication is not configured in this environment.");
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      });

      if (authError) {
        if (
          authError.message.toLowerCase().includes("email not confirmed") ||
          authError.message.toLowerCase().includes("not confirmed")
        ) {
          const adminRes = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: emailInput.trim(),
              password: passwordInput,
              name: emailInput.trim().split("@")[0],
              role: "RESEARCHER",
            }),
          });
          const adminData = await adminRes.json();

          if (adminData.accessToken) {
            handleLoginSuccess(emailInput.trim(), adminData.accessToken);
            return;
          } else if (adminData.success) {
            setError("Account confirmed. Please log in using your password.");
            setLoading(false);
            return;
          }
        }

        if (authError.message.toLowerCase().includes("invalid login credentials")) {
          setError("Incorrect email or password. Please check your credentials.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        // Sync user to local DB
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.trim(),
            name: data.session.user?.user_metadata?.full_name || emailInput.trim().split("@")[0],
            role: "RESEARCHER",
          }),
        }).catch(() => {});

        handleLoginSuccess(emailInput.trim(), data.session.access_token);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Initiate Sign Up - Sends OTP verification code via email first
  const handleRealSignUpInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput || !nameInput.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    if (passwordInput.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Send OTP email via backend API
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim(), name: nameInput.trim() }),
      });

      const data = await res.json();
      if (data.error && !data.devOtp) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.devOtp) {
        setSandboxOtpBypass(data.devOtp);
      } else {
        setSandboxOtpBypass("");
      }

      setServerOtpHash(data.otpHash);
      setShowOtpScreen(true);
      setOtpResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      // Focus first input
      setTimeout(() => document.getElementById("otp-input-0")?.focus(), 100);
    } catch (err: any) {
      setError(err.message || "Failed to trigger verification code email.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration
  const handleVerifyOtpAndSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Hash the entered OTP client-side using Web Crypto API
      const msgBuffer = new TextEncoder().encode(enteredOtp + "healix-biolabs-otp-salt-2026");
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

      if (hashHex !== serverOtpHash) {
        setError("Invalid verification code. Please try again.");
        setLoading(false);
        return;
      }

      // OTP matches — our email verification is complete.
      // Use server-side admin endpoint to create a pre-confirmed Supabase user
      // (bypasses Supabase's own email confirmation, since we already verified via OTP)
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
          name: nameInput.trim(),
          role: roleInput,
        }),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok || signupData.error) {
        setError(signupData.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setShowOtpScreen(false);

      if (signupData.accessToken) {
        // Admin confirmed + session created successfully
        handleLoginSuccess(emailInput.trim(), signupData.accessToken);
      } else {
        setError("Registration complete. Please log in using the secure portal.");
        setShowOtpScreen(false);
        setActiveTab("signin");
      }
    } catch (err: any) {
      setError(err.message || "Registration verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim(), name: nameInput.trim() }),
      });
      const data = await res.json();
      if (data.error && !data.devOtp) throw new Error(data.error);

      if (data.devOtp) {
        setSandboxOtpBypass(data.devOtp);
      } else {
        setSandboxOtpBypass("");
      }

      setServerOtpHash(data.otpHash);
      setOtpResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setError("");
      // Focus first input
      setTimeout(() => document.getElementById("otp-input-0")?.focus(), 100);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpDigitChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newDigits = [...otpDigits];
      newDigits[index] = value;
      setOtpDigits(newDigits);

      // Focus next if filled
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleOtpDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }
    }
  };

  // handleOAuthSubmit and mockPersonas removed

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Graphic Canvas */}
      <ScientificBackground />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-[#0B0F19]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Link href="/" className="relative group flex flex-col items-center">
              <div className="relative">
                {/* Vibrant ambient glow ring behind the logo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue via-research-blue to-primary-yellow rounded-full blur opacity-30 group-hover:opacity-60 transition duration-700" />
                <img
                  src="/logo.png"
                  alt="Healix BioLabs"
                  className="relative w-16 h-16 rounded-full object-cover border border-slate-800/80 shadow-lg bg-slate-950 p-1 transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xl font-heading font-bold text-white mt-3 tracking-tight group-hover:text-primary-yellow/90 transition-colors">
                Healix <span className="text-primary-yellow group-hover:text-white transition-colors">BioLabs</span>
              </span>
            </Link>
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-white tracking-tight">
            Secure Entry Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access India's biomedical research network.
          </p>
        </div>

        {isClerkEnabled ? (
          <SignIn
            routing="hash"
            appearance={{
              elements: {
                cardBox: "w-full",
                card: "bg-[#0B0F19]/90 border border-slate-800 rounded-3xl shadow-2xl p-6 backdrop-blur-md",
                headerTitle: "text-white font-heading font-extrabold text-lg",
                headerSubtitle: "text-slate-400 text-xs",
                socialButtonsBlockButton: "bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all",
                formButtonPrimary: "bg-accent-blue hover:bg-accent-blue/90 text-white font-bold py-2.5 rounded-xl transition-all",
                formFieldLabel: "text-slate-400 text-[10px] font-bold uppercase tracking-wider",
                formFieldInput: "bg-slate-900/50 border border-slate-800 text-white rounded-xl py-2.5 text-sm",
                footerActionLink: "text-accent-blue hover:text-white font-bold transition-all",
                dividerText: "text-slate-500 text-[10px] font-bold uppercase tracking-widest",
                dividerLine: "bg-slate-800",
                identityPreviewText: "text-white",
                formResendCodeLink: "text-accent-blue hover:text-white font-bold",
              }
            }}
          />
        ) : (
          <div className="space-y-4">

            <AnimatePresence mode="wait">
              {showOtpScreen ? (
                // OTP Verification View Card
                <motion.div
                  key="otp-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowOtpScreen(false);
                        setError("");
                      }}
                      className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </motion.button>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Go Back
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Verify Your Email</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We have dispatched a 6-digit verification code to <strong className="text-research-blue">{emailInput}</strong>. Enter it below to complete registration.
                    </p>
                  </div>

                  {sandboxOtpBypass && (
                    <div className="text-[11.5px] text-primary-yellow bg-yellow-950/20 border border-yellow-800/40 rounded-2xl p-4 font-medium leading-relaxed space-y-2">
                      <span className="font-bold block uppercase tracking-wider text-xs text-primary-yellow">
                        Resend Sandbox Notice
                      </span>
                      <p className="text-slate-400 text-[10.5px] leading-relaxed">
                        Since <strong className="text-slate-300">{emailInput}</strong> is not verified on the Resend account dashboard, the API failed to deliver the email to your inbox.
                      </p>
                      <p className="text-slate-400 text-[10.5px] leading-relaxed">
                        For local testing, use the developer code below to bypass validation:
                      </p>
                      <div className="flex items-center justify-between bg-slate-950/85 px-3.5 py-2.5 rounded-xl border border-slate-800 mt-1">
                        <span className="font-mono text-white font-extrabold tracking-widest text-sm">{sandboxOtpBypass}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const digits = sandboxOtpBypass.split("");
                            setOtpDigits(digits);
                            setTimeout(() => {
                              const lastInput = document.getElementById("otp-input-5") as HTMLInputElement | null;
                              if (lastInput) {
                                lastInput.focus();
                              }
                            }, 50);
                          }}
                          className="text-[9.5px] uppercase tracking-wider text-accent-blue hover:text-white font-bold cursor-pointer transition-colors"
                        >
                          Auto-fill Code
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-xs text-rose-455 bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 font-semibold text-center">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtpAndSignUp} className="space-y-5">
                    {/* 6 Digit Inputs */}
                    <div className="flex justify-between gap-2.5">
                      {otpDigits.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-input-${i}`}
                          type="text"
                          maxLength={1}
                          pattern="[0-9]"
                          inputMode="numeric"
                          value={digit}
                          onKeyDown={(e) => handleOtpDigitKeyDown(e, i)}
                          onChange={(e) => handleOtpDigitChange(e.target.value, i)}
                          className="w-12 h-12 bg-slate-900/40 border border-slate-800 text-white text-center text-xl font-bold rounded-xl focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                        />
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-500/5"
                    >
                      <span>{loading ? "Verifying..." : "Verify & Complete Registration"}</span>
                      <Check className="w-4 h-4" />
                    </motion.button>
                  </form>

                  {/* Resend OTP details */}
                  <div className="text-center pt-2">
                    {otpResendCountdown > 0 ? (
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Resend code in {otpResendCountdown} seconds
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resendLoading}
                        className="text-[10px] text-accent-blue hover:text-white disabled:text-slate-650 font-bold uppercase tracking-widest cursor-pointer transition-colors"
                      >
                        {resendLoading ? "Resending..." : "Resend Verification Code"}
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                // Standard Credentials Form Card
                <motion.div
                  key="form-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* Tabs for Login vs Register */}
                  <div className="relative flex bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signin");
                        setError("");
                      }}
                      className="relative z-10 flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-200 data-[active=true]:text-white"
                      data-active={activeTab === "signin"}
                    >
                      {activeTab === "signin" && (
                        <motion.span
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-lg -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("signup");
                        setError("");
                      }}
                      className="relative z-10 flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-200 data-[active=true]:text-white"
                      data-active={activeTab === "signup"}
                    >
                      {activeTab === "signup" && (
                        <motion.span
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-lg -z-10 shadow-sm"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      Register
                    </button>
                  </div>

                  {error && (
                    <div className="text-xs text-rose-455 bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 font-semibold text-center">
                      {error}
                    </div>
                  )}

                  {/* Email Form */}
                  <form onSubmit={activeTab === "signin" ? handleRealLogin : handleRealSignUpInitiate} className="space-y-3.5">
                    
                    <AnimatePresence initial={false}>
                      {activeTab === "signup" && (
                        <motion.div
                          key="signup-name"
                          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="space-y-1"
                        >
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                            Full Name
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                              <UserIcon className="w-3.5 h-3.5" />
                            </span>
                            <input
                              type="text"
                              placeholder="Dr. Rajesh Patel"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full bg-slate-900/40 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                            />
                          </div>
                          <div className="h-1.5" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="email"
                          placeholder="Enter email (e.g. rajesh@healix.com)"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full bg-slate-900/40 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                        />
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal mt-1.5 px-0.5">
                        💡 <strong className="text-slate-400">Real Inbox Delivery:</strong> To test real email deliveries (OTP & Welcome Letter) directly to an inbox, use <span className="text-research-blue font-semibold">office@biolabsresearch-healix.com</span>. Other addresses will show an interactive on-screen bypass notice.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                        Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                        <input
                          type="password"
                          placeholder="Enter secure password"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full bg-slate-900/40 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-2.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                        />
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {activeTab === "signup" && (
                        <motion.div
                          key="signup-role"
                          initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="space-y-1"
                        >
                          <div className="h-1.5" />
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                            Researcher Role
                          </label>
                          <select
                            value={roleInput}
                            onChange={(e) => setRoleInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl py-2.5 px-3.5 text-xs font-semibold focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                          >
                            <option value="RESEARCHER">Lead Researcher</option>
                            <option value="STUDENT">Academic Student / Intern</option>
                            <option value="INSTITUTION">Institutional Affiliate</option>
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-500/5 mt-2"
                    >
                      <span>{loading ? "Processing..." : activeTab === "signin" ? "Login" : "Register"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </form>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-800/80"></div>
                    <span className="flex-shrink mx-3.5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                      Or Continue With
                    </span>
                    <div className="flex-grow border-t border-slate-800/80"></div>
                  </div>


                  {/* Google OAuth — single full-width button */}
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setActiveOAuthProvider("Google");
                      }}
                      className="flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-slate-700 hover:border-blue-500/50 py-3 rounded-xl transition-all duration-200 cursor-pointer text-white"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span className="text-sm font-bold tracking-wide">Continue with Google</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </motion.div>

      {/* Simulated OAuth Modal Overlay */}
      <AnimatePresence>
        {activeOAuthProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!oauthLoading && !oauthSuccess) setActiveOAuthProvider(null);
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* OAuth consent box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-200"
            >
              {/* Close Button */}
              {!oauthLoading && !oauthSuccess && (
                <button
                  type="button"
                  onClick={() => setActiveOAuthProvider(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Provider Logo Header */}
              <div className="flex flex-col items-center text-center mt-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-md">
                  {activeOAuthProvider === "Google" && (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                  )}
                </div>
                <h3 className="text-md font-bold mt-3 text-white">
                  Authorize with {activeOAuthProvider}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 max-w-[220px]">
                  Healix BioLabs wishes to link with your {activeOAuthProvider} credentials.
                </p>
              </div>

              {/* Simulated Consent Status Screen */}
              <AnimatePresence mode="wait">
                {oauthSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white mt-3">Authentication Successful</p>
                    <p className="text-[10px] text-slate-500 font-medium">Redirecting to your session portal...</p>
                  </motion.div>
                ) : oauthLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6"
                  >
                    <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
                    <p className="text-xs font-bold text-white mt-3">Verifying Credentials...</p>
                    <p className="text-[10px] text-slate-500 font-medium">Establishing secure OAuth handshake</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 leading-relaxed text-center w-full">
                        <p>Click the official Google button below to sign in using your Google account in our secure authentication environment.</p>
                      </div>
                      <div id="google-signin-button-container" className="my-2 min-h-[40px] w-full flex justify-center" />
                      <button
                        type="button"
                        onClick={() => setActiveOAuthProvider(null)}
                        className="w-full bg-slate-950/60 border border-slate-800 hover:bg-slate-950 hover:border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
