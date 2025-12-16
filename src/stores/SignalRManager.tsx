"use client";

import { SIGNALR_CONSTANTS } from "@/lib/constants/signalr.constants";
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { eventBus } from "@/lib/eventBus";
import { getSignalRTokenAction } from "@/actions/auth.actions";

export const SignalRManager: React.FC = () => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (connectionRef.current) return;

    const createAndStartConnection = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(SIGNALR_CONSTANTS.NOTIFICATION_HUB_URL, {
            accessTokenFactory: async () => {
              const token = await getSignalRTokenAction();
              return token;
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

        // connection.on("ReceiveAlert", (alert) => {
        //   eventBus.emit("alert", alert);
        // });

        await connection.start();
      } catch (e) {
        console.error("SignalR connection error: ", e);
      }
    };

    createAndStartConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, []);

  return null;
};
