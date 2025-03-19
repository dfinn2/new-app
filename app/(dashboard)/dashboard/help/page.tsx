// app/(dashboard)/dashboard/help/page.tsx
import Link from "next/link";
import { HelpCircle, MessageCircle, Mail, FileText, Book, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium mb-2">Chat Support</h2>
            <p className="text-sm text-gray-500 mb-4">
              Get real-time help from our support team through live chat.
            </p>
            <Button>
              Start Chat
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-medium mb-2">Email Support</h2>
            <p className="text-sm text-gray-500 mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <Button asChild variant="outline">
              <a href="mailto:support@example.com">
                Email Us
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-medium">Frequently Asked Questions</h2>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              How do I download my documents?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-gray-600">
                You can download your documents from the Documents section of your dashboard. Simply click on the document you want to download, then click the "Download" button.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-b px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              How do I update my payment information?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-gray-600">
                You can update your payment information in the Settings section of your dashboard. Go to "Settings", then "Payment Methods", and click on "Manage Payment Methods".
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-b px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              What happens after I purchase a document?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-gray-600">
                After you purchase a document, it will be immediately available in your Documents section. You'll also receive an email confirmation with a link to access your document.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-b px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              Can I edit my documents after purchase?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-gray-600">
                Yes, you can edit your documents after purchase. Simply go to the Documents section, open the document you want to edit, and click the "Edit" button. Note that some documents may have limitations on what can be edited.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="px-6">
            <AccordionTrigger className="py-4 hover:no-underline">
              How secure are my documents?
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-gray-600">
                Your documents are stored securely in our encrypted database. We use industry-standard security measures to protect your information. Only you and any users you explicitly share with can access your documents.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center mb-4">
          <Book className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-medium">Documentation</h2>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-1">User Guide</h3>
            <p className="text-sm text-gray-500 mb-2">
              A comprehensive guide to using our platform and its features.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/docs/user-guide">
                <FileText className="h-4 w-4 mr-1" />
                View Guide
              </Link>
            </Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-1">Document Templates</h3>
            <p className="text-sm text-gray-500 mb-2">
              Learn about the different document templates available on our platform.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/docs/templates">
                <FileText className="h-4 w-4 mr-1" />
                View Templates
              </Link>
            </Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-1">API Documentation</h3>
            <p className="text-sm text-gray-500 mb-2">
              Technical documentation for developers integrating with our API.
            </p>
            <Button asChild variant="outline" size="sm">
              <a href="/api/docs" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View API Docs
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-2">
          <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-medium">Still need help?</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Our support team is available Monday through Friday, 9am to 5pm Eastern Time. We typically respond to all inquiries within 24 hours.
        </p>
        <div className="flex space-x-4">
          <Button asChild>
            <a href="mailto:support@example.com">
              Contact Support
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="tel:+18001234567">
              Call Us
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}