import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Mail,
  Lock,
  User,
  Github,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/authcontext";
import { supabase } from "../../lib/supabase";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // 'login', 'signup', 'forgot', 'reset-sent', 'verify-email'
  const { loginWithProvider, signUpWithEmail, loginWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode("login");
      setEmail("");
      setPassword("");
      setName("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await loginWithEmail(email, password);
      if (error) throw error;
      onClose();
    } catch (err) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error, data } = await signUpWithEmail(email, password, name);
      if (error) throw error;

      // Check if email confirmation is required
      if (data?.user && !data.user.email_confirmed_at) {
        setMode("verify-email");
      } else {
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      });
      if (error) throw error;
      setMode("reset-sent");
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError("");
    const { error } = await loginWithProvider(provider);
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Don't close - OAuth will redirect
  };

  // Reset password sent confirmation
  if (mode === "reset-sent") {
    return createPortal(
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
        <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Check your email
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              We've sent a password reset link to{" "}
              <span className="text-white">{email}</span>
            </p>
            <button
              onClick={() => setMode("login")}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // Email verification prompt
  if (mode === "verify-email") {
    return createPortal(
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
        <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
          >
            <X size={20} />
          </button>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-blue-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Verify your email
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              We've sent a verification link to{" "}
              <span className="text-white">{email}</span>. Please check your
              inbox and click the link to activate your account.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium transition"
            >
              Got it
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // Forgot password form
  if (mode === "forgot") {
    return createPortal(
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
        <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
          >
            <X size={20} />
          </button>

          <button
            onClick={() => setMode("login")}
            className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft size={16} />
            Back to login
          </button>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Reset password
            </h2>
            <p className="text-zinc-400 text-sm">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        </div>
      </div>,
      document.body,
    );
  }

  // Main login/signup form
  return createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-zinc-400 text-sm">
            {mode === "login"
              ? "Enter your details to sign in"
              : "Enter your details to sign up"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#0d1117] border border-white/10 p-2.5 rounded-lg text-white hover:bg-white/5 transition text-sm font-medium disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.04-3.71 1.04-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            onClick={() => handleSocialLogin("github")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#0d1117] border border-white/10 p-2.5 rounded-lg text-white hover:bg-white/5 transition text-sm font-medium disabled:opacity-50"
          >
            <Github size={20} />
            GitHub
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#161b22] text-zinc-500">
              Or continue with
            </span>
          </div>
        </div>

        <form
          onSubmit={mode === "login" ? handleEmailLogin : handleEmailSignup}
          className="space-y-4"
        >
          {mode === "signup" && (
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
              required
            />
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AuthModal;
