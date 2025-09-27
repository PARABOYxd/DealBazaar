import { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/providers/auth-provider';
import { UserState } from '@/types';


interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
    const { login, isAuthenticated, user, logout } = useAuth();
    
    // Form state
    const [loginData, setLoginData] = useState({
        mobileNumber: '',
        otp: '',
        name: '',
        dob: '',
        gender: '',
        baseAddress: '',
        postOfficeName: '',
        pincode: '',
        city: '',
        district: '',
        state: '',
    });

    // UI state
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [userStatus, setUserStatus] = useState<UserState | null>(null);

    useEffect(() => {
        if (open) { // Only run when the modal is open
            if (isAuthenticated && user) {
                // Assuming user object contains a 'status' field
                switch (user.status) {
                    case "COMPLETED":
                        onSuccess && onSuccess();
                        handleClose();
                        break;
                    case "STEP1":
                        setCurrentFormStep(4); // Go to Address Details
                        break;
                    case "VERIFIED":
                    case "INITIATED": // If user is VERIFIED or INITIATED, go to Profile Details
                        setCurrentFormStep(3);
                        break;
                    default:
                        setCurrentFormStep(1); // Default to phone input if status is unknown
                        break;
                }
            } else {
                setCurrentFormStep(1); // If not authenticated, start at phone input
            }
        } else {
            resetForm(); // Reset form when modal closes
        }
    }, [open, isAuthenticated, user]); // Dependencies for useEffect

    const resetForm = () => {
        setLoginData({
            mobileNumber: '',
            otp: '',
            name: '',
            dob: '',
            gender: '',
            baseAddress: '',
            postOfficeName: '',
            pincode: '',
            city: '',
            district: '',
            state: '',
        });
        setCurrentFormStep(1);
        setLoginError('');
        setLoginLoading(false);
    };

    const handleClose = () => {
        onOpenChange(false);
        resetForm();
    };

    const handlePhoneSubmit = async () => {
        setLoginError('');
        if (loginData.mobileNumber.length === 10) {
            setLoginLoading(true);
            try {
                const response = await apiService.sendOtp(loginData.mobileNumber);
                if (response.status === 200) {
                    if (response.data?.[0]) {
                        setUserStatus(response.data[0].status);
                    }
                    setCurrentFormStep(2); // Move to OTP verification
                } else {
                    setLoginError(response.message || 'Failed to send OTP');
                }
            } catch (err) {
                setLoginError('Failed to send OTP. Please try again.');
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
                const response = await apiService.verifyOtp(loginData.mobileNumber, loginData.otp);
                if (response.status === 200 && response.data?.[0]?.accessToken) {
                    const { accessToken, status } = response.data[0];
                    
                    // Store the token and update auth state
                    await login(accessToken);
                    setUserStatus(status);

                    // Route based on user status
                    switch (status) {
                        case "COMPLETED":
                            onSuccess?.();
                            handleClose();
                            break;
                        case "STEP1":
                            setCurrentFormStep(4); // Address form
                            break;
                        case "VERIFIED":
                        case "INITIATED":
                            setCurrentFormStep(3); // Profile form
                            break;
                        default:
                            setCurrentFormStep(3); // Default to profile
                    }
                } else {
                    setLoginError(response.message || 'Invalid OTP');
                }
            } catch (err) {
                setLoginError('Failed to verify OTP. Please try again.');
            } finally {
                setLoginLoading(false);
            }
        }
    };

    const handleProfileSubmit = async () => {
        setLoginError('');
        setLoginLoading(true);
        try {
            const response = await apiService.updateProfile({
                name: loginData.name,
                dob: loginData.dob,
                gender: loginData.gender,
            });
            
            if (response.status === 200) {
                if (response.data?.[0]) {
                    setUserStatus(response.data[0].status);
                }
                setCurrentFormStep(4); // Proceed to address details
            } else {
                setLoginError(response.message || 'Failed to update profile');
            }
        } catch (err) {
            setLoginError('Failed to update profile. Please try again.');
            // If token expired, logout and restart flow
            if ((err as any)?.status === 401) {
                logout();
                handleClose();
            }
        } finally {
            setLoginLoading(false);
        }
    };

    const handleAddressSubmit = async () => {
        setLoginError('');
        setLoginLoading(true);
        try {
            const response = await apiService.updateAddress({
                baseAddress: loginData.baseAddress,
                postOfficeName: loginData.postOfficeName,
                pincode: loginData.pincode,
                city: loginData.city,
                district: loginData.district,
                state: loginData.state,
            });
            
            if (response.status === 200) {
                if (response.data?.[0]?.status === "COMPLETED") {
                    onSuccess?.();
                    handleClose();
                }
            } else {
                setLoginError(response.message || 'Failed to update address');
            }
        } catch (err) {
            setLoginError('Failed to update address. Please try again.');
            // If token expired, logout and restart flow
            if ((err as any)?.status === 401) {
                logout();
                handleClose();
            }
        } finally {
            setLoginLoading(false);
        }
    };

    const getDialogTitle = () => {
        switch (currentFormStep) {
            case 1: return "Login to Your Account";
            case 2: return "Verify OTP";
            case 3: return "Complete Your Profile (1/2)";
            case 4: return "Complete Your Address (2/2)";
            default: return "Login";
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md w-full mx-4">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-black">
                        {getDialogTitle()}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {currentFormStep === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="mobileNumber"
                                    type="tel"
                                    placeholder="Enter your 10-digit phone number"
                                    value={loginData.mobileNumber}
                                    onChange={(e) => setLoginData({ ...loginData, mobileNumber: e.target.value })}
                                    className="mt-1"
                                    maxLength={10}
                                />
                            </div>
                            <Button
                                onClick={handlePhoneSubmit}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={loginData.mobileNumber.length !== 10 || loginLoading}
                            >
                                {loginLoading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>
                            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                        </div>
                    )}
                    {currentFormStep === 2 && (
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
                                    onClick={() => setCurrentFormStep(1)}
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
                    {currentFormStep === 3 && (
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
                                <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                                    Date of Birth
                                </Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={loginData.dob}
                                    onChange={(e) => setLoginData({ ...loginData, dob: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                                    Gender
                                </Label>
                                <Select onValueChange={(value) => setLoginData({ ...loginData, gender: value })} value={loginData.gender}>
                                    <SelectTrigger id="gender" className="mt-1">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                onClick={handleProfileSubmit}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={!loginData.name || !loginData.dob || !loginData.gender}
                            >
                                Next: Address Details
                            </Button>
                            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                        </div>
                    )}
                    {currentFormStep === 4 && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="baseAddress" className="text-sm font-medium text-gray-700">
                                    Base Address
                                </Label>
                                <Input
                                    id="baseAddress"
                                    type="text"
                                    placeholder="Flat No., Building Name"
                                    value={loginData.baseAddress}
                                    onChange={(e) => setLoginData({ ...loginData, baseAddress: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="postOfficeName" className="text-sm font-medium text-gray-700">
                                    Post Office Name
                                </Label>
                                <Input
                                    id="postOfficeName"
                                    type="text"
                                    placeholder="e.g., Brigade Road"
                                    value={loginData.postOfficeName}
                                    onChange={(e) => setLoginData({ ...loginData, postOfficeName: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                                    Pincode
                                </Label>
                                <Input
                                    id="pincode"
                                    type="text"
                                    placeholder="Enter 6-digit pincode"
                                    value={loginData.pincode}
                                    onChange={(e) => setLoginData({ ...loginData, pincode: e.target.value })}
                                    className="mt-1"
                                    maxLength={6}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Enter your city"
                                    value={loginData.city}
                                    onChange={(e) => setLoginData({ ...loginData, city: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                                    District
                                </Label>
                                <Input
                                    id="district"
                                    type="text"
                                    placeholder="Enter your district"
                                    value={loginData.district}
                                    onChange={(e) => setLoginData({ ...loginData, district: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                                    State
                                </Label>
                                <Input
                                    id="state"
                                    type="text"
                                    placeholder="Enter your state"
                                    value={loginData.state}
                                    onChange={(e) => setLoginData({ ...loginData, state: e.target.value })}
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                onClick={handleAddressSubmit}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                                disabled={!loginData.baseAddress || !loginData.pincode || !loginData.city || loginLoading}
                            >
                                Complete Registration
                            </Button>
                            {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
                        </div>
                    )}
                    <div className="text-center">
                        <Button
                            variant="link"
                            className="text-gray-500 text-sm"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}