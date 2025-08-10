import { Phone, Video } from "lucide-react";
import Link from "next/link";
import React from "react";


export function CreateOptions() {
    return(
        <div className="grid grid-cols-2 gap-5 ">
            <div className="bg-gray-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <Link href="/dashboard/create-interview" >
                        <Video className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12"/>
                    <h2 className="font-bold">Create New Interview</h2>
                    <p className="text-gray-500">Create AI Interviews and schedule then with Candidates</p>
                    </Link>

            </div>
             <div className="bg-gray-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <Phone className="p-3 text-primary bg-blue-50 rounded-lg h-12 w-12"/>
                    <h2 className="font-bold">Create Phone Screening Call</h2>
                    <p className="text-gray-500">Schedule phone screening call with candidates</p>
            </div>
        </div>
    )
}