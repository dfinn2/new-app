// app/(dashboard)/dashboard/documents/[id]/page.tsx
import { getDocumentById, getDocumentData } from "@/lib/db/userDocuments";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Clock, 
  Calendar, 
  Mail, 
  Share2, 
  Eye, 
  DownloadCloud 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DocumentDetailPage({ params }: { params: { id: string } }) {
  // Get the Supabase client
  const supabase = await createClient();
  
  // Get authenticated user using Supabase directly
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If not authenticated, redirect to login or 404
  if (!user || error) {
    notFound();
  }
  
  const userId = user.id;
  
  // Fetch document details
  const document = await getDocumentById(params.id, userId);
  
  if (!document) {
    notFound();
  }
  
  // Get additional document data like form data
  const documentData = await getDocumentData(params.id);
  
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
    
    // If we have form data, try to get more detailed information
    if (documentData?.form_data) {
      const formData = documentData.form_data;
      if (formData.disclosingPartyName && !parties.includes(formData.disclosingPartyName)) {
        parties.push(formData.disclosingPartyName);
      }
      if (formData.receivingPartyName && !parties.includes(formData.receivingPartyName)) {
        parties.push(formData.receivingPartyName);
      }
    }
    
    return parties.length > 0 ? parties : ['Not specified'];
  };
  
  // Construct download URL
  const downloadUrl = `/api/documents/${document.id}/download`;
  
  // Check if PDF is embedded
  const hasPdf = !!documentData?.document_content;
  
  // Extract some key details from form data if available
  const formData = documentData?.form_data || {};
  
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
                <a href={downloadUrl} download>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/documents/${document.id}/print`}>
                  <Printer className="h-4 w-4 mr-1" />
                  Print
                </Link>
              </Button>
              {document.file_path && (
                <Button asChild variant="outline" size="sm">
                  <a href={document.file_path} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
              )}
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
            
            <span className="mx-2">•</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              document.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {document.status === 'completed' ? 'Active' : 'Processing'}
            </span>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium mb-4">Document Preview</h2>
            
            {hasPdf ? (
              <div className="border rounded-lg overflow-hidden bg-gray-50 h-[600px]">
                <iframe 
                  src={`data:application/pdf;base64,${documentData.document_content}`} 
                  className="w-full h-full"
                  title="Document Preview"
                ></iframe>
              </div>
            ) : document.file_path ? (
              <div className="border rounded-lg overflow-hidden bg-gray-50 h-[600px]">
                <iframe 
                  src={document.file_path} 
                  className="w-full h-full"
                  title="Document Preview"
                ></iframe>
              </div>
            ) : (
              <div className="border rounded-lg p-8 bg-gray-50 min-h-[400px] flex flex-col items-center justify-center">
                <DownloadCloud className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Preview not available</p>
                <Button asChild size="sm">
                  <a href={downloadUrl} download>
                    Download to view
                  </a>
                </Button>
              </div>
            )}
            
            {/* Document actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={downloadUrl} download>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </a>
              </Button>
              
              {document.file_path && (
                <Button asChild variant="outline" size="sm">
                  <a href={document.file_path} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-1" />
                    View in Browser
                  </a>
                </Button>
              )}
              
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/documents/${document.id}/email`}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email Document
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/documents/${document.id}/share`}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share Document
                </Link>
              </Button>
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
                {formData.email && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Parties Involved</h3>
              <div className="space-y-3 text-sm">
                {getParties(document).map((party, index) => (
                  <div key={index} className="py-1">
                    <div className="font-medium">{index === 0 ? 'Disclosing Party' : 'Receiving Party'}</div>
                    <div>{party}</div>
                    
                    {/* Add more details from form data if available */}
                    {index === 0 && formData.disclosingPartyType && (
                      <div className="text-gray-500 text-xs mt-1">
                        Type: {formData.disclosingPartyType}
                      </div>
                    )}
                    
                    {index === 1 && formData.receivingPartyAddress && (
                      <div className="text-gray-500 text-xs mt-1">
                        Address: {formData.receivingPartyAddress}
                      </div>
                    )}
                    
                    {index === 1 && formData.receivingPartyUSCC && (
                      <div className="text-gray-500 text-xs mt-1">
                        USCC: {formData.receivingPartyUSCC}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {formData.productName && (
              <div className="border rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {formData.productName}
                  </div>
                  {formData.productDescription && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-gray-600 mt-1">{formData.productDescription}</p>
                    </div>
                  )}
                  {formData.productTrademark && (
                    <div>
                      <span className="font-medium">Trademark Status:</span> {
                        formData.productTrademark === 'have' ? 'Has Trademark' :
                        formData.productTrademark === 'want' ? 'Wants Trademark' :
                        'Not Interested'
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            
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