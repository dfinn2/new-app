// app/(dashboard)/dashboard/purchases/page.tsx
import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function PurchasesPage() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If no authenticated user, redirect to login
  if (!user || error) {
    redirect("/login");
  }
  
  const userId = user.id;
  
  // Fetch all user purchases
  const { data: purchases, error: purchasesError } = await supabase
    .from('document_purchases')
    .select(`
      id,
      user_id,
      stripe_payment_id,
      payment_status,
      generations_used,
      product_name,
      stripe_session_id,
      created_at,
      updated_at,
      documents:document_templates (
        name,
        base_price,
        description,
        file_path,)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (purchasesError) {
    console.error('Error fetching purchases:', purchasesError);
  }
  
  // Default to empty array if no purchases or error
  const userPurchases = purchases || [];
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Purchases</h1>
        <Button asChild>
          <Link href="/product">
            Browse More Products
          </Link>
        </Button>
      </div>
      
      {userPurchases.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No purchases yet</h2>
          <p className="text-gray-500 mb-6">You haven&quot;t made any purchases yet. Browse our products to get started.</p>
          <Button asChild>
            <Link href="/product">
              Browse Products
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{purchase.product_name}</div>
                          <div className="text-sm text-gray-500">
                            {purchase.document_type || 'Standard Document'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.created_at ? formatDate(purchase.created_at) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        purchase.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {purchase.status ? purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.amount ? `$${(purchase.amount / 100).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/documents/${purchase.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {purchase.file_path && (
                          <Button asChild size="sm" variant="outline">
                            <Link href={purchase.file_path} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Link>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {userPurchases.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Payment History</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userPurchases.map((purchase) => (
                  <tr key={`payment-${purchase.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.transaction_id || `TRANS-${purchase.id.substring(0, 8)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {purchase.purchase_date ? formatDate(purchase.purchase_date) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {purchase.amount ? `$${(purchase.amount / 100).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        purchase.payment_status === 'paid' || purchase.status === 'completed'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {((purchase.payment_status || purchase.status === 'completed' ? 'Paid' : purchase.status) || 'N/A').charAt(0).toUpperCase() + 
                          ((purchase.payment_status || purchase.status === 'completed' ? 'Paid' : purchase.status) || 'N/A').slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}