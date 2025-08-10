import { Button } from "@/components/ui/button";
import axios from "axios";
import { Camera, Plus, Video, MessageCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

export function LatestInterviews() {
  const [interviewList, setInterviewList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get("/api/interview")
      .then((res) => {
        setInterviewList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((e) => {
        setInterviewList([]);
        console.error("Failed to fetch interviews", e);
      })
      .finally(() => setLoading(false));
  }, []);

  // Define how many latest interviews you want to show
  const MAX_DISPLAY = 5;

  return (
    <div className="my-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between pb-3">
        <h2 className="font-bold text-2xl">Previously Created Interviews</h2>
        <Link href="/dashboard/create-interview">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Interview
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center p-8 text-gray-400">
          <Video className="h-10 w-10 mb-2 text-primary" />
          Loading interviews...
        </div>
      ) : interviewList.length === 0 ? (
        <div className="p-8 flex flex-col items-center gap-3 text-gray-500">
          <Video className="h-10 w-10 text-primary" />
          <h2 className="text-lg font-medium">No interviews found!</h2>
          <Link href="/dashboard/create-interview">
            <Button className="flex gap-2">
              <Plus /> Create Interview
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {interviewList
            .slice(0, MAX_DISPLAY) // show only MAX_DISPLAY latest interviews
            .map((item) => (
              <Link
                key={item.id}
                href={`/interview/${item.id}/show`}
                className="group block bg-white shadow-lg rounded-xl p-5 border hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Camera className="h-7 w-7 text-primary shrink-0" />
                  <div className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 truncate">
                    {item.title}
                  </div>
                  {item.feedbackCount > 0 && (
                    <span className="flex items-center text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full ml-2">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {item.feedbackCount}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                </div>
                {item.user?.name && (
                  <div className="text-xs text-gray-500 mb-1">Owner: {item.user.name}</div>
                )}
                {item.duration && (
                  <div className="inline-block bg-blue-50 text-blue-700 px-2 rounded text-xs font-medium mb-2">
                    Duration: {item.duration} mins
                  </div>
                )}
                {item.description && (
                  <div className="text-gray-600 text-sm italic mb-2">{item.description}</div>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-blue-100 group-hover:text-blue-700"
                  >
                    View
                  </Button>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
