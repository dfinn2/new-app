import React from 'react'

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

    </div>
  )
}

export default page
