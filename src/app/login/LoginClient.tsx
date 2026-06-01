"use client";

import React, { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Mail, Lock, User as UserIcon, ShieldAlert, UserCheck, Check, Loader2, X, ArrowLeft } from "lucide-react";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface OAuthProfile {
  name: string;
  email: string;
  mockLoginEmail: string;
  avatar: string;
}

const OAUTH_PROFILES: Record<"Google" | "GitHub" | "LinkedIn", OAuthProfile[]> = {
  Google: [
    { name: "Dr. Avnish Verma", email: "avnishverma718@gmail.com", mockLoginEmail: "avnish.verma@healix.com", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Avnish" },
    { name: "Dr. Priya Sharma", email: "priya.sharma@iisc.ac.in", mockLoginEmail: "priya.sharma@iisc.ac.in", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya" },
  ],
  GitHub: [
    { name: "avnish-verma", email: "github.com/avnish-verma", mockLoginEmail: "avnish.verma@healix.com", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=avnish-git" },
    { name: "priyasharma-iisc", email: "github.com/priyasharma", mockLoginEmail: "priya.sharma@iisc.ac.in", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=priya-git" },
  ],
  LinkedIn: [
    { name: "Dr. Avnish Verma", email: "linkedin.com/in/avnish-verma", mockLoginEmail: "avnish.verma@healix.com", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Avnish-in" },
    { name: "Healix Admin Account", email: "linkedin.com/company/healix-admin", mockLoginEmail: "admin@healix.com", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin-in" },
  ]
};

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

  // Simulated OAuth States
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<"Google" | "GitHub" | "LinkedIn" | null>(null);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
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

      if (isSupabaseConfigured) {
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
      } else {
        // Sync locally in sandbox
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

        setOauthSuccess(true);
        setTimeout(() => {
          handleLoginSuccess(email);
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
      const googleClientId = "244199810219-4oksv4kvm7u97n3vm98i2ad3qvhu3i64.apps.googleusercontent.com";
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

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpScreen && otpResendCountdown > 0) {
      timer = setTimeout(() => setOtpResendCountdown(otpResendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtpScreen, otpResendCountdown]);

  const handleLoginSuccess = (email: string, sessionToken?: string) => {
    if (sessionToken) {
      document.cookie = `healix_supabase_token=${sessionToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    } else {
      document.cookie = `healix_mock_user_email=${email}; path=/; max-age=${60 * 60 * 24 * 7};`;
    }
    
    router.refresh();
    if (email === "admin@healix.com") {
      router.push("/admin");
    } else {
      router.push("/projects");
    }
  };

  const handleBypassLogin = async (email: string, role: string, name: string) => {
    setLoading(true);
    setError("");

    if (isSupabaseConfigured) {
      const defaultPassword = "HealixBioLabs2026!";
      try {
        // 1. Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: defaultPassword,
        });

        if (signInError) {
          // 2. If user not found, auto register them
          if (signInError.message.includes("Invalid login credentials")) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password: defaultPassword,
              options: {
                data: {
                  full_name: name,
                }
              }
            });

            if (signUpError) {
              throw signUpError;
            }

            // Sync with local database
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name, role }),
            });
            const resData = await res.json();
            if (resData.error) throw new Error(resData.error);

            // Sign in again to get session
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password: defaultPassword,
            });

            if (retryError) throw retryError;

            if (retryData.session) {
              handleLoginSuccess(email, retryData.session.access_token);
              return;
            }
          } else {
            throw signInError;
          }
        }

        if (signInData.session) {
          handleLoginSuccess(email, signInData.session.access_token);
        }
      } catch (err: any) {
        console.error("Supabase bypass auth failed, falling back to mock:", err);
        handleLoginSuccess(email); // Fallback to mock session
      } finally {
        setLoading(false);
      }
    } else {
      // Direct mock session fallback
      handleLoginSuccess(email);
      setLoading(false);
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
      if (isSupabaseConfigured) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: emailInput.trim(),
          password: passwordInput,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.session) {
          handleLoginSuccess(emailInput.trim(), data.session.access_token);
        }
      } else {
        // Supabase is not configured, emulate successful email login via mock session
        handleLoginSuccess(emailInput.trim().toLowerCase());
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

      // OTP matches! Complete signup
      if (isSupabaseConfigured) {
        // 1. Sign up user in Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: emailInput.trim(),
          password: passwordInput,
          options: {
            data: {
              full_name: nameInput.trim(),
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // 2. Sync profile and role to local database
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.trim(),
            name: nameInput.trim(),
            role: roleInput,
            triggerWelcome: true,
          }),
        });

        const syncData = await res.json();
        if (syncData.error) {
          setError(syncData.error);
          setLoading(false);
          return;
        }

        // 3. Log user in automatically
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: emailInput.trim(),
          password: passwordInput,
        });

        if (loginError) {
          setError(loginError.message);
          setLoading(false);
          return;
        }

        if (loginData.session) {
          handleLoginSuccess(emailInput.trim(), loginData.session.access_token);
        }
      } else {
        // Supabase is not configured, create a mock user session
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.trim(),
            name: nameInput.trim(),
            role: roleInput,
            triggerWelcome: true,
          }),
        });
        
        handleLoginSuccess(emailInput.trim().toLowerCase());
      }
      setShowOtpScreen(false);
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

  const handleOAuthSubmit = () => {
    if (!activeOAuthProvider) return;
    setOauthLoading(true);
    
    // Simulate network authentication roundtrip
    setTimeout(() => {
      setOauthLoading(false);
      setOauthSuccess(true);
      
      setTimeout(() => {
        const profile = OAUTH_PROFILES[activeOAuthProvider][selectedProfileIndex];
        const persona = mockPersonas.find(p => p.email === profile.mockLoginEmail) || mockPersonas[0];
        handleBypassLogin(profile.mockLoginEmail, persona.role, persona.name);
        
        // Reset states
        setActiveOAuthProvider(null);
        setOauthSuccess(false);
        setSelectedProfileIndex(0);
      }, 900);
    }, 1300);
  };

  const mockPersonas = [
    {
      name: "Dr. Avnish Verma",
      email: "avnish.verma@healix.com",
      role: "RESEARCHER",
      desc: "Lead researcher with verified badge and publications.",
    },
    {
      name: "Dr. Priya Sharma",
      email: "priya.sharma@iisc.ac.in",
      role: "RESEARCHER",
      desc: "IISc professor, genome editing expert.",
    },
    {
      name: "Healix Admin",
      email: "admin@healix.com",
      role: "ADMIN",
      desc: "Full administrative controls and review queues.",
    },
  ];

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
                        💡 <strong className="text-slate-400">Real Inbox Delivery:</strong> To test real email deliveries (OTP & Welcome Letter) directly to an inbox, use <span className="text-research-blue font-semibold">office@healix-technologies.com</span>. Other addresses will show an interactive on-screen bypass notice.
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

                  {/* Single Sign-On (SSO) Support */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Google OAuth Button */}
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setActiveOAuthProvider("Google");
                        setSelectedProfileIndex(0);
                      }}
                      className="flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-slate-300 hover:text-white"
                    >
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                      </svg>
                      <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">Google</span>
                    </motion.button>

                    {/* GitHub OAuth Button */}
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setActiveOAuthProvider("GitHub");
                        setSelectedProfileIndex(0);
                      }}
                      className="flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-slate-300 hover:text-white"
                    >
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                      </svg>
                      <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">GitHub</span>
                    </motion.button>

                    {/* LinkedIn OAuth Button */}
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setActiveOAuthProvider("LinkedIn");
                        setSelectedProfileIndex(0);
                      }}
                      className="flex flex-col items-center justify-center bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-slate-300 hover:text-white"
                    >
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                      </svg>
                      <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">LinkedIn</span>
                    </motion.button>
                  </div>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-800/80"></div>
                    <span className="flex-shrink mx-3.5 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
                      Quick Bypass Selectors
                    </span>
                    <div className="flex-grow border-t border-slate-800/80"></div>
                  </div>

                  {/* Persona Quick Selectors */}
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {mockPersonas.map((persona) => (
                      <motion.button
                        whileHover={{ scale: 1.01, x: 2 }}
                        whileTap={{ scale: 0.99 }}
                        key={persona.email}
                        onClick={() => handleBypassLogin(persona.email, persona.role, persona.name)}
                        disabled={loading}
                        className="w-full text-left bg-slate-900/20 hover:bg-slate-900 border border-slate-800/80 hover:border-primary-yellow/30 p-2.5 rounded-xl transition-all duration-200 flex items-start space-x-2.5 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-primary-yellow shrink-0 mt-0.5" />
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300">{persona.name}</span>
                            <span className="text-[8px] uppercase tracking-wider text-accent-blue font-bold">
                              {persona.role}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-500 font-medium">{persona.email}</p>
                        </div>
                      </motion.button>
                    ))}
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
                  {activeOAuthProvider === "GitHub" && (
                    <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
                    </svg>
                  )}
                  {activeOAuthProvider === "LinkedIn" && (
                    <svg className="w-6 h-6 fill-current text-[#0A66C2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
                    {activeOAuthProvider === "Google" ? (
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
                    ) : (
                      <>
                        {/* Permissions list */}
                        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3 text-[10px] text-slate-400 leading-relaxed space-y-1">
                          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Permissions requested:</span>
                          <p>• Access your public profile details</p>
                          <p>• Fetch verified primary email address</p>
                        </div>

                        {/* Profile selector dropdown */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                            Select Sandbox Profile
                          </label>
                          <div className="space-y-2">
                            {OAUTH_PROFILES[activeOAuthProvider].map((profile, i) => {
                              const isSelected = selectedProfileIndex === i;
                              return (
                                <button
                                  key={profile.email}
                                  onClick={() => setSelectedProfileIndex(i)}
                                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected 
                                      ? "bg-slate-900 border-accent-blue/50 text-white" 
                                      : "bg-slate-950/40 border-slate-800 hover:bg-slate-900 hover:border-slate-800 text-slate-400"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={profile.avatar}
                                      alt={profile.name}
                                      className="w-7 h-7 rounded-full border border-slate-800 shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <p className={`text-xs font-bold ${isSelected ? "text-slate-200" : "text-slate-400"}`}>{profile.name}</p>
                                      <p className="text-[9px] truncate max-w-[170px]">{profile.email}</p>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="w-4 h-4 rounded-full bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center text-accent-blue shrink-0">
                                      <Check className="w-2.5 h-2.5" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setActiveOAuthProvider(null)}
                            className="bg-slate-950/60 border border-slate-800 hover:bg-slate-950 hover:border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleOAuthSubmit}
                            className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center shadow-sm shadow-blue-500/5"
                          >
                            Authorize
                          </button>
                        </div>
                      </>
                    )}
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
