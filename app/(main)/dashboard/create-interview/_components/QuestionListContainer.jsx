import React from "react";
import { MessageSquare } from "lucide-react";

export default function QuestionListContainer({ questions }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 max-w-2xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-blue-600 w-5 h-5" />
        <h2 className="text-xl font-semibold text-gray-800">
          Generated Interview Questions
        </h2>
      </div>

      <ul className="space-y-4 pl-5">
        {questions.map((question, index) => (
          <li
            key={index}
            className="relative text-gray-700 bg-gray-50 hover:bg-blue-50 transition-colors duration-200 rounded-md p-3 shadow-sm border-l-4 border-blue-500"
          >
            <span className="absolute -left-5 top-3 text-blue-500 font-semibold">
              {index + 1}.
            </span>
            {question}
          </li>
        ))}
      </ul>
    </div>
  );
}
