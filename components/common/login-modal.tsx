'use client';

import { useState, useEffect } from 'react';
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
  const { login, isAuthenticated, user, logout, updateUser } = useAuth();

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

  const [currentFormStep, setCurrentFormStep] = useState(1);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<UserState | null>(null);

  useEffect(() => {
    if (open) {
      if (isAuthenticated && user) {
        setLoginData(prev => ({ ...prev, ...user }));
        switch (user.status) {
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
            setCurrentFormStep(1);
        }
      } else {
        setCurrentFormStep(1);
      }
    } else {
      resetForm();
    }
  }, [open, isAuthenticated, user]);

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
          const { accessToken, status, ...userData } = response.data[0];
          login(accessToken, userData);
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

  // Profile submit
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
        if (response.data?.[0]) setUserStatus(response.data[0].status);
        updateUser({
          name: loginData.name,
          dob: loginData.dob,
          gender: loginData.gender,
          status: response.data?.[0]?.status,
        });
        setCurrentFormStep(4);
      } else setLoginError(response.message || 'Failed to update profile');
    } catch (err) {
      setLoginError('Failed to update profile. Please try again.');
      if ((err as any)?.status === 401) {
        logout();
        handleClose();
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Address submit
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
      if (response.status === 200 && response.data?.[0]?.status === 'COMPLETED') {
        onSuccess?.();
        handleClose();
      } else setLoginError(response.message || 'Failed to update address');
    } catch {
      setLoginError('Failed to update address. Please try again.');
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
      case 3: return 'Complete Your Profile (1/2)';
      case 4: return 'Complete Your Address (2/2)';
      default: return 'Login';
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
            <div className="space-y-4">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={loginData.name}
                onChange={e => setLoginData({ ...loginData, name: e.target.value })}
              />

              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={loginData.dob}
                onChange={e => setLoginData({ ...loginData, dob: e.target.value })}
              />

              <Label htmlFor="gender">Gender</Label>
              <Select
                value={loginData.gender}
                onValueChange={val => setLoginData({ ...loginData, gender: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleProfileSubmit}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                disabled={!loginData.name || !loginData.dob || !loginData.gender}
              >
                Next: Address Details
              </Button>
              {loginError && <div className="text-red-500 text-center">{loginError}</div>}
            </div>
          )}

          {currentFormStep === 4 && (
            <div className="space-y-4">
              <Label htmlFor="baseAddress">Base Address</Label>
              <Input
                id="baseAddress"
                value={loginData.baseAddress}
                onChange={e => setLoginData({ ...loginData, baseAddress: e.target.value })}
              />

              <Label htmlFor="postOfficeName">Post Office Name</Label>
              <Input
                id="postOfficeName"
                value={loginData.postOfficeName}
                onChange={e => setLoginData({ ...loginData, postOfficeName: e.target.value })}
              />

              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={loginData.pincode}
                onChange={e => setLoginData({ ...loginData, pincode: e.target.value })}
                maxLength={6}
              />

              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={loginData.city}
                onChange={e => setLoginData({ ...loginData, city: e.target.value })}
              />

              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={loginData.district}
                onChange={e => setLoginData({ ...loginData, district: e.target.value })}
              />

              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={loginData.state}
                onChange={e => setLoginData({ ...loginData, state: e.target.value })}
              />

              <Button
                onClick={handleAddressSubmit}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                disabled={!loginData.baseAddress || !loginData.pincode || !loginData.city || loginLoading}
              >
                Complete Registration
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
