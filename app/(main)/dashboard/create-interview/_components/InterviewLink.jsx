"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { Copy, Check, Clock, List, Mail, MessageSquare, MessageCircleCode, ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function InterviewLink({ interviewId }) {
  const [fullLink, setFullLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [autoStart, setAutoStart] = useState(true); // example toggle

 useEffect(() => {
    // Construct the full link using the interviewId and environment variable
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
    setFullLink(`${hostUrl}/${interviewId}`);
  }, [interviewId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  console.log("Interview Link:", fullLink);

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6 border border-gray-200">
      <div className="flex flex-col items-center">
        <Image
          src="/generated-image.png"
          alt="Interview created"
          width={100}
          height={100}
          className="rounded-full shadow-sm mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800">Interview Link</h2>
        <p className="text-gray-500 text-sm text-center">
          Share this link with the candidate to access the interview.
        </p>

        <div className="w-full rounded-lg p-3 mt-4 flex items-center justify-between gap-2">
          <h2>Interview Link</h2>
          <h2 className="flex text-sm  text-primary  rounded-4xl">Valid for 30 days</h2>
          
          
        </div>
        <div className="bg-gray-100 w-full rounded-lg p-3 mt-4 flex items-center justify-evenly gap-2">
          <a
            href={fullLink}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm text-black underline flex-1"
          >
            {fullLink}
          </a>
          <button
            onClick={handleCopy}
            className="text-gray-600 hover:text-black transition"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

      </div>
      <hr className="my-7 w-full"/>
      <div className="flex gap-5">
          <h2 className="text-sm text-gray-500 flex gap-2 items-center "><Clock className="h-4 w-4"/> 30{FormData.interviewDuration}</h2>
          <h2 className="text-sm text-gray-500 flex gap-2 items-center "><List className="h-4 w-4"/> 10 questions</h2>

        </div>

        <div className="mt-7 bg-white p-5 rounded-lg shadow-md w-full">
          <h2 className="font-bold">Share Via</h2>
          <div className="flex gap-3 mt-3">
            <Button variant={'outline'} ><Mail/> Email</Button>
            <Button variant={'outline'} ><MessageCircleCode/> Slack</Button>
            <Button variant={'outline'} ><MessageSquare/> Whatsapp</Button>

          </div>
        </div>
        <div className="flex w-full gap-5 justify-between mt-7">
          <Link href="/dashboard" className="flex items-center gap-2">
          <Button variant={'outline'}><ArrowLeft/> Back to Dashboard</Button>
          </Link>
          {/* <Link href="/dashboard/create-interview" className="flex items-center gap-2">
          <Button><Plus/> Create New Interview</Button>
          </Link> */}
        </div>
      
    </div>
  );
}
