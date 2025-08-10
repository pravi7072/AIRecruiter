import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import QuestionListContainer from "./QuestionListContainer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Questions({ formData, createInterviewLink }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [creditsError, setCreditsError] = useState(false); // New state for credits check
  const hasCalledRef = useRef(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      formData &&
      formData.jobPosition &&
      formData.jobDiscription &&
      formData.interviewDuration &&
      formData.type &&
      !hasCalledRef.current
    ) {
      hasCalledRef.current = true;
      GenerateQuestionList();
    }
  }, [formData]);

  const onFinish = async () => {
    if (questions.length === 0) {
      setErrorMsg("Please generate questions before finishing.");
      return;
    }

    setErrorMsg(null);
    setCreditsError(false); // reset credit error on new submit
    setSubmitting(true);

    try {
      const res = await axios.post("/api/save-interview", {
        jobPosition: formData.jobPosition,
        jobDiscription: formData.jobDiscription,
        interviewDuration: formData.interviewDuration,
        questions: questions,
        userId: session?.user?.id,
      });

      if (res.status === 200 && res.data.success) {
        const interviewId = res.data.interview.id;
        createInterviewLink(interviewId);
      } else {
        // Check error message for credits
        if (
          res.status === 403 ||
          (res.data.error && res.data.error.toLowerCase().includes("credits"))
        ) {
          setCreditsError(true);
        } else {
          throw new Error(res.data.error || "Failed to save interview");
        }
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 403
      ) {
        setCreditsError(true);
      } else {
        setErrorMsg("Failed to create interview. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const GenerateQuestionList = async () => {
    setLoading(true);
    setErrorMsg(null);
    setCreditsError(false); // reset when regenerating questions
    setQuestions([]);

    try {
      const result = await axios.post("/api/ai-model", {
        jobPosition: formData.jobPosition,
        jobDiscription: formData.jobDiscription,
        interviewDuration: formData.interviewDuration,
        type: formData.type,
      });

      if (Array.isArray(result.data.questions)) {
        setQuestions(result.data.questions);
      } else {
        throw new Error("Invalid questions format");
      }
    } catch (error) {
      console.warn("API failed. Using dummy questions for UI testing.");

      const dummyQuestions = [
        "Tell me about yourself and your experience.",
        "What are your strengths and weaknesses?",
        "How would you handle a difficult situation at work?",
        "Explain your understanding of the MERN stack.",
        "How do you manage deadlines and priorities?",
        "Describe a time you worked on a team project.",
        "What tools do you use for version control?",
        "What’s the difference between REST and GraphQL?",
        "Why do you want this job?",
        "Where do you see yourself in five years?"
      ];

      setQuestions(dummyQuestions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 px-4 sm:px-6 md:px-8">
      {loading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="w-full max-w-md bg-blue-50 rounded-xl shadow-md border border-blue-200 p-6 text-center">
            <Loader2Icon className="animate-spin h-8 w-8 mx-auto text-blue-500 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Generating Interview Questions
            </h2>
            <p className="text-sm text-gray-600">
              Our AI is crafting personalized questions based on your job position.
            </p>
          </div>
        </div>
      )}

      {!loading && creditsError && (
        <div className="w-full max-w-md mx-auto bg-yellow-50 border border-yellow-400 text-yellow-900 p-6 rounded-xl shadow-sm text-center mb-6">
          <div className="text-2xl font-semibold mb-2">⚠️ Insufficient Credits</div>
          <p className="text-sm mb-3">
            You have run out of credits and cannot create a new interview. Please recharge your credits or contact support.
          </p>
        </div>
      )}

      {!loading && !creditsError && errorMsg && (
        <div className="w-full max-w-md mx-auto bg-red-50 border border-red-200 text-red-900 p-6 rounded-xl shadow-sm text-center">
          <div className="text-2xl font-semibold mb-2">⚠️ Oops!</div>
          <p className="text-sm mb-3">{errorMsg}</p>
          <button
            onClick={GenerateQuestionList}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 transition-all"
          >
            🔄 Try Again
          </button>
        </div>
      )}

      {!loading && !creditsError && questions.length > 0 && (
        <div>
          <QuestionListContainer questions={questions} />
          <div className="mt-6 flex justify-end">
            <Button onClick={onFinish} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Create Interview Link and Finish"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
