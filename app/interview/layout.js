"use client"

import React, { useState } from "react";
import Header from "./components/Header";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../(main)/_components/AppSideBar";

function InterviewLayout({ children }) {

  const [interviewInfo,setInterviewInfo]=useState()
  return (
      <InterviewDataContext.Provider value={{interviewInfo,setInterviewInfo}}>
        <div className="bg-secondary flex justify-center items-center" >
         
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger/>
              <div className="flex flex-col w-full justify-center items-center">{children}</div>
          </SidebarProvider>
        </div>
      </InterviewDataContext.Provider>
  );
}
export default InterviewLayout;
{/* <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <SidebarTrigger/>
        <div className="p-5">
            <WelcomeContainer />
        </div>
        {children}
        </div>
    </SidebarProvider> */}