'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Twitter, AlertTriangle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.name,
          email: data.user.email,
        },
      });

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch('http://localhost:5000/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeletingAccount(true);

    try {
      const res = await fetch('http://localhost:5000/api/user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete account');
      }

      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted',
      });

      router.push('/auth/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleConnectTwitter = async () => {
    try {
      setIsConnectingTwitter(true);
      const result = await signIn('twitter', { 
        redirect: false,
        callbackUrl: '/dashboard/settings'
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Success',
        description: 'Twitter account connected successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to connect Twitter account.',
        variant: 'destructive',
      });
    } finally {
      setIsConnectingTwitter(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={user?.name || ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ''} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Twitter Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Twitter Integration</CardTitle>
          <CardDescription>Connect your Twitter account to use Twitter AI features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connecting your Twitter account allows our AI to analyze and generate content for your Twitter profile.
            </p>
            <Button
              variant="outline"
              onClick={handleConnectTwitter}
              disabled={isConnectingTwitter}
            >
              {isConnectingTwitter ? (
                'Connecting...'
              ) : (
                <>
                  <Twitter className="mr-2 h-4 w-4" />
                  Connect Twitter Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-muted-foreground">
                Deleting your account will permanently remove all your data and cannot be undone.
              </p>
            </div>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}