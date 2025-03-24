// app/(dashboard)/dashboard/purchases/page.tsx
import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, Download, Eye, RefreshCw } from "lucide-react";
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
  
  // Get basic order information
  const { data: userOrders, error: ordersError } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, stripe_checkout_session_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-8 bg-red-50 rounded border border-red-200 text-red-700">
          Error loading your purchase data. Please try again later.
        </div>
      </div>
    );
  }
  
  // For each order, get the order items and associated product info
  const ordersWithItems = [];
  
  if (userOrders && userOrders.length > 0) {
    for (const order of userOrders) {
      // Get order items with product info in a single query using join
      const { data: itemsWithProducts, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id, 
          order_id, 
          template_id, 
          generations_remaining, 
          amount_paid,
          product:product_db(id, name, description, base_price, file_path)
        `)
        .eq('order_id', order.id);
      
      if (itemsError) {
        console.error(`Error fetching items for order ${order.id}:`, itemsError);
        continue;
      }
      
      // Add the order with its items
      ordersWithItems.push({
        ...order,
        items: itemsWithProducts || []
      });
    }
  }
  
  // Flatten items for the purchase items table
  const purchaseItems = [];
  
  ordersWithItems.forEach(order => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        purchaseItems.push({
          id: item.id,
          order_id: order.id,
          order_status: order.status,
          order_date: order.created_at,
          amount_paid: item.amount_paid,
          generations_remaining: item.generations_remaining,
          product: item.product,
          stripe_checkout_session_id: order.stripe_checkout_session_id
        });
      });
    }
  });
  
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
      
      {ordersWithItems.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Order History</h2>
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ordersWithItems.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.id.substring(0, 8) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items && order.items.length > 0 
                          ? order.items.map(item => item.product?.name || 'Unknown').join(', ')
                          : 'No documents'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at ? formatDate(order.created_at) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {order.total_amount ? `$${(order.total_amount / 100).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
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