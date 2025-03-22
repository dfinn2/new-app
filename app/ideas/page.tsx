import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div>
      <h2 className="py-5 text-red-500 text-2xl">Grey Line Element</h2>  
      {/* grey line with text in the middle */}    
      <div className="relative" id="grey-line">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <h2 className="py-5 text-red-500 text-2xl">Next Element</h2>  
      {/* grey line with text in the middle */}    

 
      <div className="transform translate-y-1/2 -rotate-3 bg-highlight-200 px-6 py-2 rounded-sm shadow-md max-w-1/2 z-20">
              <p className="font-bold text-sm">Read more</p>
              <Image
                src="/handrawnarrow.png"
                alt="arrow"
                width={60}
                height={60}
              />
            </div>
            <div className="inline-flex px-4 py-2 mb-4 bg-blue-50 text-gray-700 rounded-md text-sm font-medium border border-gray-400 relative">
              Most Popular
              <span className="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-blue-500 animate-pulse">
                <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
              </span>
            </div>
            <div className="bg-black text-white text-30-extrabold ml-4 mr-4 mt-2 mb-2">
              <span className=""> OTHER SERVICES </span>
            </div>
            



    </div>
  )
}

export default page
