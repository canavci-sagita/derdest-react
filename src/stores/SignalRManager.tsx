"use client";

import { SIGNALR_CONSTANTS } from "@/lib/constants/signalr.constants";
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { eventBus } from "@/lib/eventBus";

export const SignalRManager: React.FC = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    isLoggingOutRef.current = false;
    const startConnection = async () => {
      if (isLoggingOutRef.current) return;

      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(SIGNALR_CONSTANTS.NOTIFICATION_HUB_URL, {
            accessTokenFactory: async () => {
              if (!isMountedRef.current || isLoggingOutRef.current) {
                return "";
              }

              const res = await fetch("/api/auth/signalr-token", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // NOTE: defaults to 'same-origin', but explicit credential inclusion is safer if it will be moved to a different subdomain
                credentials: "include",
              });

              if (res.status === 401) {
                console.warn(
                  "SignalR token fetch 401 - user likely logged out"
                );
                return "";
              }

              if (!res.ok) {
                throw new Error("Failed to fetch SignalR access token");
              }

              const data = await res.json();
              return data.token;
            },
          })

          .withAutomaticReconnect([0, 2000, 10000, 30000])
          .configureLogging(
            process.env.NODE_ENV === "production"
              ? signalR.LogLevel.Error
              : signalR.LogLevel.Warning
          )
          .build();

        connection.on(
          SIGNALR_CONSTANTS.DERDEST_NOTIFICATION,
          (notification) => {
            eventBus.emit("progress", notification);
          }
        );

        connection.on("ReceiveChatMessage", (message) => {
          eventBus.emit("chat", message);
        });

        connection.onclose((error) => {
          if (error) {
            console.warn(
              "SignalR connection closed with error, retrying...",
              error
            );
          }
        });

        connectionRef.current = connection;
        await connection.start();
      } catch (err) {
        console.error("SignalR connection failed:", err);
        //TODO: If initial connection fails, 'withAutomaticReconnect' does NOT trigger. May need a manual retry here or just let the user refresh the page.
      } finally {
        isConnectingRef.current = false;
      }
    };

    const stopConnection = async () => {
      if (connectionRef.current) {
        const conn = connectionRef.current;
        connectionRef.current = null;
        try {
          await conn.stop();
        } catch {}
      }
    };

    const handleLogout = () => {
      isLoggingOutRef.current = true;
      stopConnection();
    };

    eventBus.on("signout", handleLogout);

    if (connectionRef.current || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    startConnection();

    return () => {
      isMountedRef.current = false;
      eventBus.off("signout", handleLogout);
      stopConnection();
    };
  }, []);

  return null;
};
