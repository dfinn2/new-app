// app/(dashboard)/dashboard/documents/page.tsx
import { createClient } from "@/utils/supabase/server";
import { getUserDocuments } from "@/lib/db/userDocuments";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, Download, ExternalLink, Book, CheckCircle, Clock, Eye, RefreshCw, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function DocumentsPage() {
  // Get the Supabase client
  const supabase = await createClient();

  // Get authenticated user using Supabase directly
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (!user || error) {
    redirect("/login");
  }

  const userId = user.id;

  // Fetch user's purchased documents
  let userDocuments = [];
  try {
    userDocuments = await getUserDocuments(userId);
  } catch (error) {
    console.error("Error fetching user documents:", error);
  }

  // Fetch all available documents from the documents table
  let availableDocuments = [];
  try {
    const { data, error } = await supabase
      .from("product_db")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Error fetching available documents:", error);
    } else {
      availableDocuments = data || [];
    }
  } catch (error) {
    console.error("Error with Supabase client:", error);
  }

  // Fetch user purchases (order items with products)
  const { data: userOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at, stripe_checkout_session_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  // For each order, get the order items and associated product info
  const ordersWithItems = [];

  if (userOrders && userOrders.length > 0) {
    for (const order of userOrders) {
      // Get order items with product info in a single query using join
      const { data: itemsWithProducts, error: itemsError } = await supabase
        .from("order_items")
        .select(
          `
          id, 
          order_id, 
          template_id, 
          generations_remaining, 
          amount_paid,
          product:product_db(id, name, description, base_price, file_path)
        `
        )
        .eq("order_id", order.id);

      if (itemsError) {
        console.error(
          `Error fetching items for order ${order.id}:`,
          itemsError
        );
        continue;
      }

      // Add the order with its items
      ordersWithItems.push({
        ...order,
        items: itemsWithProducts || [],
      });
    }
  }

  // Flatten items for the purchase items table
  const purchaseItems = [];

  ordersWithItems.forEach((order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        purchaseItems.push({
          id: item.id,
          order_id: order.id,
          order_status: order.status,
          order_date: order.created_at,
          amount_paid: item.amount_paid,
          generations_remaining: item.generations_remaining,
          product: item.product,
          stripe_checkout_session_id: order.stripe_checkout_session_id,
        });
      });
    }
  });

  const getDocumentTypeName = (doc: any) => {
    if (doc.document_type) return doc.document_type;
    if (doc.product_name?.toLowerCase().includes("nnn")) return "NNN Agreement";
    if (doc.product_name?.toLowerCase().includes("oem")) return "OEM Agreement";
    return "Legal Document";
  };

  const getDocumentStatus = (doc: any) => {
    if (doc.document_status) return doc.document_status;
    return doc.status === "completed" ? "Active" : "Processing";
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed" || status === "Active") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (status === "Processing" || status === "pending") {
      return <Clock className="h-4 w-4 text-amber-500" />;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* My Documents section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button asChild>
          <Link href="/product">Get More Documents</Link>
        </Button>
      </div>

      {/* Purchase Items Section */}
      <h2 className="text-xl font-bold mb-4">My Purchases</h2>
      {purchaseItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No purchases yet</h2>
          <p className="text-gray-500 mb-6">
            You haven&quot;t made any purchases yet. Browse our products to get
            started.
          </p>
          <Button asChild>
            <Link href="/product">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generations
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {purchaseItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product?.name || "Unknown Product"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product?.description?.substring(0, 50) ||
                              "No description available"}
                            {item.product?.description?.length > 50
                              ? "..."
                              : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.order_date ? formatDate(item.order_date) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.order_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.order_status
                          ? item.order_status.charAt(0).toUpperCase() +
                            item.order_status.slice(1)
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.amount_paid
                        ? `$${(item.amount_paid / 100).toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.generations_remaining !== undefined &&
                      item.generations_remaining !== null ? (
                        <div className="flex items-center">
                          <span
                            className={`font-medium ${
                              item.generations_remaining > 0
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            {item.generations_remaining}
                          </span>
                          <RefreshCw className="ml-2 h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <span className="text-gray-500">Unlimited</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/documents/${item.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {item.product?.file_path && (
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={item.product.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
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

      {/* User Documents Section */}
      <h2 className="text-xl font-bold mb-4">My Created Documents</h2>
      {userDocuments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No documents yet</h2>
          <p className="text-gray-500 mb-6">
            You haven&quot;t created any documents yet. Browse our products to
            get started.
          </p>
          <Button asChild>
            <Link href="/product">Browse Document Templates</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg shadow-sm border overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      getDocumentStatus(doc) === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {getStatusIcon(getDocumentStatus(doc))}
                    <span className="ml-1">{getDocumentStatus(doc)}</span>
                  </span>
                </div>

                <h3 className="text-lg font-medium mb-1">
                  {getDocumentTypeName(doc)}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{doc.product_name}</p>

                <div className="space-y-1 text-sm text-gray-500 mb-6">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{formatDate(doc.purchase_date)}</span>
                  </div>
                  {doc.expiry_date && (
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{formatDate(doc.expiry_date)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Document ID:</span>
                    <span className="font-mono">{doc.id.substring(0, 8)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button asChild className="flex-1">
                    <Link href={`/dashboard/documents/${doc.id}`}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/api/documents/${doc.id}/download`}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Documents section */}
      <div className="mt-12 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Available Documents</h2>
          <Button asChild variant="outline">
            <Link href="/product">Browse All Products</Link>
          </Button>
        </div>

        {!availableDocuments || availableDocuments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <p className="text-gray-500">
              No available documents found in the catalog.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {availableDocuments.slice(0, 5).map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Book className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {doc.title || doc.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {doc.id.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.document_type || "Standard Document"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="line-clamp-2">
                          {doc.description || "No description available"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button asChild size="sm">
                          <Link href={`/product/${doc.slug || doc.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {availableDocuments.length > 5 && (
              <div className="bg-gray-50 px-6 py-3 text-center">
                <Link
                  href="/product"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View all {availableDocuments.length} available documents
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
