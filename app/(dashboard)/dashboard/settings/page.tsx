// app/(dashboard)/dashboard/settings/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, Shield, CreditCard, Clock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [emailNotifications, setEmailNotifications] = useState({
    purchases: true,
    documents: true,
    marketing: false
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
  });
  
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
  
  const handleSaveNotifications = () => {
    alert('Notification preferences saved');
    // In a real application, you would save these settings to your database
  };
  
  const handleSaveSecurity = () => {
    alert('Security settings saved');
    // In a real application, you would save these settings to your database
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
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
              
              <div className="space-y-2">
                <h3 className="font-medium">Session Timeout</h3>
                <p className="text-sm text-gray-500">Automatically log out after period of inactivity</p>
                <select
                  name="sessionTimeout"
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
              
              <div className="border rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2028</p>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </span>
                </div>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="outline">
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
            <button className="text-blue-600 text-sm">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive important updates via text message</p>
            </div>
            <button className="text-blue-600 text-sm">
              Set up
            </button>
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
            <Button variant="outline" size="sm">
              Request Data Export
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium text-red-600 mb-1">Delete Account</h3>
            <p className="text-sm text-gray-500 mb-2">Permanently delete your account and all associated data</p>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}