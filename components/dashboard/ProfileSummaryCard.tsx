import { User as UserType } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProfileSummaryCardProps {
  user?: UserType | null;
}

export default function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  if (!user) {
    return <div className="bg-white p-6 rounded-lg shadow-sm border">Loading user data...</div>
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Profile</h3>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/profile">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col items-center pb-4">
        {user.image ? (
          <Image 
            src={user.image} 
            alt={user.name || 'User'} 
            width={80} 
            height={80} 
            className="rounded-full border-2 border-gray-200"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-500">
              {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
            </span>
          </div>
        )}
        
        <h4 className="text-lg font-bold mt-3">{user.name || 'User'}</h4>
        <p className="text-gray-500 text-sm">{user.email || ''}</p>
      </div>
      
      <div className="border-t pt-4 mt-2">
        <div className="text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Account Status</span>
            <span className="font-medium">Active</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium">
              {user.createdAt ? formatDate(user.createdAt.toString()) : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}