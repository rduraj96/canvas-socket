import type { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponseServerIO } from "../../types/types";

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
};

export default function handler(
  _: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    console.log("Server already started!");
    res.end();
    return;
  }

  const httpServer: NetServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path: "/api/socket_io",
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("client-ready", () => {
      socket.broadcast.emit("get-canvas-state");
    });

    socket.on("canvas-state", (state) => {
      socket.broadcast.emit("canvas-state-from-server", state);
    });

    socket.on("draw-line", ({ prevPoint, currentPoint, color }: DrawLine) => {
      socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
    });

    socket.on("clear", () => io.emit("clear"));
  });

  console.log("Socket server started successfully!", io.sockets);
  res.end();
}
