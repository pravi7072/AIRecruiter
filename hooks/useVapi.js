"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web"; // ✅ FIXED HERE

const useVapi = (apiKey) => {
  const vapiRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      console.error("❌ Missing Vapi API Key");
      return;
    }

    const vapi = new Vapi({ apiKey });
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      console.log("✅ Call started");
      setIsActive(true);
    });

    vapi.on("call-end", () => {
      console.log("❌ Call ended");
      setIsActive(false);
    });

    vapi.on("speech", (text) => {
      console.log("🗣️ AI:", text);
    });

    vapi.on("volume-level", (vol) => {
      setVolume(vol);
    });

    vapi.on("error", (err) => {
      console.error("🚨 Vapi Error:", err);
      setError(err);
    });

    return () => {
      vapiRef.current?.stop();
      setIsActive(false);
      setVolume(0);
      console.log("🛑 Vapi stopped on unmount");
    };
  }, [apiKey]);

  const start = useCallback(
    (options) => {
      if (!vapiRef.current) {
        console.warn("Vapi not initialized");
        return;
      }

      try {
        vapiRef.current.start(options);
      } catch (err) {
        console.error("🚨 Error starting Vapi:", err);
        setError(err);
      }
    },
    []
  );

  const stop = useCallback(() => {
    try {
      vapiRef.current?.stop();
    } catch (err) {
      console.error("🚨 Error stopping Vapi:", err);
      setError(err);
    }
  }, []);

  return {
    start,
    stop,
    isActive,
    volume,
    error,
  };
};

export default useVapi;
