"use client";

import { SIGNALR_CONSTANTS } from "@/lib/constants/signalr.constants";
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { eventBus } from "@/lib/eventBus";

export const SignalRManager: React.FC = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (connectionRef.current || isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;

    const startConnection = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(SIGNALR_CONSTANTS.NOTIFICATION_HUB_URL, {
            accessTokenFactory: async () => {
              const res = await fetch("/api/auth/signalr-token", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // NOTE: defaults to 'same-origin', but explicit credential inclusion is safer if it will be moved to a different subdomain
                credentials: "include",
              });

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
        console.log("SignalR Connected");
      } catch (err) {
        console.error("SignalR connection failed:", err);
        // Important: If initial connection fails, 'withAutomaticReconnect' does NOT trigger.
        // You might want a manual retry here or just let the user refresh the page.
      } finally {
        isConnectingRef.current = false;
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, []);

  return null;
};
