'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/providers/auth-provider';
import { UserState } from '@/types';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  isEditMode?: boolean; // New prop to indicate edit mode
}

export function LoginModal({ open, onOpenChange, onSuccess, isEditMode = false }: LoginModalProps) {
  const { login, isAuthenticated, user, logout, updateUser } = useAuth();

  const [loginData, setLoginData] = useState({
    mobileNumber: '',
    otp: '',
    name: '',
    dob: '',
    gender: '',
    baseAddress: '',
    pincode: '',
  });

  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserState | null>(null);

  useEffect(() => {
    if (open) {
      if (isAuthenticated && user) {
        setLoginData(prev => ({ ...prev, ...user }));
        if (isEditMode) {
          setCurrentFormStep(3); // Directly go to profile form in edit mode
        } else {
          switch (user.status) {
            case 'COMPLETED':
              onSuccess?.();
              handleClose();
              break;
            case 'STEP1':
            case 'VERIFIED':
            case 'INITIATED':
            case 'PENDING':
              setCurrentFormStep(3);
              break;
            default:
              setCurrentFormStep(1);
          }
        }
      } else {
        setCurrentFormStep(1);
      }
    } else {
      resetForm();
    }
  }, [open, isAuthenticated, user, isEditMode]);

  const resetForm = () => {
    setLoginData({
      mobileNumber: '',
      otp: '',
      name: '',
      dob: '',
      gender: '',
      baseAddress: '',
      pincode: '',
    });
    setCurrentFormStep(1);
    setLoginError('');
    setLoginLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  // Phone submit
  const handlePhoneSubmit = async () => {
    setLoginError('');
    if (loginData.mobileNumber.length === 10) {
      setLoginLoading(true);
      try {
        const response = await apiService.sendOtp(loginData.mobileNumber);
        if (response.status === 200) {
          if (response.data?.[0]) setUserStatus(response.data[0].status);
          setCurrentFormStep(2);
        } else setLoginError(response.message || 'Failed to send OTP');
      } catch {
        setLoginError('Failed to send OTP. Please try again.');
      } finally {
        setLoginLoading(false);
      }
    }
  };

  // OTP submit
  const handleOTPSubmit = async () => {
    setLoginError('');
    if (loginData.otp.length === 6) {
      setLoginLoading(true);
      try {
        const response = await apiService.verifyOtp(loginData.mobileNumber, loginData.otp);
        if (response.status === 200 && response.data?.[0]?.accessToken) {
          const loginResponse = response.data[0]; // Get the full LoginResponse object
          const { accessToken, status, ...restOfUser } = loginResponse; // Extract accessToken and status
          login(accessToken, { ...restOfUser, status, phoneNumber: loginData.mobileNumber }); // Pass the full LoginResponse object
          setUserStatus(status);

          switch (status) {
            case 'COMPLETED':
              onSuccess?.();
              handleClose();
              break;
            case 'STEP1':
              setCurrentFormStep(4);
              break;
            case 'VERIFIED':
            case 'INITIATED':
              setCurrentFormStep(3);
              break;
            default:
              setCurrentFormStep(3);
          }
        } else setLoginError(response.message || 'Invalid OTP');
      } catch {
        setLoginError('Failed to verify OTP. Please try again.');
      } finally {
        setLoginLoading(false);
      }
    }
  };

  const handleProfileAndAddressSubmit = async () => {
    setLoginError('');
    setLoginLoading(true);
    try {
      const profileData = {
        name: loginData.name,
        dob: loginData.dob,
        gender: loginData.gender,
        baseAddress: loginData.baseAddress,
        pincode: loginData.pincode,
      };

      const response = await apiService.updateProfile(profileData);

      if (response.status === 200) {
        const updatedUser = {
          ...loginData,
          status: response.data?.[0]?.status || user?.status,
        };
        updateUser(updatedUser);
        onSuccess?.();
        handleClose();
      } else {
        setLoginError(response.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      setLoginError('Failed to update profile. Please try again.');
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
      case 1: return 'Login to Your Account';
      case 2: return 'Verify OTP';
      case 3: return 'Complete Your Profile';
      default: return 'Login';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full mx-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-black">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {currentFormStep === 1 && (
            <div className="space-y-4">
              <Label htmlFor="mobileNumber">Phone Number</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter 10-digit phone"
                value={loginData.mobileNumber}
                onChange={e => setLoginData({ ...loginData, mobileNumber: e.target.value })}
                maxLength={10}
              />
              <Button
                onClick={handlePhoneSubmit}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                disabled={loginData.mobileNumber.length !== 10 || loginLoading}
              >
                {loginLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              {loginError && <div className="text-red-500 text-center">{loginError}</div>}
            </div>
          )}

          {currentFormStep === 2 && (
            <div className="space-y-4">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="6-digit OTP"
                value={loginData.otp}
                onChange={e => setLoginData({ ...loginData, otp: e.target.value })}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <Button
                variant="link"
                className="text-teal-500 text-sm"
                onClick={() => setCurrentFormStep(1)}
              >Resend OTP</Button>
              <Button
                onClick={handleOTPSubmit}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                disabled={loginData.otp.length !== 6 || loginLoading}
              >
                {loginLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              {loginError && <div className="text-red-500 text-center">{loginError}</div>}
            </div>
          )}

          {currentFormStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={loginData.name} onChange={e => setLoginData({ ...loginData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !loginData.dob && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {loginData.dob ? format(new Date(loginData.dob), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={loginData.dob ? new Date(loginData.dob) : undefined}
                        onSelect={(date) => setLoginData({ ...loginData, dob: date ? format(date, "yyyy-MM-dd") : '' })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup
                  value={loginData.gender}
                  onValueChange={(val) => setLoginData({ ...loginData, gender: val })}
                  className="flex space-x-4 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseAddress">Base Address</Label>
                <Input id="baseAddress" value={loginData.baseAddress} onChange={e => setLoginData({ ...loginData, baseAddress: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" value={loginData.pincode} onChange={e => setLoginData({ ...loginData, pincode: e.target.value })} maxLength={6} />
              </div>

              <Button
                onClick={handleProfileAndAddressSubmit}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white text-center"
                disabled={!loginData.name || !loginData.dob || !loginData.gender || !loginData.baseAddress || !loginData.pincode || loginLoading}
              >
                {loginLoading ? 'Saving...' : 'Complete Registration'}
              </Button>
              {loginError && <div className="text-red-500 text-center">{loginError}</div>}
            </div>
          )}

          <div className="text-center">
            <Button variant="link" className="text-gray-500 text-sm" onClick={handleClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
