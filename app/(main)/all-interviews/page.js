"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Camera,
  MessageCircle,
  Video,
  Plus,
  Copy,
  Send,
  Share2,
  Mail,
  MessageCircleCode,
  MessageSquare,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function AllInterviews() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedInterviewId, setCopiedInterviewId] = useState(null);
  const [canWebShare, setCanWebShare] = useState(false);
  const [showMoreShareId, setShowMoreShareId] = useState(null);

  useEffect(() => {
    setCanWebShare(!!navigator.share);
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/interview")
      .then((res) => setInterviewList(Array.isArray(res.data) ? res.data : []))
      .catch((e) => {
        setInterviewList([]);
        console.error("Failed to fetch interviews", e);
      })
      .finally(() => setLoading(false));
  }, []);

  const getInterviewUrl = (id) => `${window.location.origin}/interview/${id}`;

  const handleCopyLink = (id) => {
    const url = getInterviewUrl(id);
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedInterviewId(id);
        setTimeout(() => setCopiedInterviewId(null), 3000);
      })
      .catch(() => alert("Failed to copy link. Please copy manually."));
  };

  const handleSendLinkEmail = (id, title) => {
    const url = getInterviewUrl(id);
    const subject = encodeURIComponent(`Check out this interview: ${title}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease check the interview details here:\n${url}\n\nBest regards.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleWebShare = (id, title) => {
    if (!navigator.share) {
      alert("Web Share API not supported in your browser.");
      return;
    }
    const url = getInterviewUrl(id);
    navigator.share({
      title: `Interview: ${title}`,
      url,
      text: `Check out this interview: ${title}`,
    });
  };

  const handleWhatsApp = (id, title) => {
    const url = getInterviewUrl(id);
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Check this interview: ${title}\n${url}`)}`,
      "_blank"
    );
  };

  const handleTelegram = (id, title) => {
    const url = getInterviewUrl(id);
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  return (
  <div className="max-w-5xl mx-auto my-10 px-3">
    <div className="flex items-center justify-between mb-7">
      <h2 className="font-bold text-3xl text-gray-900">All Interviews</h2>
      <Link href="/dashboard/create-interview">
        <button className="flex items-center gap-2 px-5 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition">
          <Plus className="h-5 w-5" /> New Interview
        </button>
      </Link>
    </div>

    {loading ? (
      <div className="flex flex-col items-center p-16 text-gray-400 tracking-wide text-lg">
        <Video className="h-10 w-10 mb-2 text-blue-700" />
        Loading interviews...
      </div>
    ) : interviewList.length === 0 ? (
      <div className="flex flex-col items-center gap-4 p-14 bg-gray-50 rounded-xl shadow-inner">
        <Video className="h-12 w-12 text-blue-500" />
        <h3 className="text-xl font-medium">No interviews found!</h3>
        <Link href="/dashboard/create-interview">
          <button className="flex gap-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <Plus /> Create Interview
          </button>
        </Link>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {interviewList.map((item) => (
  <div
    key={item.id}
    className="relative flex flex-col bg-white border border-blue-100 shadow-xl rounded-xl p-5 transition hover:border-blue-500 hover:shadow-2xl group"
    style={{ minHeight: "340px" }}
  >
    {/* Make all content (except button row) clickable */}
    <Link
      href={`/interview/${item.id}/show`}
      className="absolute inset-0 z-10"
      aria-label={`View details of ${item.title}`}
    >
      <span className="sr-only">See Details</span>
    </Link>

    {/* Card Visual Content (z-20 to appear above .absolute link for accessibility) */}
    <div className="relative z-20 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Camera className="w-6 h-6 text-blue-600 shrink-0" />
        <h3 className="font-bold text-lg text-gray-900 truncate flex-1">{item.title}</h3>
        {item.feedbackCount > 0 && (
          <span className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">
            <MessageCircle className="h-4 w-4 mr-1" />
            {item.feedbackCount}
          </span>
        )}
      </div>
      <div className="flex items-center text-xs text-gray-500 mb-1 gap-2">
        <span>
          Created: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
        </span>
        {item.duration && (
          <span className="ml-2 bg-blue-50 text-blue-700 px-2 rounded">
            {item.duration} min
          </span>
        )}
      </div>
      {item.user?.name && (
        <div className="text-xs text-gray-400 mb-2">Owner: {item.user.name}</div>
      )}
      {item.description && (
        <div className="mb-2 text-gray-700 line-clamp-3">{item.description}</div>
      )}
      <div className="flex-1" />
    </div>

    {/* Actions row */}
    <div className="relative z-30 flex gap-2 mt-1">
      <button
        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleCopyLink(item.id);
        }}
        type="button"
        aria-label={`Copy link for ${item.title}`}
      >
        <Copy className="w-4 h-4" />
        {copiedInterviewId === item.id ? "Copied!" : "Copy Link"}
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowMoreShareId(showMoreShareId === item.id ? null : item.id);
        }}
        type="button"
        aria-label={`Show share options for ${item.title}`}
      >
        <Send className="w-4 h-4" />
        Send Link
      </button>
    </div>

    {/* View Details button center below */}
    <div className="mt-4 flex justify-center z-30 relative pointer-events-none select-none">
      {/* visually indicates clickability, but since card itself is clickable, disable pointer events */}
      <span className="flex items-center gap-1 px-3 py-1 text-blue-400 rounded transition group-hover:text-blue-700">
        <Eye className="w-4 h-4" />
        View Details
      </span>
    </div>

    {/* Share Options Overlay */}
    {showMoreShareId === item.id && (
      <>
        {/* Backdrop */}
        <button
          className="fixed inset-0 z-30 bg-black/20 cursor-pointer"
          type="button"
          aria-label="Close share options"
          style={{ top: 0, left: 0, width: "100vw", height: "100vh" }}
          onClick={() => setShowMoreShareId(null)}
        />
        <div className="absolute left-0 right-0 bottom-0 z-40 bg-white p-4 rounded-b-xl shadow-2xl border-t border-blue-100 flex flex-wrap gap-2 animate-fade-in">
          <button
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => handleSendLinkEmail(item.id, item.title)}
            type="button"
            aria-label={`Send ${item.title} via Email`}
          >
            <Mail className="w-4 h-4" /> Email
          </button>
          {canWebShare && (
            <button
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => handleWebShare(item.id, item.title)}
              type="button"
              aria-label={`Share ${item.title} natively`}
            >
              <Share2 className="w-4 h-4" /> Native Share
            </button>
          )}
          <button
            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            onClick={() => handleWhatsApp(item.id, item.title)}
            type="button"
            aria-label={`Share ${item.title} on WhatsApp`}
          >
            <MessageCircleCode className="w-4 h-4" /> WhatsApp
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500 transition"
            onClick={() => handleTelegram(item.id, item.title)}
            type="button"
            aria-label={`Share ${item.title} on Telegram`}
          >
            <MessageSquare className="w-4 h-4" /> Telegram
          </button>
        </div>
      </>
    )}
  </div>
))}

      </div>
    )}
  </div>
  )}
