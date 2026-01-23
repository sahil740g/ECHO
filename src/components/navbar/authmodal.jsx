import {useState,useEffect} from "react";
import {createPortal} from "react-dom";
import {X,Mail,Lock,User, Github } from "lucide-react";
import {useAuth} from "../../context/authcontext";
const AuthModal=({isOpen,onClose})=>{
    const [isLogin,setIsLogin]=useState(true);
    const {login}=useAuth();
    useEffect(()=>{
        if (isOpen) setIsLogin(true);
    },[isOpen]);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("");
    if (!isOpen) return null;
    const handleSubmit=(e)=>{
        e.preventDefault();
        login();
        onClose();
    };
    const handleSocialLogin=(provider)=>{
        console.log(`Logging in with ${provider}`);
        login();
        onClose();
    };
    return createPortal(
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className="bg-[#161b22] border border-white/10 rounded-xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white transition">
                    <X size={20}/>
                </button>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isLogin ? "Welcome back":"Create an account"}
                    </h2>
                    <p className="text-zinc-400 text-sm">
                        {isLogin?"Enter your details to sign in":"Enter your details to sign up"}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        onClick={()=>handleSocialLogin('Google')}
                        className="flex items-center justify-center gap-2 bg-[#0d1117] border border-white/10 p-2.5 rounded-lg text-white hover:bg-white/5 transition text-sm font-medium">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button
                        onClick={() => handleSocialLogin('GitHub')}
                        className="flex items-center justify-center gap-2 bg-[#0d1117] border border-white/10 p-2.5 rounded-lg text-white hover:bg-white/5 transition text-sm font-medium">
                        <Github size={20} />
                        GitHub
                    </button>
                </div>
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#161b22] text-zinc-500">Or continue with</span>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
                                    required={!isLogin}/>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-[#0d1117] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition text-sm"
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium transition cursor-pointer mt-2">
                        {isLogin?"Sign In":"Sign Up"}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm text-zinc-400">
                    {isLogin?"Don't have an account?":"Already have an account?"}
                    <button onClick={()=>setIsLogin(!isLogin)} className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                        {isLogin?"Sign up":"Log in"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}
export default AuthModal;