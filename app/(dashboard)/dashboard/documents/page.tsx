// app/(dashboard)/dashboard/documents/page.tsx
import { auth } from "@/auth";
//import { getUserPurchases } from "@/lib/supabase/purchases";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { FileText, Download, ExternalLink, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function DocumentsPage() {
  const session = await auth();
  const userId = session?.user?.id as string;
  
  // Fetch user's purchased documents - use a different variable name for clarity
  // const userDocuments = await getUserPurchases(userId);
  

  // Fetch all available documents from the documents table
  let availableDocuments = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*');
    

    if (error) {
      console.error('Error fetching available documents:', error);
    } else {
      availableDocuments = data || [];
    }
  } catch (error) {
    console.error('Error with Supabase client:', error);
  }
  
  const getDocumentTypeName = (doc: any) => {
    if (doc.document_type) return doc.document_type;
    if (doc.product_name?.toLowerCase().includes('nnn')) return 'NNN Agreement';
    if (doc.product_name?.toLowerCase().includes('oem')) return 'OEM Agreement';
    return 'Legal Document';
  };
  
  const getDocumentStatus = (doc: any) => {
    if (doc.document_status) return doc.document_status;
    return doc.status === 'completed' ? 'Active' : 'Processing';
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Existing My Documents section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Button asChild>
          <Link href="/product">
            Get More Documents
          </Link>
        </Button>
      </div>
      
      {/* Existing My Documents section 
      {userDocuments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-medium mb-2">No documents yet</h2>
          <p className="text-gray-500 mb-6">You haven't created any documents yet. Browse our products to get started.</p>
          <Button asChild>
            <Link href="/product">
              Browse Document Templates
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    getDocumentStatus(doc) === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {getDocumentStatus(doc)}
                  </span>
                </div>
                
                <h3 className="text-lg font-medium mb-1">{getDocumentTypeName(doc)}</h3>
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
                    <Link href={`/dashboard/documents/${doc.id}/download`}>
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
      */} 
      {/* Document Categories section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Document Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/dashboard/documents?category=nnn" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2">NNN Agreements</h3>
            <p className="text-sm text-gray-500">
              Non-disclosure, non-use, and non-circumvention agreements to protect your intellectual property.
            </p>
          </Link>
          
          <Link 
            href="/dashboard/documents?category=manufacturing" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2">Manufacturing Agreements</h3>
            <p className="text-sm text-gray-500">
              OEM and manufacturing agreements for product production.
            </p>
          </Link>
          
          <Link 
            href="/dashboard/documents?category=intellectual" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2">IP Protection</h3>
            <p className="text-sm text-gray-500">
              Patents, trademarks, and other intellectual property protection documents.
            </p>
          </Link>
        </div>
      </div>
      
      {/* New section: Available Documents */}
      <div className="mt-12 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Available Documents</h2>
          <Button asChild variant="outline">
            <Link href="/product">
              Browse All Products
            </Link>
          </Button>
        </div>
        
        {!availableDocuments || availableDocuments.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <p className="text-gray-500">No available documents found in the catalog.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
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
                            <div className="text-sm font-medium text-gray-900">{doc.title || doc.name}</div>
                            <div className="text-sm text-gray-500">ID: {doc.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.document_type || 'Standard Document'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="line-clamp-2">
                          {doc.description || 'No description available'}
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
                <Link href="/product" className="text-blue-600 hover:underline text-sm">
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