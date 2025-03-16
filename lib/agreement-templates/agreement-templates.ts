// lib/agreement-templates.ts
import { NNNAgreementFormData } from '@/schema/nnnAgreementSchema';

export function renderNNNAgreementHTML(data: NNNAgreementFormData): string {
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Non-Disclosure, Non-Use and Non-Circumvention Agreement</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
        
        body {
          font-family: 'Roboto', Arial, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: #333;
          margin: 2cm;
        }
        
        h1 {
          font-size: 18px;
          text-align: center;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        p {
          margin-bottom: 10px;
          text-align: justify;
        }
        
        strong {
          font-weight: 700;
        }
        
        .header {
          margin-bottom: 30px;
        }
        
        .section {
          margin-bottom: 15px;
        }
        
        .clause {
          margin-bottom: 15px;
        }
        
        .party-info {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        
        .signature-block {
          margin-top: 40px;
          page-break-inside: avoid;
        }
        
        .signature-row {
          display: flex;
          justify-content: space-between;
        }
        
        .signature-party {
          width: 45%;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 40px;
          margin-bottom: 10px;
        }
        
        .date {
          text-align: right;
          margin-bottom: 30px;
        }
        
        .page-break {
          page-break-after: always;
        }
      </style>
    </head>
    <body>
      <div class="date">Date: ${currentDate}</div>
    
      <h1>NON-DISCLOSURE, NON-USE AND NON-CIRCUMVENTION AGREEMENT</h1>
      
      <div class="section">
        <p>
          This Non-Disclosure, Non-Use and Non-Circumvention Agreement (the "Agreement") is entered into as of the date of signature by and between:
        </p>
      </div>
      
      <div class="party-info">
        <p><strong>DISCLOSING PARTY:</strong></p>
        <p>
          ${data.disclosingPartyName}, 
          a ${data.disclosingPartyType}
          ${data.disclosingPartyBusinessNumber && data.disclosingPartyType === "Corporation" ? 
            ` with business number ${data.disclosingPartyBusinessNumber}` : 
            ""}
        </p>
      </div>
      
      <div class="party-info">
        <p><strong>RECEIVING PARTY:</strong></p>
        <p>
          ${data.receivingPartyName}
          ${data.receivingPartyNameChinese ? ` (${data.receivingPartyNameChinese})` : ""}
        </p>
        <p>Address: ${data.receivingPartyAddress}</p>
        <p>USCC: ${data.receivingPartyUSCC}</p>
      </div>
      
      <div class="section">
        <p><strong>WHEREAS:</strong></p>
        
        <p>
          Disclosing Party wishes to disclose to Receiving Party certain confidential information in 
          relation to ${data.productName} (the "Product") for the purpose of 
          evaluation and potential business cooperation, and Receiving Party wishes to receive such information subject to 
          the terms and conditions set forth in this Agreement.
        </p>
      </div>
      
      <div class="section">
        <p><strong>NOW, THEREFORE, THE PARTIES AGREE AS FOLLOWS:</strong></p>
      </div>
      
      <div class="clause">
        <p><strong>1. Confidential Information</strong></p>
        <p>
          "Confidential Information" means any and all information disclosed by Disclosing Party 
          to Receiving Party, whether orally, in writing, or by any other means, relating to the 
          Product, including but not limited to technical data, trade secrets, know-how, research, 
          product plans, products, services, customers, markets, software, developments, inventions, 
          processes, formulas, technology, designs, drawings, engineering, hardware configuration 
          information, marketing, finances or other business information.
        </p>
      </div>
      
      <div class="clause">
        <p><strong>2. Non-Disclosure and Non-Use</strong></p>
        <p>
          Receiving Party agrees not to disclose any Confidential Information to any third party 
          and not to use any Confidential Information for any purpose other than evaluation and potential
          business cooperation. Receiving Party shall protect the Confidential Information with at least the same degree 
          of care it uses to protect its own confidential information, but in no case less than 
          reasonable care.
        </p>
      </div>
      
      <div class="clause">
        <p><strong>3. Non-Circumvention</strong></p>
        <p>
          Receiving Party agrees not to circumvent Disclosing Party in any way with respect to the 
          Product or any business opportunity related to the Product, including but not limited to 
          contacting manufacturers, suppliers, distributors, customers or business partners of 
          Disclosing Party without the prior written consent of Disclosing Party.
        </p>
      </div>
      
      <div class="clause">
        <p><strong>4. Product Description</strong></p>
        <p>${data.productDescription}</p>
        ${data.productTrademark === "have" ? 
          "<p>The Product is a registered trademark owned by Disclosing Party.</p>" : 
          data.productTrademark === "want" ? 
          "<p>Disclosing Party intends to register the Product as a trademark.</p>" : 
          ""}
      </div>
      
      <div class="clause">
        <p><strong>5. Arbitration</strong></p>
        <p>
          Any dispute arising out of or in connection with this Agreement shall be referred to and 
          finally resolved by arbitration administered by the ${data.arbitration} 
          in accordance with its rules, which rules are deemed to be incorporated by reference in this clause.
        </p>
      </div>
      
      <div class="clause">
        <p><strong>6. Penalty for Breach</strong></p>
        <p>
          ${data.penaltyDamages === "liquidatedDamages" ? 
            `In the event of a breach of this Agreement by Receiving Party, Receiving Party shall pay 
            to Disclosing Party, as liquidated damages and not as a penalty, the sum of USD 100,000. 
            The parties acknowledge that the harm caused by such breach would be impossible or very 
            difficult to accurately estimate at the time of breach, and that this liquidated damages 
            provision is a reasonable forecast of just compensation.` : 
            `In the event of a breach of this Agreement by Receiving Party, Receiving Party shall be 
            liable to Disclosing Party for all direct, indirect, consequential and special damages, 
            including but not limited to lost profits, suffered by Disclosing Party as a result of 
            such breach, and Disclosing Party shall be entitled to seek all available legal and 
            equitable remedies, including injunctive relief.`}
        </p>
      </div>
      
      <div class="clause">
        <p><strong>7. Governing Law</strong></p>
        <p>
          This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction of the Disclosing Party, 
          without giving effect to any choice of law or conflict of law provisions.
        </p>
      </div>
      
      <div class="signature-block">
        <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first above written.</p>
        
        <div class="signature-row">
          <div class="signature-party">
            <p><strong>DISCLOSING PARTY:</strong></p>
            <div class="signature-line"></div>
            <p>Name: ${data.disclosingPartyName}</p>
            <p>Title: ________________________</p>
            <p>Date: ________________________</p>
          </div>
          
          <div class="signature-party">
            <p><strong>RECEIVING PARTY:</strong></p>
            <div class="signature-line"></div>
            <p>Name: ${data.receivingPartyName}</p>
            <p>Title: ________________________</p>
            <p>Date: ________________________</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}