// app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { renderNNNAgreementHTML } from '@/lib/agreement-templates/agreement-templates';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api', 
  key: process.env.MAILGUN_API_KEY || '',
  // Uncomment the line below if using EU region
  // url: 'https://api.eu.mailgun.net'
});

// Define global btoa function for Node.js environment
const btoa = (text: string) => Buffer.from(text).toString('base64');

// Export for POST requests - Note this is a named export
export async function POST(request: NextRequest) {
  try {
    console.log("POST request received to /api/generate-pdf");
    
    // Parse the request body
    const requestData = await request.json();
    const { documentType, data, userEmail } = requestData;
    
    if (!documentType || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log("Processing document type:", documentType);
    
    // Generate HTML based on document type
    let htmlContent = '';
    let filename = '';
    
    if (documentType === 'nnn-agreement') {
      try {
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
      return NextResponse.json(
        { success: false, message: 'Unsupported document type' },
        { status: 400 }
      );
    }

    // Get PDFShift API key
    const apiKey = process.env.PDFSHIFT_API_KEY;
    if (!apiKey) {
      console.error('PDFShift API key not configured');
      return NextResponse.json(
        { success: false, message: 'PDF generation service not configured' },
        { status: 500 }
      );
    }

    // Check if Mailgun domain is configured
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    if (!mailgunDomain) {
      console.error('Mailgun domain not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not properly configured' },
        { status: 500 }
      );
    }

    console.log("Calling PDFShift API");
    
    // Generate PDF with PDFShift
    try {
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

      console.log("PDF generation successful");

      if (!pdfResponse.data || pdfResponse.data.length === 0) {
        console.error('Received empty response from PDFShift');
        return NextResponse.json(
          { success: false, message: 'Received empty response from PDF service' },
          { status: 500 }
        );
      }

      // Get the PDF as a buffer
      const pdfBuffer = Buffer.from(pdfResponse.data);
      
      // Base64 encode the PDF for sending in the response
      const base64Pdf = pdfBuffer.toString('base64');

      // Send emails if user email is provided
      let emailSent = false;
      if (userEmail) {
        try {
          console.log("Sending email to:", userEmail);
          
          // Email to user using Mailgun
          await mg.messages.create(mailgunDomain, {
            from: `${process.env.EMAIL_FROM_NAME || 'Document Service'} <${process.env.EMAIL_FROM_ADDRESS || `mailgun@${mailgunDomain}`}>`,
            to: [userEmail],
            subject: `Your ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'Document'} is Ready`,
            text: `Thank you for using our service. Your document is attached to this email.`,
            html: `
              <h2>Your Document is Ready</h2>
              <p>Thank you for using our service. Your document is attached to this email.</p>
              <p>If you have any questions, please contact our support team.</p>
            `,
            attachment: [
              {
                data: pdfBuffer,
                filename: filename,
                contentType: 'application/pdf',
              }
            ]
          });

          // Copy to internal email if configured
          if (process.env.INTERNAL_EMAIL) {
            console.log("Sending copy to internal email");
            
            await mg.messages.create(mailgunDomain, {
              from: `${process.env.EMAIL_FROM_NAME || 'Document Service'} <${process.env.EMAIL_FROM_ADDRESS || `mailgun@${mailgunDomain}`}>`,
              to: [process.env.INTERNAL_EMAIL],
              subject: `New ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'Document'} Generated`,
              text: `A new document was generated for ${userEmail}.`,
              html: `
                <h2>New Document Generated</h2>
                <p>A new ${documentType === 'nnn-agreement' ? 'NNN Agreement' : 'document'} was generated for ${userEmail}.</p>
                <h3>Customer Information:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>
              `,
              attachment: [
                {
                  data: pdfBuffer,
                  filename: filename,
                  contentType: 'application/pdf',
                }
              ]
            });
          }
          
          emailSent = true;
          console.log("Email sent successfully via Mailgun");
        } catch (emailError) {
          console.error('Error sending email with Mailgun:', emailError);
          // Continue even if email fails - we'll still return the PDF
        }
      }

      // Return success with the PDF data and filename
      console.log("Returning successful response");
      
      return NextResponse.json({
        success: true,
        filename,
        pdfData: base64Pdf,
        emailSent
      });
      
    } catch (pdfError) {
      console.error('Error calling PDFShift API:', pdfError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to generate PDF',
          error: pdfError instanceof Error ? pdfError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
    
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