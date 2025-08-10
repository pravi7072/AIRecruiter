"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Camera, MessageCircle, Calendar, Clock } from "lucide-react";
import { useParams } from "next/navigation";

function FeedbackSummary({ feed }) {
  console.log(feed)
  // Safely destructure with defaults
  const {
    feedback
  } = feed || {};
  // Safely destructure with defaults
  const {
    rating = {},
    summery = "",
    Recommendation = "Not Provided",
    RecommendationMsg = "",
  } = feedback || {};

  // Normalize ratings with corrected spelling keys
  const normalizedRatings = {
    Experience: rating.experince ?? 0,
    Communication: rating.communication ?? 0,
    "Problem Solving": rating.problemSolving ?? 0,
    "Technical Skills": rating.techicalSkills ?? 0,
  };

  return (
    <section className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback Report</h2>

      {/* Ratings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Skill Ratings (out of 10)
        </h3>
        <ul className="space-y-4">
          {Object.entries(normalizedRatings).map(([skill, score]) => (
            <li key={skill} className="flex items-center gap-4">
              <span className="w-36 font-medium text-gray-700">{skill}</span>
              <div
                className="flex-1 h-6 bg-gray-200 rounded overflow-hidden relative"
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={10}
                aria-label={`${skill} rating`}
              >
                <div
                  className="h-6 bg-indigo-600 rounded transition-all duration-500"
                  style={{ width: `${(score / 10) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-indigo-700">
                {score}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Summary</h3>
        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {summery || "No summary provided."}
        </p>
      </div>

      {/* Recommendation */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Recommendation</h3>
        <div
          className={`inline-block px-4 py-1 rounded-full text-white font-semibold select-none text-sm ${
            Recommendation === "Recommended"
              ? "bg-green-500"
              : Recommendation === "Not Recommended"
              ? "bg-red-500"
              : Recommendation === "Hold"
              ? "bg-yellow-500"
              : "bg-gray-500"
          }`}
        >
          {Recommendation}
        </div>
        {RecommendationMsg && (
          <p className="mt-2 text-gray-600 italic">{RecommendationMsg}</p>
        )}
      </div>
    </section>
  );
}

export default function SingleInterview() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { interview_id } = useParams();
  const [openFeedbackId, setOpenFeedbackId] = useState(null);

  useEffect(() => {
    if (!interview_id) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/interview/${interview_id}/details`);
        setDetails(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load interview."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [interview_id]);

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center w-full text-gray-500 text-lg font-medium">
        Loading interview details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-red-600 font-semibold text-lg">
        Error: {error}
      </div>
    );
  }

  if (!details) {
    return null;
  }

  const { title, description, duration, questions, createdAt, user, feedback } =
    details;

  const handleSendOfferLetter = (email, name) => {
    if (!email) {
      alert("No email address available to send offer letter.");
      return;
    }
    const subject = encodeURIComponent(`Offer Letter from Your Company`);
    const body = encodeURIComponent(
      `Dear ${name},\n\nWe are pleased to extend you an offer.\n\nPlease contact us for further details.\n\nBest regards,\nYour Company`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 bg-white rounded-lg shadow-lg ring-1 ring-gray-200">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
        {title}
      </h1>

      {/* Meta info */}
      <section className="flex flex-wrap gap-6 mb-8 text-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <time dateTime={createdAt} className="font-medium">
            Created: {new Date(createdAt).toLocaleDateString()}
          </time>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span className="font-medium">Duration: {duration ?? "N/A"} mins</span>
        </div>
        {user?.name && (
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Owner: {user.name}</span>
          </div>
        )}
      </section>

      {/* Description */}
      {description && (
        <section className="prose prose-indigo max-w-none mb-10 italic text-gray-700 px-3 py-2 bg-indigo-50 rounded-md">
          {description}
        </section>
      )}

      {/* Questions */}
      <section className="mb-10">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          <Camera className="w-6 h-6 text-indigo-600" />
          Questions ({Array.isArray(questions) ? questions.length : 0})
        </h2>

        {Array.isArray(questions) && questions.length > 0 ? (
          <ol className="list-decimal list-inside space-y-3 text-gray-800 text-lg leading-relaxed">
            {questions.map((q, idx) => (
              <li
                key={idx}
                className="bg-gray-50 rounded-md p-3 shadow-sm border border-gray-200"
              >
                {typeof q === "string" ? q : JSON.stringify(q)}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 italic">No questions provided.</p>
        )}
      </section>

      {/* Feedback Section */}
      <section className="mb-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
          <MessageCircle className="w-6 h-6 text-green-600" />
          Feedback ({feedback?.length ?? 0})
        </h2>

        {feedback && feedback.length > 0 ? (
          <ul className="space-y-8 max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg p-6 bg-green-50 shadow-inner">
            {feedback.map((fb) => {
              const isOpen = openFeedbackId === fb.id;
              // feed here is already an object per your data structure
              const feedObj = fb.feed || {};

              return (
                <li key={fb.id} className="border-b last:border-none pb-8 last:pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-lg font-semibold text-green-900">{fb.name}</p>
                      <p className="text-sm text-green-700">{fb.email}</p>
                    </div>
                    <button
                      className="text-sm text-blue-600 hover:underline font-semibold"
                      onClick={() => setOpenFeedbackId(isOpen ? null : fb.id)}
                      aria-expanded={isOpen}
                      aria-controls={`report-${fb.id}`}
                      type="button"
                    >
                      {isOpen ? "Hide Report" : "View Report"}
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      id={`report-${fb.id}`}
                      className="bg-white p-6 rounded-md shadow-md border border-green-200"
                    >
                      <FeedbackSummary feed={feedObj} />

                      <div className="mt-6 flex justify-end">
                        <button
                          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onClick={() => handleSendOfferLetter(fb.email, fb.name)}
                          type="button"
                        >
                          Send Offer Letter
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No feedback available yet.</p>
        )}
      </section>
    </main>
  );
}
