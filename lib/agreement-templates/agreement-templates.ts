// lib/agreement-templates/agreement-templates.ts
import { NNNAgreementFormData } from '@/schemas/nnnAgreementSchema';

/**
 * Renders a bilingual (English/Chinese) NNN Agreement as HTML based on form data
 */
export function renderNNNAgreementHTML(data: NNNAgreementFormData): string {
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format Chinese date
  const chineseDate = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric' 
  });

  // Get agreement duration
  const duration = data.agreementDuration || "5";
  const durationUnit = data.durationUnit || "years";
  const chineseDurationUnit = durationUnit === "years" ? "年" : "个月";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Non-Disclosure, Non-Use and Non-Circumvention Agreement</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Noto+Serif:wght@400;700&display=swap');
        
        body {
          font-family: 'Noto Serif', serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000;
          margin: 2cm;
        }
        
        h1 {
          font-size: 16pt;
          text-align: center;
          margin-bottom: 20px;
          font-weight: 700;
        }
        
        p {
          margin-bottom: 10px;
          text-align: justify;
        }
        
        .chinese {
          font-family: 'Noto Sans SC', sans-serif;
          color: #333;
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
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        td {
          vertical-align: top;
          padding: 5px;
        }
        
        .english {
          width: 50%;
        }
        
        .chinese {
          width: 50%;
        }
      </style>
    </head>
    <body>
      <div class="date">
        <p>Date / 日期: ${currentDate} / ${chineseDate}</p>
      </div>
    
      <h1>NON-DISCLOSURE, NON-USE AND NON-CIRCUMVENTION AGREEMENT<br>
      <span class="chinese">保密、不使用和不规避协议</span></h1>
      
      <div class="section">
        <table>
          <tr>
            <td class="english">
              <p>
                This Non-Disclosure, Non-Use and Non-Circumvention Agreement (the "Agreement") is entered into as of the date of signature by and between:
              </p>
            </td>
            <td class="chinese">
              <p>
                本保密、不使用和不规避协议（"协议"）于上述日期由以下双方签订：
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="party-info">
        <table>
          <tr>
            <td class="english">
              <p><strong>DISCLOSING PARTY:</strong></p>
              <p>
                ${data.disclosingPartyName}, 
                ${data.disclosingPartyType === "Corporation" ? "a corporation" : 
                  data.disclosingPartyType === "Individual" ? "an individual" : "an entity"}
                ${data.disclosingPartyBusinessNumber && data.disclosingPartyType === "Corporation" ? 
                  ` with business number ${data.disclosingPartyBusinessNumber}` : ""}
                  ${data.disclosingPartyAddress ? `, located at ${data.disclosingPartyAddress}` : ""}
              </p>
            </td>
            <td class="chinese">
              <p><strong>披露方：</strong></p>
              <p>
                ${data.disclosingPartyName}，
                ${data.disclosingPartyType === "Corporation" ? "一家公司" : 
                  data.disclosingPartyType === "Individual" ? "个人" : "一个实体"}
                ${data.disclosingPartyBusinessNumber && data.disclosingPartyType === "Corporation" ? 
                  `，营业执照号码为${data.disclosingPartyBusinessNumber}` : ""}
                ${data.disclosingPartyAddress ? `，地址位于${data.disclosingPartyAddress}` : ""}
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="party-info">
        <table>
          <tr>
            <td class="english">
              <p><strong>RECEIVING PARTY:</strong></p>
              <p>
                ${data.receivingPartyName}
                ${data.receivingPartyNameChinese ? ` (${data.receivingPartyNameChinese})` : ""}
                ${data.receivingPartyAddress ? `, located at ${data.receivingPartyAddress}` : ""}
              </p>
              <p>USCC Number: ${data.receivingPartyUSCC}</p>
            </td>
            <td class="chinese">
              <p><strong>接收方：</strong></p>
              <p>
                ${data.receivingPartyNameChinese || data.receivingPartyName}，
                ${data.receivingPartyAddress ? `地址位于${data.receivingPartyAddress}` : ""}
              </p>
              <p>统一社会信用代码: ${data.receivingPartyUSCC}</p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="section">
        <table>
          <tr>
            <td class="english">
              <p><strong>WHEREAS:</strong></p>
              <ol>
                <li>
                  <p>
                    Disclosing Party wishes to disclose to Receiving Party certain confidential information in 
                    relation to ${data.productName} (the "Product") for the purpose of potential business cooperation.
                  </p>
                </li>
                <li>
                  <p>
                    Receiving Party wishes to receive such information subject to the terms and conditions set forth 
                    in this Agreement.
                  </p>
                </li>
              </ol>
            </td>
            <td class="chinese">
              <p><strong>鉴于：</strong></p>
              <ol>
                <li>
                  <p>
                    披露方希望向接收方披露与${data.productName}（"产品"）相关的某些机密信息，以便潜在的业务合作。
                  </p>
                </li>
                <li>
                  <p>
                    接收方希望根据本协议规定的条款和条件接收此类信息。
                  </p>
                </li>
              </ol>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="section">
        <table>
          <tr>
            <td class="english">
              <p><strong>NOW, THEREFORE, THE PARTIES AGREE AS FOLLOWS:</strong></p>
            </td>
            <td class="chinese">
              <p><strong>现在，因此，双方同意如下：</strong></p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>1. CONFIDENTIAL INFORMATION</strong></p>
              <p>
                "Confidential Information" means any and all information disclosed by Disclosing Party 
                to Receiving Party, whether orally, in writing, or by any other means, relating to the 
                Product, including but not limited to technical data, trade secrets, know-how, research, 
                product plans, products, services, customers, markets, software, developments, inventions, 
                processes, formulas, technology, designs, drawings, engineering, hardware configuration 
                information, marketing, finances or other business information.
              </p>
            </td>
            <td class="chinese">
              <p><strong>1. 保密信息</strong></p>
              <p>
                "保密信息"是指披露方以口头、书面或任何其他方式向接收方披露的与产品有关的任何和所有信息，包括但不限于技术数据、商业秘密、专有技术、研究、产品计划、产品、服务、客户、市场、软件、开发、发明、工艺、配方、技术、设计、图纸、工程、硬件配置信息、营销、财务或其他商业信息。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>2. NON-DISCLOSURE</strong></p>
              <p>
                Receiving Party agrees to keep all Confidential Information strictly confidential and not to 
                disclose any part of it to any third party without the prior written consent of Disclosing Party. 
                Receiving Party shall use the same degree of care to protect the Confidential Information as it 
                uses to protect its own confidential information of similar importance, but in no event less than 
                reasonable care.
              </p>
            </td>
            <td class="chinese">
              <p><strong>2. 不披露</strong></p>
              <p>
                接收方同意对所有保密信息严格保密，未经披露方事先书面同意，不得向任何第三方披露其任何部分。接收方应使用与保护自己同等重要的保密信息相同程度的谨慎来保护保密信息，但在任何情况下都不得低于合理谨慎的程度。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>3. NON-USE</strong></p>
              <p>
                Receiving Party agrees not to use any Confidential Information for any purpose other than to 
                evaluate and engage in discussions concerning a potential business relationship between the parties. 
                In particular, Receiving Party shall not use the Confidential Information to manufacture, have 
                manufactured, or reverse engineer products that compete with the Product or are derivatives of the Product.
              </p>
            </td>
            <td class="chinese">
              <p><strong>3. 不使用</strong></p>
              <p>
                接收方同意不将任何保密信息用于评估和讨论双方之间潜在业务关系以外的任何目的。特别是，接收方不得使用保密信息来制造、委托制造或反向工程与产品竞争或衍生于产品的产品。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>4. NON-CIRCUMVENTION</strong></p>
              <p>
                During the term of this Agreement and for a period of ${duration} ${durationUnit} thereafter, 
                Receiving Party agrees not to circumvent, avoid, bypass, or obviate Disclosing Party, directly 
                or indirectly, to avoid payment of fees or commissions in any transaction with Disclosing Party's 
                suppliers, customers or other business relationships that were introduced by Disclosing Party.
              </p>
            </td>
            <td class="chinese">
              <p><strong>4. 不规避</strong></p>
              <p>
                在本协议期限内及其后${duration}${chineseDurationUnit}期间，接收方同意不直接或间接规避、避开、绕过或回避披露方，以避免在与披露方介绍的披露方供应商、客户或其他业务关系的任何交易中支付费用或佣金。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>5. PRODUCT INFORMATION</strong></p>
              <p>
                The Product subject to this Agreement is described as follows: ${data.productDescription}
              </p>
              ${data.productTrademark === "have" ? `
              <p>
                The Product is a registered trademark owned by Disclosing Party.
              </p>
              ` : data.productTrademark === "want" ? `
              <p>
                Disclosing Party intends to register the Product as a trademark.
              </p>
              ` : ''}
            </td>
            <td class="chinese">
              <p><strong>5. 产品信息</strong></p>
              <p>
                本协议所涉及的产品描述如下：${data.productDescription}
              </p>
              ${data.productTrademark === "have" ? `
              <p>
                该产品是披露方拥有的注册商标。
              </p>
              ` : data.productTrademark === "want" ? `
              <p>
                披露方打算将该产品注册为商标。
              </p>
              ` : ''}
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>6. DISPUTE RESOLUTION</strong></p>
              <p>
                Any dispute arising out of or in connection with this Agreement shall be referred to and finally resolved by 
                arbitration administered by the ${data.arbitration} in accordance with its rules, which rules are 
                deemed to be incorporated by reference in this clause.
              </p>
            </td>
            <td class="chinese">
              <p><strong>6. 争议解决</strong></p>
              <p>
                因本协议引起的或与本协议有关的任何争议，应提交${
                  data.arbitration === "Hong Kong International Arbitration Centre" ? "香港国际仲裁中心" : 
                  data.arbitration === "Singapore International Arbitration Centre" ? "新加坡国际仲裁中心" : 
                  data.arbitration === "China International Economic and Trade Arbitration Commission" ? "中国国际经济贸易仲裁委员会" : 
                  data.arbitration === "International Chamber of Commerce" ? "国际商会仲裁院" : 
                  "香港国际仲裁中心"
                }进行仲裁，并按照其规则最终解决，该规则被视为通过引用纳入本条款。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>7. BREACH AND REMEDIES</strong></p>
              ${data.penaltyDamages === "liquidatedDamages" ? `
              <p>
                In the event of a breach of this Agreement by Receiving Party, Receiving Party shall pay to Disclosing Party, 
                as liquidated damages and not as a penalty, the sum of USD 100,000. The parties acknowledge that the harm 
                caused by such breach would be impossible or very difficult to accurately estimate at the time of breach, 
                and that this liquidated damages provision is a reasonable forecast of just compensation.
              </p>
              ` : `
              <p>
                In the event of a breach of this Agreement by Receiving Party, Receiving Party shall be liable to Disclosing 
                Party for all direct, indirect, consequential and special damages, including but not limited to lost profits, 
                suffered by Disclosing Party as a result of such breach, and Disclosing Party shall be entitled to seek all 
                available legal and equitable remedies, including injunctive relief.
              </p>
              `}
            </td>
            <td class="chinese">
              <p><strong>7. 违约与救济</strong></p>
              ${data.penaltyDamages === "liquidatedDamages" ? `
              <p>
                如果接收方违反本协议，接收方应向披露方支付100,000美元作为违约赔偿金，而非惩罚性赔偿。双方确认，在违约时，此类违约造成的损害将不可能或非常难以准确估计，并且此违约赔偿金条款是对公正补偿的合理预测。
              </p>
              ` : `
              <p>
                如果接收方违反本协议，接收方应对披露方因此类违约而遭受的所有直接、间接、后果性和特殊损害（包括但不限于利润损失）负责，并且披露方有权寻求所有可用的法律和衡平法救济，包括禁令救济。
              </p>
              `}
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>8. TERM AND TERMINATION</strong></p>
              <p>
                This Agreement shall remain in effect for a period of ${duration} ${durationUnit} from the date of execution. 
                The obligations of confidentiality, non-use, and non-circumvention shall survive the termination of 
                this Agreement.
              </p>
            </td>
            <td class="chinese">
              <p><strong>8. 期限与终止</strong></p>
              <p>
                本协议自签署之日起生效，有效期为${duration}${chineseDurationUnit}。保密、不使用和不规避的义务在本协议终止后继续有效。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="clause">
        <table>
          <tr>
            <td class="english">
              <p><strong>9. GOVERNING LAW</strong></p>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of ${data.governingLaw || "Hong Kong SAR"}, 
                without giving effect to any choice of law or conflict of law provisions.
              </p>
            </td>
            <td class="chinese">
              <p><strong>9. 适用法律</strong></p>
              <p>
                本协议应受${
                  data.governingLaw === "Hong Kong SAR" ? "中国香港特别行政区" : 
                  data.governingLaw === "China" ? "中华人民共和国" : 
                  data.governingLaw === "Singapore" ? "新加坡" : 
                  "中国香港特别行政区"
                }法律管辖并按其解释，不适用任何法律选择或法律冲突条款。
              </p>
            </td>
          </tr>
        </table>
      </div>
      
      <div class="signature-block">
        <table>
          <tr>
            <td class="english">
              <p><strong>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.</strong></p>
            </td>
            <td class="chinese">
              <p><strong>兹证明，双方已于上述日期签署本协议。</strong></p>
            </td>
          </tr>
        </table>
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
          <div style="width: 45%;">
            <table>
              <tr>
                <td class="english">
                  <p><strong>DISCLOSING PARTY:</strong></p>
                </td>
                <td class="chinese">
                  <p><strong>披露方：</strong></p>
                </td>
              </tr>
            </table>
            
            <div style="border-top: 1px solid #000; margin-top: 40px; margin-bottom: 10px;"></div>
            
            <table>
              <tr>
                <td class="english">
                  <p>Name: ${data.disclosingPartyName || "_________________"}</p>
                </td>
                <td class="chinese">
                  <p>姓名：${data.disclosingPartyName || "_________________"}</p>
                </td>
              </tr>
              <tr>
                <td class="english">
                  <p>Title: _________________</p>
                </td>
                <td class="chinese">
                  <p>职务：_________________</p>
                </td>
              </tr>
              <tr>
                <td class="english">
                  <p>Date: _________________</p>
                </td>
                <td class="chinese">
                  <p>日期：_________________</p>
                </td>
              </tr>
            </table>
          </div>
          
          <div style="width: 45%;">
            <table>
              <tr>
                <td class="english">
                  <p><strong>RECEIVING PARTY:</strong></p>
                </td>
                <td class="chinese">
                  <p><strong>接收方：</strong></p>
                </td>
              </tr>
            </table>
            
            <div style="border-top: 1px solid #000; margin-top: 40px; margin-bottom: 10px;"></div>
            
            <table>
              <tr>
                <td class="english">
                  <p>Name: ${data.receivingPartyName || "_________________"}</p>
                </td>
                <td class="chinese">
                  <p>姓名：${data.receivingPartyNameChinese || data.receivingPartyName || "_________________"}</p>
                </td>
              </tr>
              <tr>
                <td class="english">
                  <p>Title: _________________</p>
                </td>
                <td class="chinese">
                  <p>职务：_________________</p>
                </td>
              </tr>
              <tr>
                <td class="english">
                  <p>Date: _________________</p>
                </td>
                <td class="chinese">
                  <p>日期：_________________</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      
    </body>
    </html>
  `;
}