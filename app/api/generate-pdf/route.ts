// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { renderNNNAgreementHTML } from '@/lib/agreement-templates/agreement-templates';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { createClient } from '@/utils/supabase/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mg: any = null;
try {
  if (process.env.MAILGUN_API_KEY) {
    console.log("Initializing Mailgun client");
    const mailgun = new Mailgun(formData);
    mg = mailgun.client({
      username: 'api', 
      key: process.env.MAILGUN_API_KEY,
      // FOR EU USE UNCOMMENT FOLLOWING LINE
      // url: 'https://api.eu.mailgun.net'
    });
    console.log("Mailgun client initialized");
  } else {
    console.log("MAILGUN_API_KEY environment variable not set");
  }
} catch (error) {
  console.error("Error initializing Mailgun:", error);
}

// Define global btoa function for Node.js environment
const btoa = (text: string) => Buffer.from(text).toString('base64');

// Function to save PDF to Supabase Storage
async function savePdfToStorage(pdfBuffer: Buffer, filename: string, userId: string) {
  try {
    console.log("Saving PDF to Supabase Storage");
    
    // Initialize Supabase server client
    const supabase = await createClient();
    
    // Verify the user exists and is authenticated
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new Error("Failed to authenticate: " + (authError?.message || "User not found"));
    }
    
    // Define the storage path based on user ID
    const filePath = `${userId}/${filename}`;
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    console.log("PDF uploaded successfully to storage:", data);
    
    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading PDF to Supabase Storage:', error);
    throw error;
  }
}

// Function to save document record to database
async function saveDocumentToDatabase(
  userId: string, 
  filename: string, 
  filePath: string, 
  documentType: string
) {
  try {
    console.log("Saving document record to database");
    
    // Initialize Supabase server client
    const supabase = await createClient();
    
    // Insert record into documents table
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: filename,
        file_path: filePath,
        document_type: documentType,
        status: 'completed',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    console.log("Document record saved:", data);
    return data.id;
  } catch (error) {
    console.error('Error saving document record:', error);
    throw error;
  }
}

// Export for POST requests
export async function POST(request: NextRequest) {
  try {
    console.log("POST request received to /api/generate-pdf");
    
    // Parse the request body
    const requestData = await request.json();
    const { documentType, data, userEmail, userId } = requestData;
    
    if (!documentType || !data) {
      console.error('Missing required fields in request');
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log("Processing document type:", documentType);
    console.log("Using email:", userEmail);
    
    // Generate HTML based on document type
    let htmlContent = '';
    let filename = '';
    
    if (documentType === 'nnn-agreement') {
      try {
        console.log("Generating NNN Agreement HTML template");
        htmlContent = renderNNNAgreementHTML(data);
        filename = `NNN_Agreement_${data.disclosingPartyName?.replace(/\s+/g, '_') || 'Unnamed'}_${Date.now()}.pdf`;
      } catch (templateError) {
        console.error('Error rendering template:', templateError);
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to render document template', 
            error: templateError instanceof Error ? templateError.message : 'Unknown error' 
          },
          { status: 500 }
        );
      }
    } else {
      console.error('Unsupported document type:', documentType);
      return NextResponse.json(
        { success: false, message: 'Unsupported document type' },
        { status: 400 }
      );
    }

    // For development/testing without PDFShift API
    // Uncomment this block if you want to test without PDFShift
    if (process.env.NODE_ENV === 'development' && !process.env.PDFSHIFT_API_KEY) {
      console.log("DEVELOPMENT MODE: Using test PDF instead of PDFShift");
      // Base64 encoded minimal PDF for testing
      const base64Pdf = "JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAFLSyzIUAhLLSrOzM9TKMlXSEosqlRIrShiBABLnwbHCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago0NQplbmRvYmoKMiAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDMgMCBSIC9SZXNvdXJjZXMgNiAwIFIgL0NvbnRlbnRzIDQgMCBSIC9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCj4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDIgMCBSIF0gL0NvdW50IDEgPj4KZW5kb2JqCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDMgMCBSID4+CmVuZG9iago2IDAgb2JqCjw8IC9Qcm9jU2V0IFsgL1BERiBdID4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyNTYgMDAwMDAgbiAKMDAwMDAwMDA5MCAwMDAwMCBuIAowMDAwMDAwMTk5IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NyAwMDAwMCBuIAowMDAwMDAwMzA1IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNyAvUm9vdCAxIDAgUiAvSUQgWyA8MzFjMWJmNjM5MTAzYmNjYTRmNjQ0NDM3YzdhZWYyNTc+CjwzMWMxYmY2MzkxMDNiY2NhNGY2NDQ0MzdjN2FlZjI1Nz4gXSA+PgpzdGFydHhyZWYKMzM0CiUlRU9GCg==";
      
      // Create a binary buffer from the base64 string
      const pdfBuffer = Buffer.from(base64Pdf, 'base64');
      
      // If userId is provided, save to Supabase Storage
      let fileUrl = null;
      let documentId = null;
      
      if (userId) {
        try {
          // Verify user exists in Supabase
          const supabase = await createClient();
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
          
          if (userError || !userData.user) {
            console.error("Invalid or non-existent user ID:", userError || "User not found");
            // Continue without storage since we can't verify the user
          } else {
            // Save PDF to storage
            fileUrl = await savePdfToStorage(pdfBuffer, filename, userId);
            
            // Save document record to database
            documentId = await saveDocumentToDatabase(userId, filename, fileUrl, documentType);
          }
        } catch (storageError) {
          console.error("Storage/database error:", storageError);
          // Continue without storage - the user will still get the PDF
        }
      }
      
      // Log what would happen in production
      if (userEmail) {
        console.log("In production, would send email to:", userEmail);
      }
      
      return NextResponse.json({
        success: true,
        filename,
        pdfData: base64Pdf,
        fileUrl,
        documentId,
        emailSent: false
      });
    }

    // Check if PDFShift API key is configured
    const apiKey = process.env.PDFSHIFT_API_KEY;
    if (!apiKey) {
      console.error('PDFShift API key not configured');
      return NextResponse.json(
        { success: false, message: 'PDF generation service not configured' },
        { status: 500 }
      );
    }
    
    // Check Mailgun configuration
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    if (!mailgunDomain) {
      console.log("MAILGUN_DOMAIN environment variable not set");
    }
    
    if (!mg) {
      console.log("Mailgun client not initialized, emails will not be sent");
    }
    
    let emailSent = false;
    let fileUrl = null;
    let documentId = null;
    
    console.log("Calling PDFShift API to generate PDF");
    let pdfBuffer: Buffer;
    
    try {
      // Try to generate PDF with PDFShift
      const pdfResponse = await axios.post(
        'https://api.pdfshift.io/v3/convert/pdf',
        {
          source: htmlContent,
          landscape: false,
          format: 'A4',
          margin: '20mm',
          sandbox: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`api:${apiKey}`),
          },
          responseType: 'arraybuffer',
          timeout: 60000, // 60 second timeout
        }
      );

      console.log("PDF generation successful, response status:", pdfResponse.status);

      if (!pdfResponse.data || !pdfResponse.data.length) {
        console.error('Received empty response from PDFShift');
        throw new Error('Empty response from PDF service');
      }

      // Get the PDF as a buffer
      pdfBuffer = Buffer.from(pdfResponse.data);
      console.log("PDF buffer created, size:", pdfBuffer.length, "bytes");
      
      // If userId is provided, save to Supabase Storage
      if (userId) {
        try {
          // Save PDF to storage
          fileUrl = await savePdfToStorage(pdfBuffer, filename, userId);
          
          // Save document record to database
          documentId = await saveDocumentToDatabase(userId, filename, fileUrl, documentType);
        } catch (storageError) {
          console.error("Storage/database error:", storageError);
          // Continue without storage - the user will still get the PDF
        }
      }
      
    } catch (pdfError) {
      console.error('Error calling PDFShift API:', pdfError);
      
      // For development, return a mockup PDF if PDFShift fails
      if (process.env.NODE_ENV === 'development') {
        console.log("DEVELOPMENT MODE: Using fallback PDF due to PDFShift error");
        const base64Pdf = "JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1IDAgUiAvRmlsdGVyIC9GbGF0ZURlY29kZSA+PgpzdHJlYW0KeAFLSyzIUAhLLSrOzM9TKMlXSEosqlRIrShiBABLnwbHCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago0NQplbmRvYmoKMiAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDMgMCBSIC9SZXNvdXJjZXMgNiAwIFIgL0NvbnRlbnRzIDQgMCBSIC9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCj4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDIgMCBSIF0gL0NvdW50IDEgPj4KZW5kb2JqCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDMgMCBSID4+CmVuZG9iago2IDAgb2JqCjw8IC9Qcm9jU2V0IFsgL1BERiBdID4+CmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyNTYgMDAwMDAgbiAKMDAwMDAwMDA5MCAwMDAwMCBuIAowMDAwMDAwMTk5IDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NyAwMDAwMCBuIAowMDAwMDAwMzA1IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNyAvUm9vdCAxIDAgUiAvSUQgWyA8MzFjMWJmNjM5MTAzYmNjYTRmNjQ0NDM3YzdhZWYyNTc+CjwzMWMxYmY2MzkxMDNiY2NhNGY2NDQ0MzdjN2FlZjI1Nz4gXSA+PgpzdGFydHhyZWYKMzM0CiUlRU9GCg==";
        return NextResponse.json({
          success: true,
          filename,
          pdfData: base64Pdf,
          emailSent: false
        });
      }
        
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to generate PDF',
          error: pdfError instanceof Error ? pdfError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
    
    // Base64 encode the PDF for sending in the response
    const base64Pdf = pdfBuffer.toString('base64');
    console.log("PDF encoded to base64, length:", base64Pdf.length);

    // Send emails if user email is provided and Mailgun is configured
    if (userEmail && mailgunDomain && mg) {
      try {
        console.log("Sending email to:", userEmail);
        console.log("Using Mailgun domain:", mailgunDomain);
        
        // Construct the email sender string
        const fromEmail = process.env.EMAIL_FROM_ADDRESS || `mailgun@${mailgunDomain}`;
        const fromName = process.env.EMAIL_FROM_NAME || 'Document Service';
        const sender = `${fromName} <${fromEmail}>`;
        
        console.log("Email will be sent from:", sender);
        
        // Email to user using Mailgun
        try {
          const emailResult = await mg.messages.create(mailgunDomain, {
            from: sender,
            to: userEmail,
            subject: `Your ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'Document'} is Ready`,
            text: `Thank you for using our service. Your document is attached to this email.`,
            html: `
              <h2>Your Document is Ready</h2>
              <p>Thank you for using our service. Your document is attached to this email.</p>
              <p>If you have any questions, please contact our support team.</p>
              ${fileUrl ? `<p>You can also access your document online at <a href="${fileUrl}">${fileUrl}</a></p>` : ''}
            `,
            attachment: [
              {
                data: pdfBuffer,
                filename: filename,
                contentType: 'application/pdf',
              }
            ]
          });
          
          console.log("Mailgun message creation response:", emailResult);
          emailSent = true;
        } catch (attachmentError) {
          console.error("Error sending email with attachment:", attachmentError);
          // Try again without attachment as fallback
          try {
            console.log("Trying to send email without attachment as fallback");
            const emailResult = await mg.messages.create(mailgunDomain, {
              from: sender,
              to: userEmail,
              subject: `Your ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'Document'} is Ready`,
              text: `Thank you for using our service. Your document is ready and can be downloaded from our website.`,
              html: `
                <h2>Your Document is Ready</h2>
                <p>Thank you for using our service. Your document is ready and can be downloaded from our website.</p>
                <p>If you have any questions, please contact our support team.</p>
                ${fileUrl ? `<p>You can access your document online at <a href="${fileUrl}">${fileUrl}</a></p>` : ''}
              `
            });
            
            console.log("Fallback email sent without attachment:", emailResult);
            emailSent = true;
          } catch (fallbackError) {
            console.error("Error sending fallback email without attachment:", fallbackError);
            throw fallbackError;
          }
        }

        // Copy to internal email if configured
        if (process.env.INTERNAL_EMAIL) {
          try {
            console.log("Sending copy to internal email:", process.env.INTERNAL_EMAIL);
            
            await mg.messages.create(mailgunDomain, {
              from: sender,
              to: process.env.INTERNAL_EMAIL,
              subject: `New ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'Document'} Generated`,
              text: `A new document was generated for ${userEmail}.`,
              html: `
                <h2>New Document Generated</h2>
                <p>A new ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'document'} was generated for ${userEmail}.</p>
                <h3>Customer Information:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
                ${fileUrl ? `<p>Document URL: <a href="${fileUrl}">${fileUrl}</a></p>` : ''}
                ${documentId ? `<p>Document ID: ${documentId}</p>` : ''}
              `,
              attachment: [
                {
                  data: pdfBuffer,
                  filename: filename,
                  contentType: 'application/pdf',
                }
              ]
            });
            
            console.log("Internal copy email sent successfully");
          } catch (internalEmailError) {
            console.error("Error sending internal copy email:", internalEmailError);
            // Continue even if internal email fails
          }
        }
        
        console.log("Email sent successfully via Mailgun");
      } catch (emailError) {
        console.error('Error in email sending process:', emailError);
        // Log more details about the error
        if (emailError instanceof Error) {
          console.error('Error name:', emailError.name);
          console.error('Error message:', emailError.message);
          console.error('Error stack:', emailError.stack);
        } else {
          console.error('Unknown error type:', typeof emailError);
        }
        
        // Continue even if email fails - we'll still return the PDF
      }
    } else {
      // Log why email wasn't sent
      if (!userEmail) {
        console.log("No user email provided, skipping email");
      } else if (!mailgunDomain) {
        console.log("No Mailgun domain configured, skipping email");
      } else if (!mg) {
        console.log("Mailgun client not initialized, skipping email");
      }
    }

    // Return success with the PDF data and filename
    console.log("Returning successful response with PDF data");
    
    return NextResponse.json({
      success: true,
      filename,
      pdfData: base64Pdf,
      fileUrl,
      documentId,
      emailSent
    });
    
  } catch (error) {
    console.error('Unhandled error in API route:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Unhandled server error', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export for OPTIONS requests for CORS support
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
  });
}