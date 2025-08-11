"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Loader2Icon, Video } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Pages Router
import { InterviewDataContext } from "@/context/InterviewDataContext";

function Interview() {
  const [userName, setUserName] = useState("");
  const [email,setEmail]=useState("");
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);
  const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);

  const { interview_id } = useParams(); // ✅ access dynamic route param
  const router=useRouter()
  useEffect(() => {
    if (interview_id) {
      fetchInterviewDetails();
    }
  }, [interview_id]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/interview/${interview_id}`);
      if (!res.ok) throw new Error("Interview not found");
      const data = await res.json();
      
      setInterview(data.data); // if your API returns { success, data }
      
      
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Interview not found or no longer available.");
    } finally {
      setLoading(false);
    }
  };

  const onJoinInterview=()=>{
    setLoading(true)
    setInterviewInfo({
        email,
        userName:userName,
        interviewData:interview
      });
    router.push('/interview/'+interview_id+'/start')
    setLoading(false)
  }


  return (
    <div className="px-6 w-full md:px-24 lg:px-44 xl:px-56 mt-16">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-7 lg:px-32 shadow-md">
        <Image
          src={"/AiRecruiter_Logo.svg"}
          alt="Logo"
          width={200}
          height={100}
          className="w-[140px]"
        />
        <h2 className="mt-3 text-center">AI-Powered Interview Platform</h2>
        <Image
          src={"/interview.png"}
          alt="Interview"
          width={250}
          height={200}
          className="mt-5"
        />

        {loading ? (
          <p className="mt-5 text-gray-500">Loading interview details...</p>
        ) : error ? (
          <p className="mt-5 text-red-500 font-medium">{error}</p>
        ) : (
          <>
            <h2 className="font-bold text-xl mt-4 text-center">
              {interview?.title}
            </h2>
            <h2 className="flex gap-2 items-center text-gray-500 mt-3">
              <Clock />
              {interview?.duration} Minutes
            </h2>

            <div className="mt-5 w-full">
              <h2>Enter Your Full Name</h2>
              <Input
                placeholder="Enter your name"
                className="mt-2 w-full"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <h2>Enter Your Email Address</h2>
              <Input
                placeholder="Enter your email"
                className="mt-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-5 w-full">
              <h2>Before you begin</h2>
              <ul className="text-gray-500 mt-2 list-disc pl-5 space-y-2 text-sm">
                <li>Ensure you have a stable internet connection.</li>
                <li>Find a quiet place to take the interview.</li>
                <li>You will be asked questions related to the job position.</li>
                <li>You can take notes during the interview.</li>
              </ul>
            </div>

            <Button onClick={()=>onJoinInterview()}
              disabled={!userName.trim() || !interview}
              className={`mt-5 w-full font-bold ${
                !userName.trim() || !interview ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Video className="mr-2" /> {loading&&<Loader2Icon/>} Join Interview
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Interview;
