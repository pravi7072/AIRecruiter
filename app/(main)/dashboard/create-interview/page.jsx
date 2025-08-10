'use client';
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FormContainer from "./_components/FormContainer";
import { Questions } from "./_components/Questions";
import { InterviewLink } from "./_components/InterviewLink";

export default function CreateInterview() {
  const router=useRouter();
  const [step,setStep]=useState(1);
  const [interviewId, setInterviewId] = useState();
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDiscription: '',
    interviewDuration: '',
    type: []
    }); 
  const onHandleInputChange=(field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  }
  const onGoToNext=()=>{
    if(formData.jobPosition && formData.jobDiscription && formData.interviewDuration && formData.type.length > 0){
      setStep(2);
    }
    else{
      alert("Please fill all the fields");
    }
  }

  const onCreateInterviewLink = (interviewId) => {
    setInterviewId(interviewId);
    setStep(3);
  }

  return (
    <div className="px-10 md:px-24 lg:px-44 xl:px-56">
        <div className="flex items-center gap-4 ">
            <ArrowLeft onClick={()=>router.push('/dashboard')} className="cursor-pointer"/>
            <h2 className="font-bold text-2xl">Create New Interview</h2>
            
        </div>
        <Progress value={step*33.33} className={"my-5"}/>
        {step==1?<FormContainer onHandleInputChange={onHandleInputChange} GoToNext={()=>onGoToNext()}/>
        :step==2?<Questions formData={formData} createInterviewLink={(interviewId)=>onCreateInterviewLink(interviewId)}/>
        :step==3?<InterviewLink interviewId={interviewId} formData={formData} />:null}
    </div>
  );
}