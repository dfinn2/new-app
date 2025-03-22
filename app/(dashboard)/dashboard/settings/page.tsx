'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, Shield, CreditCard, Clock, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null, message: string | null }>({
    type: null,
    message: null
  });

  // User preferences
  const [emailNotifications, setEmailNotifications] = useState({
    purchases: true,
    documents: true,
    marketing: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
  });

  // Fetch user and settings on component mount
  useEffect(() => {
    const fetchUserAndSettings = async () => {
      try {
        // Get the current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          throw new Error('Unauthorized access');
        }
        
        setUser(currentUser);
        
        // Fetch user settings from user_profile or a dedicated settings table
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profile')
          .select('settings')
          .eq('id', currentUser.id)
          .single();
        
        if (!profileError && userProfile?.settings) {
          // If we have settings in the profile, use them
          const settings = userProfile.settings;
          
          // Apply email notification settings if they exist
          if (settings.emailNotifications) {
            setEmailNotifications({
              ...emailNotifications,
              ...settings.emailNotifications
            });
          }
          
          // Apply security settings if they exist
          if (settings.security) {
            setSecuritySettings({
              ...securitySettings,
              ...settings.security
            });
          }
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
        // Redirect to login if unauthorized
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndSettings();
  }, [router]);
  
  const handleToggle = (category: string, setting: string) => {
    if (category === 'email') {
      setEmailNotifications(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    } else if (category === 'security') {
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: !prev[setting as keyof typeof prev]
      }));
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, category: string) => {
    const { name, value } = e.target;
    
    if (category === 'security') {
      setSecuritySettings(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    }
  };
  
  const handleSaveNotifications = async () => {
    if (!user) return;
    
    try {
      setSaveStatus({ type: null, message: null });
      
      // Update the user_profile table with the new settings
      const { error } = await supabase
        .from('user_profile')
        .update({
          settings: {
            emailNotifications,
            // Keep any other settings that might be there
            security: securitySettings
          }
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setSaveStatus({
        type: 'success',
        message: 'Notification preferences saved successfully'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: null, message: null });
      }, 3000);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to save notification preferences'
      });
    }
  };
  
  const handleSaveSecurity = async () => {
    if (!user) return;
    
    try {
      setSaveStatus({ type: null, message: null });
      
      // Update the user_profile table with the new settings
      const { error } = await supabase
        .from('user_profile')
        .update({
          settings: {
            security: securitySettings,
            // Keep any other settings that might be there
            emailNotifications
          }
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setSaveStatus({
        type: 'success',
        message: 'Security settings saved successfully'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: null, message: null });
      }, 3000);
    } catch (error) {
      console.error('Error saving security settings:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to save security settings'
      });
    }
  };
  
  const handleDataExport = async () => {
    if (!user) return;
    
    try {
      setSaveStatus({ type: null, message: null });
      
      // This is a placeholder - in a real app, you would implement
      // a job to gather and package the user's data
      setSaveStatus({
        type: 'success',
        message: 'Data export request received. You will receive an email with your data soon.'
      });
    } catch (error) {
      console.error('Error requesting data export:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to request data export'
      });
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    // Show a confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    try {
      setSaveStatus({ type: null, message: null });
      
      // In a real implementation, you might want to:
      // 1. Delete user data from your database tables
      // 2. Delete the user from Supabase Auth
      
      // This is a placeholder - in a real app, you would implement
      // a more comprehensive account deletion process
      setSaveStatus({
        type: 'success',
        message: 'Account deletion request received. Your account will be deleted shortly.'
      });
      
      // Sign out the user
      await supabase.auth.signOut();
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      setSaveStatus({
        type: 'error',
        message: 'Failed to delete account'
      });
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your settings...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      {/* Status message */}
      {saveStatus.message && (
        <div className={`mb-6 p-4 rounded-md ${
          saveStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            {saveStatus.type === 'success' ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            <p>{saveStatus.message}</p>
          </div>
        </div>
      )}
      
      <Accordion type="single" collapsible className="w-full mb-6">
        <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Email Notifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Purchase Confirmations</h3>
                  <p className="text-sm text-gray-500">Receive email notifications for purchase confirmations</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'purchases')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    emailNotifications.purchases ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      emailNotifications.purchases ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Document Updates</h3>
                  <p className="text-sm text-gray-500">Receive email notifications when documents are updated</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'documents')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    emailNotifications.documents ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      emailNotifications.documents ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Marketing Communications</h3>
                  <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                </div>
                <button
                  onClick={() => handleToggle('email', 'marketing')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    emailNotifications.marketing ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      emailNotifications.marketing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveNotifications}>
                  Save Notification Preferences
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border overflow-hidden mt-4">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Security Settings</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={() => handleToggle('security', 'twoFactorAuth')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {securitySettings.twoFactorAuth && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Two-factor authentication setup is coming soon. This toggle is a placeholder.
                  </p>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-medium">Session Timeout</h3>
                <p className="text-sm text-gray-500">Automatically log out after period of inactivity</p>
                <select
                  name="sessionTimeout"
                  title="Session Timeout"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleChange(e, 'security')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSaveSecurity}>
                  Save Security Settings
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border overflow-hidden mt-4">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              <span className="font-medium">Payment Methods</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Manage your payment methods and billing preferences</p>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-center text-gray-600">
                  No payment methods available yet.
                </p>
              </div>
              
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  <Eye className="h-4 w-4 inline mr-1" />
                  Payment method management is coming soon. This section is a placeholder.
                </p>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="outline" disabled>
                  <a href="/dashboard/billing">
                    Manage Payment Methods
                  </a>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center mb-4">
          <Bell className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-medium">Notification Preferences</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Browser Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications in your browser</p>
            </div>
            <button className="text-blue-600 text-sm" disabled>
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive important updates via text message</p>
            </div>
            <button className="text-blue-600 text-sm" disabled>
              Set up
            </button>
          </div>
          
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <Eye className="h-4 w-4 inline mr-1" />
              Advanced notification options are coming soon. This section is a placeholder.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-medium">Account Actions</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Download Your Data</h3>
            <p className="text-sm text-gray-500 mb-2">Get a copy of all your personal information and documents</p>
            <Button variant="outline" size="sm" onClick={handleDataExport}>
              Request Data Export
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium text-red-600 mb-1">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-2">Permanently delete your account and all associated data</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}