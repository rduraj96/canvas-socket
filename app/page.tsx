"use client";
import React, { useState } from "react";
import { useDraw } from "../hooks/useDraw";
import { ChromePicker } from "react-color";

type Props = {};

const page = (props: Props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);
  const [color, setColor] = useState<string>("#000");

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md border border-black "
          onClick={clear}
        >
          Clear Canvas
        </button>
      </div>

      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className={"border border-black rounded-md"}
      />
    </div>
  );
};

export default page;
