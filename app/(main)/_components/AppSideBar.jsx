"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constant";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const path=usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center mt-4">
        <Image
          src="/AiRecruiter_Logo.svg"
          alt="Logo"
          width={200}
          height={150}
          priority
        />
        <Link href={'/dashboard/create-interview'}>
        <Button className="w-full mt-2">
          <Plus />
          Create New Interview
        </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className={'p-1'}>
                  <SidebarMenuButton asChild className={`p-5 ${path==option.path&&'bg-blue-50 text-white'}`}>
                    <Link href={option.path} className="flex items-center gap-2">
                      <div className={ ` text-[16px] ${path==option.path&&'text-primary'}`}>{React.createElement(option.icon )}</div>
                      <span className={ ` text-[16px]  ${path==option.path&&'text-primary font-medium'}`}>{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
