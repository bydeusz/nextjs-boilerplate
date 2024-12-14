"use client";
import { useState, useEffect, useRef } from "react";
import { Tabs } from "@/components/navigation/Tabs/Tabs";
import { PhotoIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import Backgrounds from "../Backgorunds/Backgrounds";
import Colors from "../Colors/Colors";
import Scale from "../Scale/Scale";
import { Button } from "@/components/actions/Button/Button";
import { Loading } from "@/components/lables/Loading/Loading";
import Screenshot from "../Screenshot/Screenshot";
import Adjust from "../Adjust/Adjust";
import Move from "../Move/Move";
import { colors } from "@/data/colors";
import Strokes from "../Strokes/Strokes";
import Modal from "@/components/messages/Modal/Modal";
import { TextArea } from "@/components/inputs/TextArea/TextArea";
import UvPrint from "../UvPrint/UvPrint";
import Backplate from "../Backplate/Backplate";

interface LogoDesignerProps {
  id: string;
  logo: any;
  defaultColor: string;
  size: string;
  name: string;
}

interface PathObject {
  id: string;
  d: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
}

export default function LogoDesigner({
  id,
  logo,
  defaultColor,
  size,
  name,
}: LogoDesignerProps) {
  // States
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("background");
  const [background, setBackground] = useState<string>(
    "/img/backgrounds/1.jpg",
  );
  const [color, setColor] = useState<string>("255, 255, 255");
  const [individualColor, setIndividualColor] = useState<{
    [key: string]: string;
  }>({});
  const [scale, setScale] = useState<number>(0.2);
  const [stroke, setStroke] = useState<number>(15);
  const [svg, setSvg] = useState<PathObject[]>([]);
  const [glow, setGlow] = useState<boolean>(true);
  const [note, setNote] = useState<string>("");
  const [backplate, setBackplate] = useState("ingegoten");
  const [backplateColor, setBackplateColor] = useState<string>("255, 255, 255");

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [deleteButtonPosition, setDeleteButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [dragging, setDragging] = useState<boolean>(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // useRef for screenshot
  const screenshotRef = useRef<{ takeScreenshot: () => Promise<File> } | null>(
    null,
  );

  useEffect(() => {
    // Reset states after selecting order
    setActiveTab("background");
    setPosition({ x: 0, y: 0 });
    setDragging(false);
    setStartPos({ x: 0, y: 0 });
    setScale(0.2);
    setStroke(15);

    const colorObject = colors.find((color) => color.label === defaultColor);
    if (colorObject) {
      setColor(colorObject.value);
    } else {
      setColor("255, 255, 255");
    }

    const handleGenerateNeonSign = async (logoUrl: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-neon-sign/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: logoUrl }),
          },
        );
        if (!response.ok) {
          setIsLoading(false);
          setSvg([]);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIsLoading(false);
        setSvg(data.svg);
      } catch (error) {
        console.error("Failed to fetch neon sign:", error);
      }
    };

    handleGenerateNeonSign(logo);
  }, [logo, defaultColor]);

  useEffect(() => {
    setSelectedPath(null);
    setDeleteButtonPosition(null);
  }, [activeTab, id]);

  const selectedBackground = (background: string) => {
    setBackground(background);
  };

  const selectedColor = (color: string) => {
    setColor(color);
  };

  const handleBackplateChange = (backplate: string, backplateColor: string) => {
    setBackplate(backplate);
    setBackplateColor(backplateColor);
  };

  const selectedUvPrint = (color: string) => {
    if (selectedPath) {
      setIndividualColor((prev) => ({
        ...prev,
        [selectedPath]: "0,0,0",
      }));

      const updatedSvg = svg.map((path) => {
        if (path.id === selectedPath) {
          return {
            ...path,
            stroke: "none",
            fill: `rgba(${color}, 1)`,
          };
        }
        return path;
      });

      setSvg(updatedSvg);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTab === "edit") {
      setDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && activeTab === "edit") {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeTab === "edit") {
      const step = 10;
      switch (e.key) {
        case "ArrowUp":
          setPosition((prev) => ({ x: prev.x, y: prev.y - step }));
          break;
        case "ArrowDown":
          setPosition((prev) => ({ x: prev.x, y: prev.y + step }));
          break;
        case "ArrowLeft":
          setPosition((prev) => ({ x: prev.x - step, y: prev.y }));
          break;
        case "ArrowRight":
          setPosition((prev) => ({ x: prev.x + step, y: prev.y }));
          break;
        default:
          break;
      }
    } else if (activeTab === "adjust" && e.key === "Backspace") {
      handleDeletePath();
    }
  };

  const handlePathClick = (pathId: string, e: React.MouseEvent) => {
    if (
      activeTab === "adjust" ||
      activeTab === "colors" ||
      activeTab === "uv-print"
    ) {
      setSelectedPath(pathId);
      const boundingBox = (e.target as SVGPathElement).getBoundingClientRect();
      setDeleteButtonPosition({ x: boundingBox.right, y: boundingBox.top });
    }
  };

  const handleDeletePath = () => {
    if (selectedPath) {
      setSvg((prevSvg) => {
        const updatedSvg = prevSvg.filter((path) => path.id !== selectedPath);
        return updatedSvg;
      });
      setSelectedPath(null);
      setDeleteButtonPosition(null);
    }
  };

  const handleDone = async () => {
    if (screenshotRef.current) {
      await screenshotRef.current.takeScreenshot();
    }

    const ratio = await calculateRatio(boundingBox);

    try {
      const response = await fetch("/api/monday/done", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ratio, size }),
      });
      if (!response.ok) {
        setSvg([]);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSvg([]);
      window.location.reload();
    } catch (error) {
      console.error("Failed to complete the operation", error);
    }
  };

  const handleStuck = async () => {
    if (screenshotRef.current) {
      await screenshotRef.current.takeScreenshot();
    }

    const ratio = await calculateRatio(boundingBox);

    try {
      const response = await fetch("/api/monday/stuck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ratio, size, note }),
      });
      if (!response.ok) {
        setSvg([]);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSvg([]);
      window.location.reload();
    } catch (error) {
      console.error("Failed to complete the operation", error);
    }
  };

  const calculateViewBox = (paths: any) => {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    paths.forEach((path: any) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      pathElement.setAttribute("d", path.d);
      svgElement.appendChild(pathElement);
    });
    document.body.appendChild(svgElement);
    const boundingBox = svgElement.getBBox();
    document.body.removeChild(svgElement);
    return boundingBox;
  };

  const boundingBox = calculateViewBox(svg);

  const calculateRatio = async (boundingBox: any) => {
    const ratio = boundingBox.width / boundingBox.height;
    return ratio;
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const handleDownload = async () => {
    const svgElement = document.querySelector("#generated-svg");
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="relative w-4/6 bg-white rounded-md border p-4"
      onKeyDown={handleKeyDown}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}>
      <div className="h-1/2">
        <Screenshot ref={screenshotRef} id={id} name={name}>
          {!logo ? (
            <div className="relative h-full w-full bg-gray-100 rounded-md">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PhotoIcon className="h-6 w-6 text-gray-500 mx-auto" />
                <p className="text-xs text-gray-500">No Image</p>
              </div>
            </div>
          ) : (
            <>
              {!isLoading ? (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  className="overflow-hidden w-full h-full bg-gray-100 rounded-md flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}>
                  <svg
                    id="generated-svg"
                    viewBox={`${boundingBox.x - 80} ${boundingBox.y - 80} ${boundingBox.width + 160} ${boundingBox.height + 160}`}
                    onMouseDown={handleMouseDown}
                    tabIndex={0}
                    role="button"
                    aria-label="Draggable SVG"
                    style={{
                      backgroundColor:
                        backplate === "vierkant"
                          ? `rgba(${backplateColor}, 0.1)`
                          : "transparent",
                      border:
                        backplate === "vierkant"
                          ? `5px solid rgba(${backplateColor}, 0.1)`
                          : "none",
                      padding: "40px",
                      transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                      cursor:
                        activeTab === "edit"
                          ? dragging
                            ? "grabbing"
                            : "grab"
                          : "default",
                      outline: "none",
                    }}>
                    <defs>
                      {svg.map((path) => (
                        <filter
                          key={`filter-${path.id}`}
                          id={`glow-${path.id}`}
                          x="-50%"
                          y="-50%"
                          width="200%"
                          height="200%">
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="1.5"
                            floodColor={`rgba(${color}, 1)`}
                          />
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="5"
                            floodColor={`rgba(${color}, 1)`}
                          />
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="10"
                            floodColor={`rgba(${color}, 1)`}
                          />
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="15"
                            floodColor={`rgba(${color}, 0.8)`}
                          />
                          <feDropShadow
                            dx="0"
                            dy="0"
                            stdDeviation="25"
                            floodColor={`rgba(${color}, 0.8)`}
                          />
                        </filter>
                      ))}
                    </defs>
                    {svg.map((path) => (
                      <path
                        key={path.id}
                        id={path.id}
                        d={path.d}
                        fill={path.fill}
                        stroke={path.stroke}
                        strokeWidth={stroke}
                        onClick={(e) => handlePathClick(path.id, e)}
                        style={{
                          cursor:
                            activeTab === "adjust" || "colors"
                              ? "pointer"
                              : "default",
                          outline:
                            selectedPath === path.id ? "2px solid red" : "none",
                        }}
                        filter={`url(#glow-${path.id})`}
                      />
                    ))}
                  </svg>
                </div>
              ) : (
                <div
                  className="relative overflow-hidden w-full h-full bg-gray-100 flex justify-center items-center"
                  style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: "cover",
                  }}>
                  <Loading className="h-6 w-6 text-white" />
                </div>
              )}
            </>
          )}
        </Screenshot>
      </div>
      <div className="flex justify-between py-2">
        <div className="flex">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={glow}
            onChange={(e) => setGlow(e.target.checked)}
          />
          <div className="text-xs ml-2 font-semibold">Turn off/on</div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleDownload}
            type="button"
            size="sm"
            className="border-2 border-gray-500 bg-white hover:border-gray-700 text-gray-500 hover:text-gray-700 font-semibold rounded-md">
            Downloaden
          </Button>
          <Button
            onClick={handleModal}
            type="button"
            size="sm"
            className="border-2 border-red-600 bg-white hover:bg-red-600 text-red-600 hover:text-white font-semibold rounded-md">
            Afkeuren <XMarkIcon className="ml-2 h-4 w-4" />
          </Button>
          <Button
            onClick={handleDone}
            type="button"
            size="sm"
            className="border-2 border-green-600 bg-white hover:bg-green-600 text-green-600 hover:text-white font-semibold rounded-md">
            Goedkeuren <CheckIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Tabs>
          <button
            type="button"
            onClick={() => setActiveTab("background")}
            className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-pink-600 whitespace-nowrap ${
              activeTab === "background" ? "text-pink-600 border-pink-600" : ""
            }`}>
            Achtergrond
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-pink-600 whitespace-nowrap ${
              activeTab === "edit" ? "text-pink-600 border-pink-600" : ""
            }`}>
            Aanpassen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("colors")}
            className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-pink-600 whitespace-nowrap ${
              activeTab === "colors" ? "text-pink-600 border-pink-600" : ""
            }`}>
            Kleuren
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("uv-print")}
            className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-pink-600 whitespace-nowrap ${
              activeTab === "uv-print" ? "text-pink-600 border-pink-600" : ""
            }`}>
            UV Print
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("backplate")}
            className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-pink-600 whitespace-nowrap ${
              activeTab === "backplate" ? "text-pink-600 border-pink-600" : ""
            }`}>
            Backplate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("adjust")}
            className={`py-4 text-sm font-medium text-gray-500 transition-all duration-200 border-b-2 hover:border-pink-600 whitespace-nowrap ${
              activeTab === "adjust" ? "text-pink-600 border-pink-600" : ""
            }`}>
            Verwijderen
          </button>
        </Tabs>
        {activeTab === "background" && (
          <Backgrounds
            background={background}
            selectedBackground={selectedBackground}
          />
        )}
        {activeTab === "colors" && (
          <Colors color={color} selectedColor={selectedColor} />
        )}
        {activeTab === "uv-print" && (
          <UvPrint selectedColor={selectedUvPrint} />
        )}
        {activeTab === "backplate" && (
          <Backplate
            color={backplateColor}
            onBackplateChange={handleBackplateChange}
          />
        )}
        {activeTab === "edit" && (
          <div>
            <Move />
            <Scale scale={scale} setScale={setScale} />
            <Strokes strokes={stroke} setStrokes={setStroke} />
          </div>
        )}
        {activeTab === "adjust" && <Adjust />}
      </div>
      <Modal isOpen={modal} onClose={handleModal}>
        <div className="space-y-4">
          <TextArea
            label="Interne Notitie"
            name="note"
            id="note"
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            onClick={handleStuck}
            type="button"
            size="sm"
            className="border-2 border-red-600 bg-white hover:bg-red-600 text-red-600 hover:text-white font-semibold rounded-md">
            Afkeuren <XMarkIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Modal>
    </div>
  );
}
