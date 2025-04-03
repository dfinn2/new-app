// components/product-previews/NnnAgreementPreview.tsx
import { useState } from "react";
import { NNNAgreementFormData } from "@/schemas/nnnAgreementSchema";
import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NNNAgreementPreviewProps {
  product: any;
  formData: Partial<NNNAgreementFormData>; // Use Partial to allow incomplete form data during editing
  isGenerating?: boolean;
  basePrice: number;
}


const NNNAgreementPreview = ({ product, formData, isGenerating = false }: NNNAgreementPreviewProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = () => setIsLightboxOpen(true);
  const closeLightbox = () => setIsLightboxOpen(false);
  
  // Safe casting of form data to our expected type
  const data = formData as Partial<NNNAgreementFormData>;
  
  // Check if we have sufficient data to show a meaningful preview
  
  
  // Helper function to format the current date in a readable format
  const formatDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  
  // Handle loading/generating state
  if (isGenerating) {
    return (
      <div className="h-full border border-gray-300 rounded shadow-sm p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your document...</p>
        </div>
      </div>
    );
  }
  
  // Format the agreement preview based on form data
  const agreementPreview = (
    <div className="relative font-serif">
      {/* Document Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">NON-DISCLOSURE, NON-USE, AND NON-CIRCUMVENTION AGREEMENT</h1>
        <h1 className="text-xl font-bold text-gray-700 mb-6">保密、不使用和不规避协议</h1>
        
        <p className="text-gray-700">
          THIS AGREEMENT is made on this _____ day of __________, 20___ (&quot;Effective Date&quot;)
        </p>
        <p className="text-gray-500 mb-4">
          本协议于20___年___月___日（&quot;生效日期&quot;）订立
        </p>
      </div>
      
      {/* Parties Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">BETWEEN:</h2>
        <h2 className="text-base font-bold mb-4">订立方：</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>{data.disclosingPartyName || "[DISCLOSING PARTY NAME]"}</strong>, 
          a {data.disclosingPartyType || "company"} incorporated under the laws of {data.disclosingPartyJurisdiction || "[Jurisdiction]"}, 
          with its registered office at {data.disclosingPartyAddress || "[Address]"} 
          (hereinafter referred to as the &quot;Disclosing Party&quot;)
        </p>
        <p className="text-gray-500 mb-6">
          <strong>{data.disclosingPartyName || "[披露方名称]"}</strong>，
          一家根据{data.disclosingPartyJurisdiction || "[司法管辖区]"}法律注册成立的{data.disclosingPartyType === "Individual" ? "个人" : data.disclosingPartyType === "Corporation" ? "公司" : "实体"}，
          其注册办事处位于{data.disclosingPartyAddress || "[地址]"}
          （以下简称&quot;披露方&quot;）
        </p>
        
        <h2 className="text-lg font-bold mb-2">AND:</h2>
        <h2 className="text-base font-bold mb-4">和：</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>{data.receivingPartyName || "[MANUFACTURER NAME IN ENGLISH]"}</strong> / 
          <strong>{data.receivingPartyNameChinese || "[制造商中文名称]"}</strong>, 
          a company incorporated under the laws of the People&apos;s Republic of China, 
          with its registered office at {data.receivingPartyAddress || "[Manufacturer Address]"}, 
          with Unified Social Credit Code (USCC) {data.receivingPartyUSCC || "[USCC Number]"} 
          (hereinafter referred to as the &quot;Manufacturer&quot;)
        </p>
        <p className="text-gray-500 mb-6">
          <strong>{data.receivingPartyName || "[制造商英文名称]"}</strong> / 
          <strong>{data.receivingPartyNameChinese || "[制造商中文名称]"}</strong>，
          一家根据中华人民共和国法律注册成立的公司，
          其注册办事处位于{data.receivingPartyAddress || "[制造商地址]"}，
          统一社会信用代码（USCC）{data.receivingPartyUSCC || "[USCC号码]"}
          （以下简称&quot;制造商&quot;）
        </p>
        
        <p className="text-gray-700">
          (each a &quot;Party&quot; and collectively the &quot;Parties&quot;)
        </p>
        <p className="text-gray-500">
          （各自为&quot;一方&quot;，统称为&quot;双方&quot;）
        </p>
      </div>
      
      {/* Recitals Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">RECITALS:</h2>
        <h2 className="text-base font-bold mb-4">前言：</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>A.</strong> The Disclosing Party is engaged in the business of manufacturing, marketing and selling {data.productName || "[Product Name]"} (the "Product"). 
          The Product is described as follows: {data.productDescription || "[Product Description]"}.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>A.</strong> 披露方从事{data.productName || "[产品名称]"}（&quot;产品&quot;）的制造、营销和销售业务。
          该产品描述如下：{data.productDescription || "[产品描述]"}。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>B.</strong> The Manufacturer has expertise in manufacturing similar products and the Parties are exploring a potential business relationship whereby the Manufacturer would manufacture the Product for the Disclosing Party.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>B.</strong> 制造商在制造类似产品方面拥有专业知识，双方正在探索潜在的业务关系，据此制造商将为披露方制造产品。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>C.</strong> In the course of their discussions and potential business relationship, the Disclosing Party may provide the Manufacturer with certain confidential and proprietary information relating to the Product, its design, specifications, manufacturing processes, marketing strategies, and other business information.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>C.</strong> 在双方讨论和潜在业务关系过程中，披露方可能向制造商提供与产品、其设计、规格、制造工艺、营销策略和其他商业信息相关的某些机密和专有信息。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>D.</strong> The Parties wish to ensure that such information remains confidential and is not used by the Manufacturer except as expressly permitted by this Agreement.
        </p>
        <p className="text-gray-500 mb-5">
          <strong>D.</strong> 双方希望确保此类信息保持机密，并且除本协议明确允许外，制造商不得使用此类信息。
        </p>
        
        <p className="text-gray-700 font-semibold">
          NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:
        </p>
        <p className="text-gray-500 font-semibold">
          因此，鉴于本协议中包含的相互约定和协议，以及其他良好且有价值的对价，特此确认收到并充分考虑，双方同意如下：
        </p>
      </div>
      
      {/* Definitions Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">1. DEFINITIONS</h2>
        <h2 className="text-base font-bold mb-4">1. 定义</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>1.1</strong> &quot;Confidential Information&quot; means any and all information disclosed by the Disclosing Party to the Manufacturer, whether oral, written, electronic or in any other form, that:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>1.1</strong> &quot;机密信息&quot;是指披露方向制造商披露的任何及所有信息，无论是口头、书面、电子或任何其他形式，且：
        </p>
        
        <div className="ml-6 mb-2">
          <p className="text-gray-700 mb-1">
            (a) is designated as confidential at the time of disclosure or within 14 days thereafter; or
          </p>
          <p className="text-gray-500 mb-3">
            (a) 在披露时或披露后14天内被指定为机密信息；或
          </p>
          
          <p className="text-gray-700 mb-1">
            (b) a reasonable person would understand to be confidential or proprietary in nature, including but not limited to information relating to the Product, its design, specifications, components, manufacturing processes, prototypes, samples, costs, pricing, marketing strategies, business plans, customer lists, supplier details, and other business information; or
          </p>
          <p className="text-gray-500 mb-3">
            (b) 合理人士会理解为具有机密或专有性质的信息，包括但不限于与产品、其设计、规格、组件、制造工艺、原型、样品、成本、定价、营销策略、业务计划、客户名单、供应商详情和其他商业信息相关的信息；或
          </p>
          
          <p className="text-gray-700 mb-1">
            (c) constitutes trade secrets under applicable law.
          </p>
          <p className="text-gray-500 mb-3">
            (c) 根据适用法律构成商业秘密。
          </p>
        </div>
      </div>
      
      {/* Non-Disclosure Obligations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">2. NON-DISCLOSURE OBLIGATIONS</h2>
        <h2 className="text-base font-bold mb-4">2. 保密义务</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>2.1</strong> The Manufacturer agrees to maintain in strict confidence all Confidential Information and shall not disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>2.1</strong> 制造商同意严格保密所有机密信息，未经披露方事先书面同意，不得向任何第三方披露任何机密信息。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>2.2</strong> The Manufacturer shall limit access to the Confidential Information to only those of its officers, directors, employees, consultants, and advisors who:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>2.2</strong> 制造商应将机密信息的访问权限仅限于其高管、董事、员工、顾问和顾问中的那些：
        </p>
        
        <div className="ml-6">
          <p className="text-gray-700 mb-1">
            (a) have a need to know such information for the purpose of evaluating or performing the potential business relationship;
          </p>
          <p className="text-gray-500 mb-3">
            (a) 因评估或执行潜在业务关系的目的而需要了解此类信息的人员；
          </p>
          
          <p className="text-gray-700 mb-1">
            (b) have been informed of the confidential nature of the information; and
          </p>
          <p className="text-gray-500 mb-3">
            (b) 已被告知信息的机密性质；且
          </p>
          
          <p className="text-gray-700 mb-1">
            (c) are bound by confidentiality obligations no less restrictive than those contained in this Agreement.
          </p>
          <p className="text-gray-500 mb-3">
            (c) 受到不低于本协议所含保密义务限制的人员。
          </p>
        </div>
      </div>
      
      {/* Non-Use Obligations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">3. NON-USE OBLIGATIONS</h2>
        <h2 className="text-base font-bold mb-4">3. 不使用义务</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>3.1</strong> The Manufacturer shall not use any Confidential Information for any purpose other than to evaluate and perform the potential business relationship with the Disclosing Party.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>3.1</strong> 制造商不得将任何机密信息用于评估和执行与披露方的潜在业务关系以外的任何目的。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>3.2</strong> Without limiting the generality of Section 3.1, the Manufacturer shall not:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>3.2</strong> 在不限制第3.1节一般性的情况下，制造商不得：
        </p>
        
        <div className="ml-6">
          <p className="text-gray-700 mb-1">
            (a) use the Confidential Information to design, develop, manufacture, market, or sell any product that is the same as or similar to the Product;
          </p>
          <p className="text-gray-500 mb-3">
            (a) 使用机密信息设计、开发、制造、营销或销售与产品相同或相似的任何产品；
          </p>
          
          <p className="text-gray-700 mb-1">
            (b) reverse engineer, disassemble, or decompile any prototypes, software, or other tangible objects that embody the Confidential Information;
          </p>
          <p className="text-gray-500 mb-3">
            (b) 对体现机密信息的任何原型、软件或其他有形对象进行逆向工程、拆解或反编译；
          </p>
          
          <p className="text-gray-700 mb-1">
            (c) analyze the composition or structure of any samples or materials provided by the Disclosing Party, except as expressly authorized in writing; or
          </p>
          <p className="text-gray-500 mb-3">
            (c) 分析披露方提供的任何样品或材料的组成或结构，除非获得明确书面授权；或
          </p>
          
          <p className="text-gray-700 mb-1">
            (d) file any patent, trademark, copyright, or other intellectual property application based upon or derived from the Confidential Information.
          </p>
          <p className="text-gray-500 mb-3">
            (d) 基于或源自机密信息申请任何专利、商标、版权或其他知识产权。
          </p>
        </div>
      </div>
      
      {/* Non-Circumvention Obligations Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">4. NON-CIRCUMVENTION OBLIGATIONS</h2>
        <h2 className="text-base font-bold mb-4">4. 不规避义务</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>4.1</strong> The Manufacturer shall not, directly or indirectly:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>4.1</strong> 制造商不得直接或间接：
        </p>
        
        <div className="ml-6">
          <p className="text-gray-700 mb-1">
            (a) contact, solicit, or enter into any agreement with any customer, supplier, distributor, or business partner of the Disclosing Party that has been identified in or introduced through the Confidential Information, without the prior written consent of the Disclosing Party;
          </p>
          <p className="text-gray-500 mb-3">
            (a) 未经披露方事先书面同意，联系、招揽或与在机密信息中被识别或通过机密信息介绍的披露方的任何客户、供应商、分销商或业务伙伴达成任何协议；
          </p>
          
          <p className="text-gray-700 mb-1">
            (b) interfere with or disrupt the Disclosing Party&apos;s relationships with its customers, suppliers, distributors, or business partners;
          </p>
          <p className="text-gray-500 mb-3">
            (b) 干扰或破坏披露方与其客户、供应商、分销商或业务伙伴的关系；
          </p>
          
          <p className="text-gray-700 mb-1">
            (c) circumvent the Disclosing Party in any transaction with any customer, supplier, distributor, or business partner of the Disclosing Party; or
          </p>
          <p className="text-gray-500 mb-3">
            (c) 在与披露方的任何客户、供应商、分销商或业务伙伴的任何交易中规避披露方；或
          </p>
          
          <p className="text-gray-700 mb-1">
            (d) compete with the Disclosing Party in any business opportunity related to the Product or arising from the Confidential Information.
          </p>
          <p className="text-gray-500 mb-3">
            (d) 在与产品相关或源自机密信息的任何商业机会中与披露方竞争。
          </p>
        </div>
      </div>
      
      {/* Duration Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">9. TERM AND TERMINATION</h2>
        <h2 className="text-base font-bold mb-4">9. 期限和终止</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>9.1</strong> This Agreement shall commence on the Effective Date and shall continue until the earlier of:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>9.1</strong> 本协议自生效日期开始，持续至以下较早发生者：
        </p>
        
        <div className="ml-6">
          <p className="text-gray-700 mb-1">
            (a) the Parties enter into a definitive manufacturing agreement that supersedes this Agreement; or
          </p>
          <p className="text-gray-500 mb-3">
            (a) 双方签订取代本协议的最终制造协议；或
          </p>
          
          <p className="text-gray-700 mb-1">
            (b) either Party provides written notice of termination to the other Party.
          </p>
          <p className="text-gray-500 mb-3">
            (b) 任一方向另一方提供书面终止通知。
          </p>
        </div>
        
        <p className="text-gray-700 mb-2">
          <strong>9.2</strong> Notwithstanding termination of this Agreement, the Manufacturer&apos;s obligations regarding non-disclosure, non-use, and non-circumvention shall continue for a period of {data.agreementDuration || "five (5)"} {data.durationType === "years" ? "years" : "months"} following the later of:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>9.2</strong> 尽管本协议终止，制造商关于保密、不使用和不规避的义务应在以下较晚发生者后的{data.agreementDuration || "五(5)"}个{data.durationType === "years" ? "年" : "月"}内继续有效：
        </p>
        
        <div className="ml-6">
          <p className="text-gray-700 mb-1">
            (a) the termination of this Agreement; or
          </p>
          <p className="text-gray-500 mb-3">
            (a) 本协议终止；或
          </p>
          
          <p className="text-gray-700 mb-1">
            (b) the completion or termination of the manufacturing relationship between the Parties.
          </p>
          <p className="text-gray-500 mb-3">
            (b) 双方之间的制造关系完成或终止。
          </p>
        </div>
      </div>
      
      {/* Liquidated Damages Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">10. LIQUIDATED DAMAGES</h2>
        <h2 className="text-base font-bold mb-4">10. 违约金</h2>
        
        {data.penaltyDamages === "fixedAmount" ? (
          <>
            <p className="text-gray-700 mb-2">
              <strong>10.1</strong> The Parties acknowledge that a breach of this Agreement may result in irreparable harm to the Disclosing Party for which monetary damages would be inadequate. In the event of a breach or threatened breach of this Agreement by the Manufacturer, the Manufacturer shall pay to the Disclosing Party, as liquidated damages and not as a penalty, the sum of ${data.penaltyAmount || "[AMOUNT]"} (USD), which the Parties agree is a reasonable estimate of the damages that would be suffered by the Disclosing Party.
            </p>
            <p className="text-gray-500 mb-4">
              <strong>10.1</strong> 双方确认，违反本协议可能导致披露方遭受金钱损害赔偿不足以弥补的不可弥补的损害。如果制造商违反或威胁违反本协议，制造商应向披露方支付${data.penaltyAmount || "[金额]"}(USD)作为违约金而非罚款，双方同意这是对披露方可能遭受的损害的合理估计。
            </p>
          </>
        ) : data.penaltyDamages === "contractMultiple" ? (
          <>
            <p className="text-gray-700 mb-2">
              <strong>10.1</strong> The Parties acknowledge that a breach of this Agreement may result in irreparable harm to the Disclosing Party for which monetary damages would be inadequate. In the event of a breach or threatened breach of this Agreement by the Manufacturer, the Manufacturer shall pay to the Disclosing Party, as liquidated damages and not as a penalty, an amount equal to {data.penaltyMultiple || "[NUMBER]"} times the total value of all purchase orders or contracts between the Parties during the previous twelve (12) months (or the term of the relationship if shorter), which the Parties agree is a reasonable estimate of the damages that would be suffered by the Disclosing Party.
            </p>
            <p className="text-gray-500 mb-4">
              <strong>10.1</strong> 双方确认，违反本协议可能导致披露方遭受金钱损害赔偿不足以弥补的不可弥补的损害。如果制造商违反或威胁违反本协议，制造商应向披露方支付相当于双方在过去十二(12)个月（或如果关系期限更短，则为关系期限）内所有采购订单或合同总价值{data.penaltyMultiple || "[数字]"}倍的金额作为违约金而非罚款，双方同意这是对披露方可能遭受的损害的合理估计。
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-2">
              <strong>10.1</strong> The Parties acknowledge that a breach of this Agreement may result in irreparable harm to the Disclosing Party for which monetary damages would be inadequate. In the event of a breach or threatened breach of this Agreement by the Manufacturer, the Manufacturer shall pay to the Disclosing Party, as liquidated damages and not as a penalty:
            </p>
            <p className="text-gray-500 mb-4">
              <strong>10.1</strong> 双方确认，违反本协议可能导致披露方遭受金钱损害赔偿不足以弥补的不可弥补的损害。如果制造商违反或威胁违反本协议，制造商应向披露方支付以下金额作为违约金而非罚款：
            </p>
            
            <div className="ml-6">
              <p className="text-gray-700 mb-1">
                (a) For a minor breach (such as limited accidental disclosure without commercial use): $50,000 (USD);
              </p>
              <p className="text-gray-500 mb-3">
                (a) 对于轻微违约（如有限的意外披露而无商业使用）：$50,000 (USD)；
              </p>
              
              <p className="text-gray-700 mb-1">
                (b) For a significant breach (such as unauthorized use without widespread disclosure): $100,000 (USD); or
              </p>
              <p className="text-gray-500 mb-3">
                (b) 对于重大违约（如未经授权使用但未广泛披露）：$100,000 (USD)；或
              </p>
              
              <p className="text-gray-700 mb-1">
                (c) For a severe breach (such as unauthorized manufacturing, widespread disclosure, or circumvention): $250,000 (USD).
              </p>
              <p className="text-gray-500 mb-3">
                (c) 对于严重违约（如未经授权制造、广泛披露或规避）：$250,000 (USD)。
              </p>
              
              <p className="text-gray-700">
                The Parties agree that these amounts are reasonable estimates of the damages that would be suffered by the Disclosing Party based on the severity of the breach.
              </p>
              <p className="text-gray-500 mb-3">
                双方同意，这些金额是基于违约严重程度对披露方可能遭受的损害的合理估计。
              </p>
            </div>
          </>
        )}
        
        <p className="text-gray-700 mb-2">
          <strong>10.2</strong> The payment of liquidated damages shall not be the exclusive remedy for a breach of this Agreement, and the Disclosing Party shall be entitled to seek other remedies available at law or in equity, including but not limited to injunctive relief, specific performance, and actual damages to the extent they exceed the liquidated damages amount.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>10.2</strong> 支付违约金不应是违反本协议的唯一补救措施，披露方有权寻求法律或衡平法上可用的其他补救措施，包括但不限于禁令救济、强制履行和超过违约金金额的实际损害赔偿。
        </p>
      </div>
      
      {/* Governing Law and Dispute Resolution Sections */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">11. GOVERNING LAW AND LANGUAGE</h2>
        <h2 className="text-base font-bold mb-4">11. 适用法律和语言</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>11.1</strong> This Agreement shall be governed by and construed in accordance with the laws of the People&apos;s Republic of China.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>11.1</strong> 本协议应受中华人民共和国法律管辖并据其解释。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>11.2</strong> This Agreement is executed in both Chinese and English languages. In case of any inconsistency between the two language versions, the Chinese version shall prevail.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>11.2</strong> 本协议以中文和英文双语签署。如两种语言版本有任何不一致之处，以中文版本为准。
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-2">12. DISPUTE RESOLUTION</h2>
        <h2 className="text-base font-bold mb-4">12. 争议解决</h2>
        
        <p className="text-gray-700 mb-2">
          <strong>12.1</strong> Any dispute, controversy or claim arising out of or relating to this Agreement, or the breach, termination or invalidity thereof, shall be settled by arbitration.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>12.1</strong> 因本协议引起的或与本协议有关的任何争议、纠纷或索赔，或违约、终止或无效，应通过仲裁解决。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>12.2</strong> The arbitration shall be administered by:
        </p>
        <p className="text-gray-500 mb-4">
          <strong>12.2</strong> 仲裁应由以下机构管理：
        </p>
        
        {data.arbitration === "CIETAC Beijing" ? (
          <>
            <p className="text-gray-700 mb-2 ml-6">
              The China International Economic and Trade Arbitration Commission (CIETAC) in accordance with its arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Beijing, China.
            </p>
            <p className="text-gray-500 mb-4 ml-6">
              中国国际经济贸易仲裁委员会(CIETAC)，根据申请仲裁时有效的仲裁规则。仲裁地点为中国北京。
            </p>
          </>
        ) : data.arbitration === "CIETAC Shanghai" ? (
          <>
            <p className="text-gray-700 mb-2 ml-6">
              The China International Economic and Trade Arbitration Commission (CIETAC) Shanghai Sub-Commission in accordance with its arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Shanghai, China.
            </p>
            <p className="text-gray-500 mb-4 ml-6">
              中国国际经济贸易仲裁委员会(CIETAC)上海分会，根据申请仲裁时有效的仲裁规则。仲裁地点为中国上海。
            </p>
          </>
        ) : data.arbitration === "HKIAC" ? (
          <>
            <p className="text-gray-700 mb-2 ml-6">
              The Hong Kong International Arbitration Centre (HKIAC) in accordance with its administered arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Hong Kong SAR, China.
            </p>
            <p className="text-gray-500 mb-4 ml-6">
              香港国际仲裁中心(HKIAC)，根据申请仲裁时有效的仲裁规则。仲裁地点为中国香港特别行政区。
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-2 ml-6">
              The Shenzhen Court of International Arbitration (SCIA) in accordance with its arbitration rules in effect at the time of the application for arbitration. The seat of arbitration shall be Shenzhen, China.
            </p>
            <p className="text-gray-500 mb-4 ml-6">
              深圳国际仲裁院(SCIA)，根据申请仲裁时有效的仲裁规则。仲裁地点为中国深圳。
            </p>
          </>
        )}
        
        <p className="text-gray-700 mb-2">
          <strong>12.3</strong> The arbitration tribunal shall consist of three (3) arbitrators. Each Party shall appoint one arbitrator, and the two arbitrators so appointed shall appoint the third arbitrator, who shall serve as the chairperson of the arbitration tribunal.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>12.3</strong> 仲裁庭应由三(3)名仲裁员组成。每方应指定一名仲裁员，而这两名仲裁员应指定第三名仲裁员，该仲裁员应担任仲裁庭主席。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>12.4</strong> The arbitration proceedings shall be conducted in both Chinese and English.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>12.4</strong> 仲裁程序应以中文和英文双语进行。
        </p>
        
        <p className="text-gray-700 mb-2">
          <strong>12.5</strong> The arbitration award shall be final and binding on the Parties. The Parties agree to be bound by and to act in accordance with the arbitration award.
        </p>
        <p className="text-gray-500 mb-4">
          <strong>12.5</strong> 仲裁裁决是终局的，对双方具有约束力。双方同意受仲裁裁决约束并按照仲裁裁决行事。
        </p>
      </div>
      
      {/* Signatory Section */}
      <div className="mt-12">
        <p className="text-gray-700 mb-2">
          IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.
        </p>
        <p className="text-gray-500 mb-8">
          兹证明，双方已于生效日期签署本协议。
        </p>
        
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="font-bold mb-2">DISCLOSING PARTY:</p>
            <p className="font-bold mb-4 text-gray-500">披露方：</p>
            
            <div className="mt-10 border-t border-gray-400 pt-2">
              <p>[Authorized Signatory Name]</p>
              <p className="text-gray-500">[授权签字人姓名]</p>
              
              <p>[Title]</p>
              <p className="text-gray-500">[职务]</p>
              
              <p>[Date]</p>
              <p className="text-gray-500">[日期]</p>
            </div>
          </div>
          
          <div>
            <p className="font-bold mb-2">MANUFACTURER:</p>
            <p className="font-bold mb-4 text-gray-500">制造商：</p>
            
            <div className="mt-10 border-t border-gray-400 pt-2">
              <p>[Authorized Signatory Name]</p>
              <p className="text-gray-500">[授权签字人姓名]</p>
              
              <p>[Title]</p>
              <p className="text-gray-500">[职务]</p>
              
              <p>[Date]</p>
              <p className="text-gray-500">[日期]</p>
            </div>
            
            <div className="mt-5 border border-dashed border-gray-400 h-20 flex items-center justify-center">
              <p className="text-gray-500">[COMPANY CHOP/STAMP]</p>
              <p className="text-gray-400">[公司印章/章]</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div className="transform rotate-45 text-6xl font-bold text-gray-400">
          PREVIEW
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <div 
        onClick={openLightbox}
        className="h-full border border-gray-300 rounded shadow-sm p-6 overflow-y-auto cursor-pointer hover:border-blue-500 transition-colors relative max-h-[70vh]"
      >
        {agreementPreview}
      </div>
      
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto p-6 relative">
            <Button
              onClick={closeLightbox}
              className="absolute top-4 right-4"
              variant="outline"
            >
              Close
            </Button>
            
            <div className="prose max-w-none">
              {agreementPreview}
            </div>
            
            <div className="mt-6 text-center">
              <Button className="inline-flex items-center">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NNNAgreementPreview;