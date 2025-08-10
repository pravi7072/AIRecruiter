import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InterviewType } from "@/services/Constant";
import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";

export default function FormContainer({ onHandleInputChange,GoToNext }) {
    const [interviewType, setInterviewType] = React.useState([]);
    useEffect(() => {
        // Initialize interview type selection if needed
        if(interviewType){
            onHandleInputChange('type', interviewType);
        }
    }   , [interviewType]);
    const AddInterviewType= (type) => {
        const data=interviewType.includes(type) ? interviewType.filter(item => item !== type) : [...interviewType, type];
        setInterviewType(data);
    }

    return(
        <div className=" rounded-lg shadow-md p-6">
            <div className="mt-4">
                <h2 className="text-sm font-medium">
                    Job Position
                </h2>
                <Input type="text" onChange={(event)=>onHandleInputChange('jobPosition',event.target.value)} placeholder="Enter job position" className="mt-2 w-full" />

            </div>
            <div className="mt-4">
                <h2 className="text-sm font-medium">
                    Job Description
                </h2>
                <Textarea onChange={(event)=>onHandleInputChange('jobDiscription',event.target.value)} placeholder="Enter job description" className="mt-2 w-full h-32" />
                
            </div>
            <div className="mt-4">
                <h2 className="text-sm mb-2 font-medium">
                    Interview Duration
                </h2>  
                <Select className="mt-3 w-full " onValueChange={(value) => onHandleInputChange('interviewDuration', value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>   
                        <SelectItem value="60">60 minutes</SelectItem>     
                    </SelectContent>
                </Select>    

                <div className="mt-4">
                    <h2 className="text-sm font-medium">Interview Type</h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {InterviewType.map((type, index) => (
                            <div key={index} onClick={()=>AddInterviewType(type.title)} className={`flex gap-2 cursor-pointer items-center p-1 px-2 bg-blue-50 rounded-2xl border-gray-50  mt-2 hober:bg-blue-100 hover:border-blue-200 border ${interviewType.includes(type.title) ? 'bg-green-200' : 'border-gray-300'}`}>
                                <type.icon className="mr-2" />
                                <span>{type.title}</span>
                            </div>
                        ))}
                    </div>
                </div>  
            </div>

            <div className="mt-7 flex justify-end  " onClick={() => GoToNext()}>
                <Button >
                    Generate Questions<ArrowRight/>
                </Button>
            </div>
        </div>
    )
}