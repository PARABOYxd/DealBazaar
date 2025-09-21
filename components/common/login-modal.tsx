import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
    const [loginData, setLoginData] = useState({
        phone: '',
        otp: '',
        name: '',
        email: '',
        location: ''
    });
    const [loginStep, setLoginStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const handlePhoneSubmit = async () => {
        setLoginError('');
        if (loginData.phone.length === 10) {
            setLoginLoading(true);
            try {
                const res = await apiService.sendOtp(loginData.phone);
                if (res.status === 200) {
                    setLoginStep(2);
                } else {
                    setLoginError(res.message || 'Failed to send OTP');
                }
            } catch (err) {
                setLoginError('Failed to send OTP');
            } finally {
                setLoginLoading(false);
            }
        }
    };

    const handleOTPSubmit = async () => {
        setLoginError('');
        if (loginData.otp.length === 6) {
            setLoginLoading(true);
            try {
                const res = await apiService.verifyOtp(loginData.phone, loginData.otp);
                if (res.status === 200 && res.data && res.data[0]?.token) {
                    localStorage.setItem('token', res.data[0].token);
                    setLoginStep(3);
                } else {
                    setLoginError(res.message || 'Invalid OTP');
                }
            } catch (err) {
                setLoginError('Invalid OTP');
            } finally {
                setLoginLoading(false);
            }
        }
    };

    const handleDetailsSubmit = () => {
        // Here you would typically save user details
        onOpenChange(false);
        setLoginStep(1);
        setLoginData({ phone: '', otp: '', name: '', email: '', location: '' });
        if (onSuccess) onSuccess();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-full mx-4">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-black">
                        {loginStep === 1 && "Login to Your Account"}
                        {loginStep === 2 && "Verify OTP"}
                        {loginStep === 3 && "Complete Your Profile"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {loginStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your 10-digit phone number"
                                    value={loginData.phone}
                                    onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                                    className="mt-1"
                                    maxLength={10}
                                />
                            </div>
                            <Button
                                onClick={handlePhoneSubmit}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={loginData.phone.length !== 10 || loginLoading}
                            >
                                {loginLoading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                        </div>
                    )}
                    {loginStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                    Enter OTP
                                </Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={loginData.otp}
                                    onChange={(e) => setLoginData({ ...loginData, otp: e.target.value })}
                                    className="mt-1 text-center text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>
                            <div className="text-center">
                                <Button
                                    variant="link"
                                    className="text-teal-500 text-sm"
                                    onClick={() => setLoginStep(1)}
                                >
                                    Resend OTP
                                </Button>
                            </div>
                            <Button
                                onClick={handleOTPSubmit}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={loginData.otp.length !== 6 || loginLoading}
                            >
                                {loginLoading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                        </div>
                    )}
                    {loginStep === 3 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={loginData.name}
                                    onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email (Optional)
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                    Location
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Enter your city"
                                    value={loginData.location}
                                    onChange={(e) => setLoginData({ ...loginData, location: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                onClick={handleDetailsSubmit}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={!loginData.name || !loginData.location}
                            >
                                Complete Registration
                            </Button>
                        </div>
                    )}
                    <div className="text-center">
                        <Button
                            variant="link"
                            className="text-gray-500 text-sm"
                            onClick={() => {
                                onOpenChange(false);
                                setLoginStep(1);
                                setLoginData({ phone: '', otp: '', name: '', email: '', location: '' });
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
