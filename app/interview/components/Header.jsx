import Image from "next/image";
import React from "react";

function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center py-2">
          <Image
            src="/AiRecruiter_Logo.svg"
            alt="AI Recruiter Logo"
            width={200}    // Larger width for more prominence
            height={75}    // Increased height for balanced aspect ratio
            className="object-contain w-[200px]"
            priority={true}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
