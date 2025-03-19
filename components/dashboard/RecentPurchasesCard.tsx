import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Purchase {
  id: string;
  product_name: string;
  purchase_date: string;
  status: string;
  amount: number;
}

export default function RecentPurchasesCard({ purchases }: { purchases: Purchase[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Purchases</h3>
        <Link href="/dashboard/purchases" className="text-blue-600 text-sm hover:underline flex items-center">
          View all 
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </div>
      
      {purchases.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No recent purchases found</p>
          <Link href="/product" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse our products
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="py-3 flex items-center justify-between">
              <div>
                <h4 className="font-medium">{purchase.product_name}</h4>
                <p className="text-sm text-gray-500">{formatDate(purchase.purchase_date)}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(purchase.amount / 100).toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  purchase.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}