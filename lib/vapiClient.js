// lib/vapiClient.js
import { Vapi } from '@vapi-ai/web';

let vapi;

export const getVapiClient = () => {
  if (!vapi) {
    vapi = new Vapi({
      apiKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY, // Make sure this is set in .env
    });
    console.log("✅ Vapi client initialized");
  } else {
    console.log("⚠️ Vapi client reused");
  }

  return vapi;
};
