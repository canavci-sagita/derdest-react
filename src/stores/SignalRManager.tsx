"use client";

import { SIGNALR_CONSTANTS } from "@/lib/constants/signalr.constants";
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { eventBus } from "@/lib/eventBus";

export const SignalRManager: React.FC = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    if (connectionRef.current || isConnectingRef.current) return;

    isConnectingRef.current = true;

    const startConnection = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(SIGNALR_CONSTANTS.NOTIFICATION_HUB_URL, {
            accessTokenFactory: async () => {
              const res = await fetch("/api/auth/signalr-token", {
                credentials: "include",
              });

              if (!res.ok) {
                throw new Error("No access token for SignalR");
              }

              const data = await res.json();
              return data.token;
            },
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Warning)
          .build();

        connectionRef.current = connection;

        connection.on(
          SIGNALR_CONSTANTS.DERDEST_NOTIFICATION,
          (notification) => {
            eventBus.emit("progress", notification);
          }
        );

        connection.on("ReceiveChatMessage", (message) => {
          eventBus.emit("chat", message);
        });

        await connection.start();
      } catch (err) {
        console.error("SignalR connection failed:", err);
      } finally {
        isConnectingRef.current = false;
      }
    };

    startConnection();

    return () => {
      connectionRef.current?.stop();
      connectionRef.current = null;
      isConnectingRef.current = false;
    };
  }, []);

  return null;
};
