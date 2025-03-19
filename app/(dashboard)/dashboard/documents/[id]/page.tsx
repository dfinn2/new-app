// app/(dashboard)/dashboard/documents/[id]/page.tsx
import { auth } from "@/auth";
import { getDocumentById } from "@/lib/db/documents";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Download, Printer, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const userId = session?.user?.id as string;
  
  // Fetch document details
  const document = await getDocumentById(params.id, userId);
  
  if (!document) {
    notFound();
  }
  
  // Format document type name
  const getDocumentTypeName = (doc: any) => {
    if (doc.document_type) return doc.document_type;
    if (doc.product_name.toLowerCase().includes('nnn')) return 'NNN Agreement';
    if (doc.product_name.toLowerCase().includes('oem')) return 'OEM Agreement';
    return 'Legal Document';
  };
  
  // Get parties involved
  const getParties = (doc: any) => {
    const parties = [];
    if (doc.disclosing_party) parties.push(doc.disclosing_party);
    if (doc.receiving_party) parties.push(doc.receiving_party);
    return parties.length > 0 ? parties : ['Not specified'];
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/documents" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to documents
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{getDocumentTypeName(document)}</h1>
            <div className="flex space-x-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/documents/${document.id}/download`}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/documents/${document.id}/print`}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Created on {formatDate(document.purchase_date)}</span>
            
            {document.expiry_date && (
              <>
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>Expires on {formatDate(document.expiry_date)}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-4">Document Preview</h2>
            <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px]">
              {document.content ? (
                <div dangerouslySetInnerHTML={{ __html: document.content }} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>Preview not available</p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href={`/dashboard/documents/${document.id}/download`}>
                      Download to view
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Document Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Document ID:</span>
                  <span className="font-mono">{document.id.substring(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`${
                    document.status === 'completed' 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  }`}>
                    {document.status === 'completed' ? 'Active' : 'Processing'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{getDocumentTypeName(document)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>{formatDate(document.purchase_date)}</span>
                </div>
                {document.signed_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Signed:</span>
                    <span>{formatDate(document.signed_date)}</span>
                  </div>
                )}
                {document.expiry_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires:</span>
                    <span>{formatDate(document.expiry_date)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Parties Involved</h3>
              <div className="space-y-2 text-sm">
                {getParties(document).map((party, index) => (
                  <div key={index} className="py-1">
                    <div className="font-medium">{index === 0 ? 'Disclosing Party' : 'Receiving Party'}</div>
                    <div>{party}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Related Documents</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">No related documents found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}