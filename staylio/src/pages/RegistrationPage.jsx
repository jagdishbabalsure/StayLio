import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const RegistrationPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Step 1: Email, Step 2: OTP, Step 3: Details
    const [step, setStep] = useState(1);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hotelImages = [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2049&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'password') calculatePasswordStrength(value);
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: 'Valid email is required' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            await authService.initiateSignup(email);
            setStep(2);
            toast.success("Verification code sent to " + email);
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setErrors({ otp: 'Enter 6-digit code' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            await authService.verifySignupOtp(email, otp);
            setStep(3);
            toast.success("Email verified successfully!");
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: Complete Registration
    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Required';
        if (!formData.phone.trim()) newErrors.phone = 'Required';
        if (!formData.password) newErrors.password = 'Required';
        else if (formData.password.length < 6) newErrors.password = 'Min 6 chars';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // Pass OTP as well to prove verification
            const registerData = {
                ...formData,
                email,
                otp
            };
            const response = await authService.register(registerData);
            if (response.success) {
                setSuccessMessage('Account created! Redirecting...');
                toast.success('Welcome to StayLio!');
                if (response.user) {
                    login(response.user);
                    setTimeout(() => navigate('/dashboard'), 2000);
                }
            }
        } catch (error) {
            setErrors({ general: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-red-500';
        if (passwordStrength <= 3) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return '';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 4) return 'Medium';
        return 'Strong';
    };

    // Parallax Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const layer1X = useTransform(x, [-100, 100], [-20, 20]);
    const layer1Y = useTransform(y, [-100, 100], [-20, 20]);
    const cardX = useTransform(x, [-100, 100], [-5, 5]);
    const cardY = useTransform(y, [-100, 100], [-5, 5]);

    const handleMouseMove = (event) => {
        x.set((event.clientX / window.innerWidth - 0.5) * 200);
        y.set((event.clientY / window.innerHeight - 0.5) * 200);
    };

    return (
        <div
            className="min-h-screen w-full flex bg-[#030014] overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Left Side - Form Section */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 lg:p-6 z-20 h-screen overflow-y-auto custom-scrollbar">

                {/* Background Effects */}
                <motion.div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ x: layer1X, y: layer1Y }}>
                    <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    className="w-full max-w-[500px] bg-[#13111C]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden z-10"
                    style={{ x: cardX, y: cardY }}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Inner Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <motion.h1
                                className="text-3xl font-bold text-white mb-2 tracking-tight"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="bg-clip-text ">Create Account</span>
                            </motion.h1>
                            <motion.p className="text-purple-200/60 font-light text-sm">
                                {step === 1 && "Start with your email"}
                                {step === 2 && "Enter verification code"}
                                {step === 3 && "Complete your profile"}
                            </motion.p>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex justify-center mb-8 gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= i ? 'bg-purple-500' : 'bg-white/10'}`}></div>
                            ))}
                        </div>

                        {/* STEP 1: Email Input */}
                        {step === 1 && (
                            <form onSubmit={handleSendOtp} className="space-y-5">
                                <motion.div className="space-y-1.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="text-xs font-semibold text-gray-400 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}) }}
                                            placeholder="name@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-400 text-xs ml-1 mt-1">{errors.email}</p>}
                                </motion.div>
                                {errors.general && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{errors.general}</div>}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#8400ff] hover:bg-[#7000d6] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center"
                                >
                                    {isLoading ? 'Sending Code...' : 'Verify Email'}
                                </button>
                            </form>
                        )}

                        {/* STEP 2: OTP Verification */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyOtp} className="space-y-5">
                                <motion.div className="space-y-1.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <label className="text-xs font-semibold text-gray-400 ml-1">Verification Code</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                                setOtp(val);
                                                if (errors.otp) setErrors({});
                                            }}
                                            placeholder="000000"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium tracking-widest text-lg"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 text-right mt-1 cursor-pointer hover:text-purple-400" onClick={() => setStep(1)}>Change Email?</p>
                                    {errors.otp && <p className="text-red-400 text-xs ml-1 mt-1">{errors.otp}</p>}
                                </motion.div>
                                {errors.general && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{errors.general}</div>}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#8400ff] hover:bg-[#7000d6] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center"
                                >
                                    {isLoading ? 'Verifying...' : 'Confirm Code'}
                                </button>
                            </form>
                        )}


                        {/* STEP 3: Full Registration */}
                        {step === 3 && (
                            <form onSubmit={handleRegister} className="space-y-5">
                                {/* Verified Email Display */}
                                <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-3 rounded-xl mb-4">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div className="flex-1">
                                        <p className="text-xs text-green-200/60">Verified Email</p>
                                        <p className="text-sm font-medium text-green-100">{email}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div className="space-y-1.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                        <label className="text-xs font-semibold text-gray-400 ml-1">First Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                                            />
                                        </div>
                                        {errors.firstName && <p className="text-red-400 text-xs ml-1 mt-1">{errors.firstName}</p>}
                                    </motion.div>
                                    <motion.div className="space-y-1.5" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                                        <label className="text-xs font-semibold text-gray-400 ml-1">Last Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                                            />
                                        </div>
                                        {errors.lastName && <p className="text-red-400 text-xs ml-1 mt-1">{errors.lastName}</p>}
                                    </motion.div>
                                </div>

                                <motion.div className="space-y-1.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                    <label className="text-xs font-semibold text-gray-400 ml-1">Phone</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 8459946986"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-400 text-xs ml-1 mt-1">{errors.phone}</p>}
                                </motion.div>

                                <motion.div className="space-y-1.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                    <label className="text-xs font-semibold text-gray-400 ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Create password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                                    </div>
                                    {errors.password && <p className="text-red-400 text-xs ml-1 mt-1">{errors.password}</p>}
                                    {formData.password && (
                                        <div className="mt-2 flex items-center gap-2 px-1">
                                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{getPasswordStrengthText()}</span>
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div className="space-y-1.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                    <label className="text-xs font-semibold text-gray-400 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 w-5 h-5 transition-colors" />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Repeat password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-400 text-xs ml-1 mt-1">{errors.confirmPassword}</p>}
                                </motion.div>

                                {errors.general && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-200 text-sm text-center font-medium">{errors.general}</motion.div>}

                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#8400ff] hover:bg-[#7000d6] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center space-x-2 group relative overflow-hidden mt-6"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <span className="relative z-10 text-base font-semibold">{isLoading ? 'Creating Account...' : 'Complete Signup'}</span>
                                    {!isLoading && <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />}
                                </motion.button>
                            </form>
                        )}

                        <motion.p
                            className="text-center text-gray-400 text-sm mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Already have an account?{' '}
                            <Link to="/login" className="text-white font-medium hover:text-purple-300 transition-colors">
                                Sign In
                            </Link>
                        </motion.p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Image Slideshow Section */}
            <div className="hidden lg:block w-1/2 relative overflow-hidden z-10 h-screen">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentImageIndex}
                        className="absolute inset-0 w-full h-full"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        <img
                            src={hotelImages[currentImageIndex]}
                            alt="Luxury Hotel"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#030014]/40 to-[#030014]"></div>
                    </motion.div>
                </AnimatePresence>

                {/* Floating Content over Image */}
                <div className="absolute bottom-20 left-12 max-w-lg z-20">
                    <motion.h2
                        className="text-5xl font-bold text-white mb-4 leading-tight"
                        key={`text-${currentImageIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Join Our <br />
                        Community
                    </motion.h2>
                    <motion.p
                        className="text-lg text-gray-300/90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        Unlock exclusive deals and personalized recommendations.
                    </motion.p>

                    {/* Slide Indicators */}
                    <div className="flex gap-2 mt-6">
                        {hotelImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-purple-500' : 'w-2 bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
