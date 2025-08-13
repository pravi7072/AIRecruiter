"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { Mic, Phone, Timer } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

function Interview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const { interview_id } = useParams();
  const router = useRouter();

  // States
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEnding, setIsEnding] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  // Refs
  const timerRef = useRef(null);
  const vapiRef = useRef(null);
  const isStartedRef = useRef(false);

  // Format time
  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // Initialize Vapi
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    }
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current.removeAllListeners();
      }
      clearInterval(timerRef.current);
    };
  }, []);

  // Start call
  const startCall = useCallback(() => {
    if (!vapiRef.current || !interviewInfo) return;
    if (isStartedRef.current) return;

    const questionList = interviewInfo?.interviewData?.questions?.join(", ") || "";

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.title}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI voice assistant conducting interviews...
Questions: ${questionList}`,
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
    isStartedRef.current = true;
  }, [interviewInfo]);

  // Timer lifecycle — runs while call active
  useEffect(() => {
    if (!callEnded && isStartedRef.current) {
      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    // Cleanup
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [callEnded]);

  // Event handlers
  useEffect(() => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    vapi.removeAllListeners();

    const onCallStart = () => {
      console.log("Call started");
    };

    const onCallEnd = () => {
      if (!callEnded) {
        console.log("Call ended");
        setCallEnded(true);
        setActiveSpeaker(null);
        clearInterval(timerRef.current);
        isStartedRef.current = false;
        setIsEnding(false);
        router.push(`/interview/${interview_id}/completed`);
      }
    };

    const onError = (error) => {
      if (error?.errorMsg === "Meeting has ended") {
        console.log("Call ended cleanly:", error.errorMsg);
      } else {
        console.error("Vapi error:", error);
      }
    };

    const onMessage = (message) => {
      if (message.type === "transcript") {
        const text = message.transcript || message.text || "";
        if (!text.trim()) return;

        setConversation((prev) => {
          const last = prev[prev.length - 1];
          const newMsg = { role: message.role, content: text };
          const updated =
            last && last.role === message.role && !text.endsWith(".")
              ? [...prev.slice(0, -1), newMsg]
              : [...prev, newMsg];
          return updated;
        });

        setActiveSpeaker(message.role === "user" ? "user" : "ai");
        setTimeout(() => setActiveSpeaker(null), 3000);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("error", onError);
    vapi.on("message", onMessage);

    return () => {
      vapi.removeAllListeners();
    };
  }, [callEnded, router, interview_id]);

  // Auto start
  useEffect(() => {
    if (interviewInfo) {
      startCall();
    }
  }, [interviewInfo, startCall]);

  // Stop call
  const stopInterview = () => {
    if (vapiRef.current && isStartedRef.current && !isEnding) {
      setIsEnding(true);
      vapiRef.current.stop();
      clearInterval(timerRef.current);
    }
  };

  // Feedback after end
  const GenerateFeedback = useCallback(async () => {
    try {
      const filteredConversation = conversation.filter(
        (msg) => msg.content && msg.content.trim()
      );
      if (!filteredConversation.length) {
        console.warn("No usable conversation to send.");
        return;
      }
      const payload = {
        conversation: filteredConversation,
        name: interviewInfo.userName,
        email: interviewInfo.email,
        interviewId: interview_id,
      };
      await axios.post("/api/ai-feedback", payload);
    } catch (error) {
      console.error("Failed to get feedback:", error);
    }
  }, [conversation, interviewInfo, interview_id]);

  useEffect(() => {
    if (callEnded && conversation.length > 0) {
      GenerateFeedback();
    }
  }, [callEnded, conversation, GenerateFeedback]);

  return (
    <div className="p-20 w-full lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <Timer />
          {formatTime(elapsedTime)}
        </span>
      </h2>

      {/* Speakers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        {/* AI */}
        <div
          className={`bg-white h-[400px] rounded-lg flex justify-center items-center flex-col gap-3 transition-all duration-300 ${
            activeSpeaker === "ai" ? "ring-4 ring-blue-400 shadow-lg" : ""
          }`}
        >
          <Image
            src="/ai1.png"
            alt="AI"
            width={100}
            height={100}
            className="w-[60px] h-[60px] object-cover rounded-full"
          />
          <h2>AI Recruiter</h2>
        </div>
        {/* User */}
        <div
          className={`bg-white h-[400px] rounded-lg flex justify-center items-center flex-col gap-3 transition-all duration-300 ${
            activeSpeaker === "user" ? "ring-4 ring-green-400 shadow-lg" : ""
          }`}
        >
          <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">
            {interviewInfo?.userName?.[0]}
          </h2>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-5 mt-3">
        <Phone
          className={`h-12 w-12 p-3 rounded-full cursor-pointer ${
            isEnding || callEnded
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-red-500 text-white"
          }`}
          onClick={() => {
            if (!isEnding && !callEnded) setShowConfirmEnd(true);
          }}
          title={isEnding ? "Ending call, please wait..." : "End Call"}
        />
        <Mic className="h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer" />
      </div>

      {isEnding && (
        <p className="text-center mt-4 text-gray-500 font-semibold">
          Ending call, please wait...
        </p>
      )}

      <h2 className="text-sm text-gray-400 text-center mt-3">
        Interview in Progress...
      </h2>

      {/* Confirmation Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="font-semibold text-lg mb-4">End Interview?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to end this interview now?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowConfirmEnd(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                  setShowConfirmEnd(false);
                  stopInterview();
                }}
              >
                Yes, End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
