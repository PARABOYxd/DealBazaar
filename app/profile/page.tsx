'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Home, MapPin, Edit, Calendar, GitMerge } from 'lucide-react';
import { LoginModal } from '@/components/common/login-modal';
import { Separator } from '@/components/ui/separator';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | undefined }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4">
    <div className="flex items-center mb-1 sm:mb-0">
      <div className="w-8">{icon}</div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm text-gray-800 sm:text-right break-words">{value || 'Not set'}</span>
  </div>
);

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/?login=true');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  const handleEditSuccess = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden shadow-lg">
            <CardHeader className="bg-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-white shadow-md">
                  <AvatarImage src={user.avatar || ''} alt={user.name} />
                  <AvatarFallback className="text-4xl bg-gray-200">{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">{user.name}</CardTitle>
                  <CardDescription className="text-base text-gray-500 mt-1">{user.email}</CardDescription>
                </div>
                <div className="sm:ml-auto pt-4 sm:pt-0">
                  <Button onClick={() => setIsLoginModalOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <InfoRow icon={<Phone size={20} className="text-gray-400" />} label="Phone Number" value={user.phoneNumber} />
                  <InfoRow icon={<GitMerge size={20} className="text-gray-400" />} label="Gender" value={user.gender} />
                  <InfoRow icon={<Calendar size={20} className="text-gray-400" />} label="Date of Birth" value={user.dob} />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Address Details</h3>
                <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  <InfoRow icon={<Home size={20} className="text-gray-400" />} label="Address" value={user.baseAddress} />
                  <InfoRow icon={<MapPin size={20} className="text-gray-400" />} label="Pincode" value={user.pincode} />
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} onSuccess={handleEditSuccess} isEditMode={true} />
    </>
  );
}