import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const EmailVerificationModal = ({ isOpen, onClose, email, onVerificationSuccess }) => {
    const { updateUser, user } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setOtp(['', '', '', '', '', '']);
            setError('');
            setTimeLeft(60);
            setCanResend(false);
            setLoading(false);
        }
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        if (!isOpen) return;
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft, isOpen]);

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const nextInput = document.getElementById(`otp-${index - 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authService.verifyOtp(email, otpValue);
            if (response.success) {
                // Update local user state
                if (user) {
                    const updatedUser = { ...user, isEmailVerified: true };
                    updateUser(updatedUser);
                }
                if (onVerificationSuccess) onVerificationSuccess();
                onClose();
            } else {
                setError(response.message || 'Verification failed');
            }
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        try {
            await authService.resendOtp(email);
            setTimeLeft(60);
            setCanResend(false);
        } catch (err) {
            setError(err.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[#0f172a] rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in border border-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] text-white">
                    <h3 className="text-xl font-bold">Verify Your Email</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-300 text-sm mb-2">We've sent a 6-digit verification code to</p>
                        <p className="text-white font-medium">{email}</p>
                    </div>

                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-12 text-center text-xl font-bold bg-[#060010] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#a855f7] outline-none transition-all"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="text-center text-sm">
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="text-[#a855f7] hover:text-[#c084fc] font-medium transition-colors"
                            >
                                Resend Code
                            </button>
                        ) : (
                            <span className="text-gray-500">Resend code in {timeLeft}s</span>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#060010]/50">
                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] text-white rounded-xl hover:shadow-lg hover:shadow-[#a855f7]/25 transition-all disabled:opacity-50 font-bold"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationModal;
