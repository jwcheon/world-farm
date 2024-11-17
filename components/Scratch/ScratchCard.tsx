import React, { useEffect, useState, useRef } from "react";

type PropsType = {
  data: React.ReactNode;
  width: number;
  height: number;
  variant?: string;
  handleCoverScratched?: () => void;
};

type EventTypes = {
  mouse: {
    down: string;
    move: string;
    up: string;
  };
  touch: {
    down: string;
    move: string;
    up: string;
  };
  [key: string]: {
    down: string;
    move: string;
    up: string;
  };
};

const ScratchCard: React.FC<PropsType> = ({
  data,
  width,
  height,
  variant,
  handleCoverScratched,
}) => {
  const [coverRemoved, setCoverRemoved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let coverScratched = false;
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;
    const canvasContext = canvasElement.getContext("2d");
    if (!canvasContext) return;

    const eventTypes: EventTypes = {
      mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
      },
      touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
      },
    };

    const initializeCanvas = () => {
      const gradient = canvasContext.createLinearGradient(0, 0, 135, 135);
      let color1 = "",
        color2 = "";
      if (variant === "blue") {
        color1 = "#2c67f2";
        color2 = "#62cff4";
      } else if (variant === "green") {
        color1 = "#53db97";
        color2 = "#0695b6";
      } else {
        color1 = "#d63031";
        color2 = "#fdcb6e";
      }
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

      setIsLoading(false);
    };

    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let deviceType = "";

    const checkIfTouchDevice = () => {
      try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
      } catch (e) {
        deviceType = "mouse";
        return false;
      }
    };

    const getMouseCoordinates = (event: MouseEvent | TouchEvent) => {
      const touch =
        "touches" in event
          ? (event as TouchEvent).touches[0]
          : (event as MouseEvent);
      mouseX = touch.pageX - canvasElement.getBoundingClientRect().left;
      mouseY = touch.pageY - canvasElement.getBoundingClientRect().top;
    };

    const handleDown = (event: any) => {
      isDragging = true;
      getMouseCoordinates(event);
      scratch(mouseX, mouseY);
    };

    const handleMove = (event: any) => {
      event.preventDefault();
      if (deviceType === "mouse") event.preventDefault();
      if (isDragging) {
        getMouseCoordinates(event);
        scratch(mouseX, mouseY);
      }
    };

    const handleUp = () => {
      isDragging = false;
      checkScratchedPercentage();
    };

    const checkScratchedPercentage = () => {
      const imageData = canvasContext.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      ).data;
      let scratchedPixels = 0;
      for (let i = 0; i < imageData.length; i += 4) {
        if (imageData[i + 3] === 0) {
          scratchedPixels++;
        }
      }
      const coverArea = canvasElement.width * canvasElement.height;
      const currentScratchedPercentage = (scratchedPixels / coverArea) * 100;

      if (currentScratchedPercentage >= 80) {
        setCoverRemoved(true);
        if (!coverScratched && handleCoverScratched) {
          handleCoverScratched();
          coverScratched = true;
        }
      }
    };

    checkIfTouchDevice();

    canvasElement.addEventListener(eventTypes[deviceType].down, handleDown);
    canvasElement.addEventListener(eventTypes[deviceType].move, handleMove);
    document.addEventListener(eventTypes[deviceType].up, handleUp);

    const scratch = (x: number, y: number) => {
      canvasContext.globalCompositeOperation = "destination-out";
      canvasContext.beginPath();
      canvasContext.arc(x, y, 22, 0, 2 * Math.PI);
      canvasContext.fill();

      const lastX = canvasElement.dataset.lastX
        ? parseInt(canvasElement.dataset.lastX)
        : x;
      const lastY = canvasElement.dataset.lastY
        ? parseInt(canvasElement.dataset.lastY)
        : y;
      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 1) {
        for (let i = 0; i < distance; i++) {
          const newX = lastX + (dx * i) / distance;
          const newY = lastY + (dy * i) / distance;
          canvasContext.beginPath();
          canvasContext.arc(newX, newY, 22, 0, 2 * Math.PI);
          canvasContext.fill();
        }
      }

      canvasElement.dataset.lastX = x.toString();
      canvasElement.dataset.lastY = y.toString();
    };

    initializeCanvas();

    return () => {
      canvasElement.removeEventListener(
        eventTypes[deviceType].down,
        handleDown
      );
      canvasElement.removeEventListener(
        eventTypes[deviceType].move,
        handleMove
      );
      document.removeEventListener(eventTypes[deviceType].up, handleUp);
    };
  }, [variant, handleCoverScratched]);

  return (
    <div
      className="relative w-full h-full"
      style={{
        width,
        height,
      }}
    >
      {!isLoading && (
        <div className="absolute w-full h-full flex bg-black items-center justify-center shadow-md rounded-lg">
          {data}
        </div>
      )}
      {!coverRemoved && (
        <canvas
          ref={canvasRef}
          id="scratch"
          className="absolute w-full h-full cursor-grabbing touch-none rounded-lg shadow-lg"
          width={width}
          height={height}
          style={{ touchAction: "none", userSelect: "none" }}
        ></canvas>
      )}
    </div>
  );
};

export default ScratchCard;
