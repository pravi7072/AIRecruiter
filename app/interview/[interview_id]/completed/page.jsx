"use client";
import React from 'react';
import { Home, ArrowRight } from 'lucide-react';

const InterviewComplete = () => {
  return (
    <div className="bg-gray-900 text-white font-sans antialiased flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center space-y-8 py-16 px-4">

        {/* Success Icon */}
        <div className="rounded-full bg-green-600 p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center text-white">Interview Complete!</h1>

        {/* Subheading */}
        <p className="text-lg text-gray-300 text-center max-w-xl">
          Thank you for participating in the AI-driven interview with AI Recruiter
        </p>

        {/* Image */}
        <div
          className="rounded-xl overflow-hidden shadow-lg max-w-full w-full md:w-[800px] h-[400px] my-8"
          role="img"
          aria-label="Interview Completion Illustration"
        >
          <img
            src="/complete.png"    // <-- Use your file or provide a fallback URL
            alt="Interview Illustration"
            className="w-full h-full object-cover pointer-events-none select-none"
            tabIndex={-1}
            style={{ backgroundColor: "#222" }} // fallback bg if image missing
            onError={e => { e.target.onerror = null; e.target.src = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"; }}
          />
        </div>

        {/* Next Steps */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-md w-full max-w-xl space-y-4">
          <div className="flex items-center justify-center rounded-full bg-gray-700 w-12 h-12 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9-2-1.8-9-12.2.8V8"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-center text-white">What’s Next?</h2>
          <p className="text-gray-300 text-center">
            The recruiter will review your interview responses and will contact you soon regarding the next steps.
          </p>
          <p className="text-gray-400 text-sm text-center flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline-block mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 6-3-4 0 11-8 0 9 0 11 8 0z"
              />
            </svg>
            Response within 2-3 business days
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            className="bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg py-3 px-6 flex items-center space-x-2 transition duration-300 ease-in-out"
            onClick={() => window.location.href = '/'}
            type="button"
          >
            <Home className="h-5 w-5" />
            <span>Return to Homepage</span>
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 px-6 flex items-center space-x-2 transition duration-300 ease-in-out"
            onClick={() => window.location.href = '/opportunities'}
            type="button"
          >
            <span>View Other Opportunities</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4">
        <p>&copy; 2025 AI Recruiter. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InterviewComplete;
