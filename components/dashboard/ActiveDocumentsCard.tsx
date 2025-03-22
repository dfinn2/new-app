import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface DocumentType {
  id: string;
  document_type?: string;
  product_name: string;
  purchase_date: string;
}

export default function ActiveDocumentsCard({ documents = [] }: { documents: DocumentType[] }) {
  const formatDocType = (doc: DocumentType) => {
    return doc.document_type || 
      (doc.product_name?.toLowerCase().includes('nnn') ? 'NNN Agreement' : 'Document');
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Active Documents</h3>
        <Link 
          href="/dashboard/documents" 
          className="text-blue-600 text-sm hover:underline flex items-center"
          aria-label="View all documents"
        >
          View all 
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </div>
      
      {!documents || documents.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No active documents found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.slice(0, 3).map((doc) => (
            <Link 
              key={doc.id} 
              href={`/dashboard/documents/${doc.id}`}
              className="block"
              aria-label={`View ${formatDocType(doc)}`}
            >
              <div className="p-3 border rounded-lg flex items-center hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-medium">{formatDocType(doc)}</h4>
                  <p className="text-sm text-gray-500">
                    Created: {doc.purchase_date ? formatDate(doc.purchase_date) : 'Unknown date'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}