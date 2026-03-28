import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';
import { toast } from 'sonner';
import type { ProfileUser, UpdateProfileRequest, ProfileResponse } from '@/api/userService';

interface ProfileFormProps {
  profile?: ProfileUser | null;
  onUpdate?: (data: UpdateProfileRequest) => Promise<ProfileResponse>;
  isLoading?: boolean;
}

export default function ProfileForm({ profile, onUpdate, isLoading = false }: ProfileFormProps) {

  const [formData, setFormData] = useState(() => ({
    username: profile?.username || '',
    email: profile?.email || '',
    phone_number: profile?.phone_number || '',
    address: profile?.address || '',
  }));

  useEffect(() => {
    setFormData({
      username: profile?.username || '',
      email: profile?.email || '',
      phone_number: profile?.phone_number || '',
      address: profile?.address || '',
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onUpdate) {
        await onUpdate(formData);
      }
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden dark:bg-slate-900 transition-colors duration-300">
      <CardHeader className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 p-8">
        <CardTitle className="flex items-center space-x-3 text-2xl font-black dark:text-white">
          <User className="w-7 h-7 text-primary dark:text-blue-400" />
          <span>Edit Profile</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-600" />
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all font-bold dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-600" />
                <Input
                  value={formData.email}
                  disabled
                  className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold dark:text-slate-400"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-600" />
                <Input
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="pl-12 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all font-bold dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">Shipping Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-6 w-5 h-5 text-slate-300 dark:text-slate-600" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:bg-white dark:focus:bg-slate-700 focus:ring-4 focus:ring-primary/10 transition-all font-bold min-h-[120px] resize-none dark:text-white dark:placeholder:text-slate-500"
                  placeholder="Enter your full shipping address"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="h-14 rounded-2xl px-10 font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
              disabled={isLoading}
            >
              <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}