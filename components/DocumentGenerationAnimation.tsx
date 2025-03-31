'use client';
import { CheckCircle } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const DocumentGenerationAnimation = () => {
  const [stage, setStage] = useState(0);
  const [formCompletion, setFormCompletion] = useState(0);
  const [documentCompletion, setDocumentCompletion] = useState(0);
  const [showEmail, setShowEmail] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // References for cleanup
  const intervalsRef = useRef<(number | NodeJS.Timeout)[]>([]);
  const timerRef = useRef<number | NodeJS.Timeout | null>(null);
  
  // Function to play specific animation stage
  const playStage = (stageNumber: number) => {
    // Clear any existing intervals and timers
    intervalsRef.current.forEach(interval => clearInterval(interval));
    if (timerRef.current) clearTimeout(timerRef.current);
    intervalsRef.current = [];
    
    // Reset progress for all animations
    setFormCompletion(0);
    setDocumentCompletion(0);
    setShowEmail(false);
    
    // Pause auto animation
    setAutoPlay(false);
    
    // Set the selected stage
    setStage(stageNumber);
    
    // Play the appropriate animation based on stage
    if (stageNumber === 1) {
      // Form filling animation
      const formInterval = setInterval(() => {
        setFormCompletion(prev => {
          if (prev >= 100) {
            clearInterval(formInterval);
            return 100;
          }
          return prev + 4;
        });
      }, 200);
      intervalsRef.current.push(formInterval);
    } 
    else if (stageNumber === 2) {
      // Set form to completed state
      setFormCompletion(100);
      
      // Document preview animation
      const docInterval = setInterval(() => {
        setDocumentCompletion(prev => {
          if (prev >= 100) {
            clearInterval(docInterval);
            return 100;
          }
          return prev + 4;
        });
      }, 100);
      intervalsRef.current.push(docInterval);
    }
    else if (stageNumber === 3) {
      // Set previous stages to completed state
      setFormCompletion(100);
      setDocumentCompletion(100);
      setShowEmail(true);
    }
  };
  
  // Automatic animation sequence
  useEffect(() => {
    if (!autoPlay) return; // Skip if manual control is active
    
    const sequence = [
      // Fill out form stage
      () => {
        setStage(1);
        const formInterval = setInterval(() => {
          setFormCompletion(prev => {
            if (prev >= 100) {
              clearInterval(formInterval);
              return 100;
            }
            return prev + 5;
          });
        }, 150);
        
        intervalsRef.current.push(formInterval);
        return 5000; // Duration for this stage
      },
      // Preview stage
      () => {
        setStage(2);
        const docInterval = setInterval(() => {
          setDocumentCompletion(prev => {
            if (prev >= 100) {
              clearInterval(docInterval);
              return 100;
            }
            return prev + 4;
          });
        }, 100);
        
        intervalsRef.current.push(docInterval);
        return 4000;
      },
      // Receive document stage
      () => {
        setStage(3);
        setShowEmail(true);
        return 3500;
      },
      // Reset everything
      () => {
        setStage(0);
        setFormCompletion(0);
        setDocumentCompletion(0);
        setShowEmail(false);
        return 200;
      }
    ];
    
    let currentIndex = 0;
    
    const runSequence = () => {
      if (currentIndex < sequence.length) {
        const delay = sequence[currentIndex]();
        currentIndex++;
        timerRef.current = window.setTimeout(runSequence, delay);
      } else {
        currentIndex = 0;
        timerRef.current = window.setTimeout(runSequence, 1000);
      }
    };
    
    runSequence();
    
    // Proper cleanup of ALL timers
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      intervalsRef.current.forEach(interval => clearInterval(interval));
    };
  }, [autoPlay]);
  
  // Render form fields
  const renderFormFields = () => {
    const fields = [
      { label: "Name", completed: formCompletion >= 20 },
      { label: "Email", completed: formCompletion >= 40 },
      { label: "Document Type", completed: formCompletion >= 60 },
      { label: "Options", completed: formCompletion >= 80 },
      { label: "Additional Info", completed: formCompletion >= 100 }
    ];
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Your Information</h3>
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <div className="relative">
              <div className="w-full h-8 bg-gray-100 rounded border border-gray-300"></div>
              {field.completed && (
                <div className="absolute top-0 left-0 h-10 bg-blue-100 rounded-sm border border-black flex items-center px-3 text-16-medium text-black w-full">
                  {field.label === "Name" ? "Jane Smith" : 
                   field.label === "Email" ? "jane@example.com" : 
                   field.label === "Document Type" ? "NNN Agreement" : 
                   field.label === "Options" ? "Standard Package" : "Rush delivery requested"}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${formCompletion}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 text-right">{formCompletion}% Complete</div>
        </div>
      </div>
    );
  };
  
  // Render document preview
  const renderDocumentPreview = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Document Preview</h3>
          <span className="text-sm text-blue-600">{documentCompletion}% Generated</span>
        </div>
        
        <div className="border border-gray-200 rounded p-3 bg-gray-50">
          {/* Document header */}
          <div className={`transition-opacity duration-300 ${documentCompletion >= 20 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-1/2 mb-4"></div>
          </div>
          
          {/* Document sections */}
          <div className={`transition-opacity duration-300 ${documentCompletion >= 40 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="h-3 bg-gray-400 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-5/6 mb-4"></div>
          </div>
          
          <div className={`transition-opacity duration-300 ${documentCompletion >= 60 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="h-3 bg-gray-400 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-4/6 mb-4"></div>
          </div>
          
          <div className={`transition-opacity duration-300 ${documentCompletion >= 80 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="h-3 bg-gray-400 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-3/6 mb-4"></div>
          </div>
          
          {/* Signatures section */}
          <div className={`transition-opacity duration-300 ${documentCompletion >= 100 ? 'opacity-100' : 'opacity-30'}`}>
            <div className="flex flex-row"><div className="h-8 flex justify-end  bg-gray-400 rounded w-1/3 mt-4"></div><span><CheckCircle className="text-blue-500 mt-4 ml-4"/></span></div>
          </div>

         
        </div>
      </div>
    );
  };
  
  // Render document delivery
  const renderDocumentDelivery = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="font-bold text-xl text-gray-800 mb-2">Document Ready!</h3>
          <p className="text-gray-600 text-center mb-4">Your document has been generated and is ready for download.</p>
          
          <div className={`w-full transition-all duration-500 ${showEmail ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="border border-gray-200 rounded-lg p-4 bg-blue-50 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="text-md font-medium text-gray-700">Email Sent to jane@example.com</div>
              </div>
              <div className="text-sm px-4 text-gray-500">Your document has been sent to your email address.</div>
            </div>
            
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Document
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-10 mx-10">
      {/* Fixed height title section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
        <p className="text-gray-600">Watch the document creation process</p>
        {!autoPlay && (
          <button 
            onClick={() => setAutoPlay(true)}
            className="mt-2 text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Resume Auto Play
          </button>
        )}
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Step indicators */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2"></div>
          
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative z-10">
              <div 
                onClick={() => playStage(step)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                  ${stage === step ? 'bg-black text-white' : 
                    stage > step ? 'bg-blue-600 text-white' : 
                    'bg-white text-gray-400 border border-gray-200'}
                  transition-colors duration-300 hover:bg-blue-100 hover:border-blue-300
                `}
              >
                {stage > step ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : step}
              </div>
              <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium whitespace-nowrap
                ${stage === step ? 'text-blue-600' : 
                  stage > step ? 'text-blue-600' : 
                  'text-gray-500'}
              `}>
                {step === 1 ? "Fill Out Form" : 
                 step === 2 ? "Preview" : 
                 "Receive Document"}
              </div>
            </div>
          ))}
        </div>
        
        {/* Fixed height content area */}
        <div className="flex justify-center mt-16 h-[500px] relative">
          {/* Each animation stage is absolutely positioned */}
          <div className="w-full max-w-md absolute top-0 left-1/2 transform -translate-x-1/2">
            {stage === 0 && (
              <div className="text-center text-gray-500">
                <p>Animation starting...</p>
              </div>
            )}
            
            {stage === 1 && renderFormFields()}
            {stage === 2 && renderDocumentPreview()}
            {stage === 3 && renderDocumentDelivery()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerationAnimation;