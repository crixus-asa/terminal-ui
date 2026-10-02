import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Slider } from "./slider";
import { Palette } from "@phosphor-icons/react";

interface ColorPickerProps {
  color: { r: number; g: number; b: number; a: number };
  onChange: (color: { r: number; g: number; b: number; a: number }) => void;
  label?: string;
}

export function ColorPicker({ color, onChange, label = "Color" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);

  // Convert RGB to HSV
  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff !== 0) {
      if (max === r) h = ((g - b) / diff) % 6;
      else if (max === g) h = (b - r) / diff + 2;
      else h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : Math.round((diff / max) * 100);
    const v = Math.round(max * 100);

    return { h, s, v };
  };

  // Convert HSV to RGB
  const hsvToRgb = (h: number, s: number, v: number) => {
    h /= 60;
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 1) [r, g, b] = [c, x, 0];
    else if (h >= 1 && h < 2) [r, g, b] = [x, c, 0];
    else if (h >= 2 && h < 3) [r, g, b] = [0, c, x];
    else if (h >= 3 && h < 4) [r, g, b] = [0, x, c];
    else if (h >= 4 && h < 5) [r, g, b] = [x, 0, c];
    else if (h >= 5 && h < 6) [r, g, b] = [c, 0, x];

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  // Initialize HSV from RGB and trigger initial canvas drawing
  useEffect(() => {
    const newHsv = rgbToHsv(color.r, color.g, color.b);
    setHsv(newHsv);
  }, [color.r, color.g, color.b]);

  // Draw main canvas function
  const drawMainCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas first
    ctx.clearRect(0, 0, width, height);

    // Create hue gradient background
    const hueColor = hsvToRgb(hsv.h, 100, 100);
    
    // Create saturation gradient (left to right)
    const satGradient = ctx.createLinearGradient(0, 0, width, 0);
    satGradient.addColorStop(0, 'white');
    satGradient.addColorStop(1, `rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`);
    
    ctx.fillStyle = satGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Create value gradient (top to bottom)
    const valGradient = ctx.createLinearGradient(0, 0, 0, height);
    valGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    valGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    ctx.fillStyle = valGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw current position indicator
    const x = (hsv.s / 100) * width;
    const y = ((100 - hsv.v) / 100) * height;
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.stroke();
  }, [hsv]);

  // Draw hue canvas function
  const drawHueCanvas = useCallback(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas first
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'hsl(0, 100%, 50%)');
    gradient.addColorStop(0.17, 'hsl(60, 100%, 50%)');
    gradient.addColorStop(0.33, 'hsl(120, 100%, 50%)');
    gradient.addColorStop(0.5, 'hsl(180, 100%, 50%)');
    gradient.addColorStop(0.67, 'hsl(240, 100%, 50%)');
    gradient.addColorStop(0.83, 'hsl(300, 100%, 50%)');
    gradient.addColorStop(1, 'hsl(360, 100%, 50%)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw hue position indicator
    const x = (hsv.h / 360) * width;
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }, [hsv.h]);

  // Trigger canvas drawing when popover opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure canvas elements are rendered in DOM
      const timer = setTimeout(() => {
        drawMainCanvas();
        drawHueCanvas();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, hsv]);

  // Draw canvases when hsv changes
  useEffect(() => {
    drawMainCanvas();
  }, [drawMainCanvas]);

  useEffect(() => {
    drawHueCanvas();
  }, [drawHueCanvas]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const s = (x / rect.width) * 100;
    const v = 100 - (y / rect.height) * 100;

    const newHsv = { ...hsv, s: Math.max(0, Math.min(100, s)), v: Math.max(0, Math.min(100, v)) };
    setHsv(newHsv);

    const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    onChange({ ...rgb, a: color.a });
  };

  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const h = (x / rect.width) * 360;

    const newHsv = { ...hsv, h: Math.max(0, Math.min(360, h)) };
    setHsv(newHsv);

    const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
    onChange({ ...rgb, a: color.a });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      handleCanvasClick(e);
    } else if (isHueDragging) {
      handleHueClick(e);
    }
  };

  const presetColors = [
    { r: 255, g: 0, b: 0, a: 255 }, // Red
    { r: 255, g: 165, b: 0, a: 255 }, // Orange
    { r: 255, g: 255, b: 0, a: 255 }, // Yellow
    { r: 0, g: 255, b: 0, a: 255 }, // Green
    { r: 0, g: 255, b: 255, a: 255 }, // Cyan
    { r: 0, g: 0, b: 255, a: 255 }, // Blue
    { r: 128, g: 0, b: 128, a: 255 }, // Purple
    { r: 255, g: 192, b: 203, a: 255 }, // Pink
    { r: 255, g: 255, b: 255, a: 255 }, // White
    { r: 128, g: 128, b: 128, a: 255 }, // Gray
    { r: 0, g: 0, b: 0, a: 255 }, // Black
    { r: 165, g: 42, b: 42, a: 255 }, // Brown
  ];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: color.a
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-12 p-2 flex items-center gap-3 justify-start group"
          >
            <div
              className="w-8 h-8 rounded border-2 border-border shadow-sm"
              style={{
                backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`
              }}
            />
            <div className="text-left flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                rgb({color.r}, {color.g}, {color.b})
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                Alpha: {Math.round((color.a / 255) * 100)}%
              </div>
            </div>
            <Palette size={16} className="text-gray-400 dark:text-gray-300 group-hover:dark:[filter:drop-shadow(0_0_4px_rgba(255,255,255,0.6))] transition-all duration-200" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[450px] p-4 bg-[#0f1419] border border-gray-800 shadow-2xl text-white" align="start">
          <div className="space-y-4">
            {/* Main color picker area */}
            <div className="space-y-3">
              <canvas
                ref={canvasRef}
                width={340}
                height={160}
                className="w-full h-40 border border-gray-700 rounded cursor-crosshair"
                style={{
                  background: `linear-gradient(to right, white, hsl(${hsv.h}, 100%, 50%)), linear-gradient(to bottom, transparent, black)`
                }}
                onClick={handleCanvasClick}
                onMouseDown={(e) => {
                  setIsDragging(true);
                  handleCanvasClick(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              />
              
              {/* Hue slider */}
              <canvas
                ref={hueCanvasRef}
                width={340}
                height={24}
                className="w-full h-6 border border-gray-700 rounded cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`
                }}
                onClick={handleHueClick}
                onMouseDown={(e) => {
                  setIsHueDragging(true);
                  handleHueClick(e);
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsHueDragging(false)}
                onMouseLeave={() => setIsHueDragging(false)}
              />
            </div>

            {/* Alpha slider */}
            <div className="space-y-2">
              <Label className="text-xs text-white">Alpha</Label>
              <div className="relative">
                {/* Checkerboard background */}
                <div 
                  className="absolute inset-0 rounded-md"
                  style={{
                    background: `
                      repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 8px 8px,
                      linear-gradient(to right, 
                        rgba(${color.r}, ${color.g}, ${color.b}, 0) 0%, 
                        rgba(${color.r}, ${color.g}, ${color.b}, 1) 100%)`
                  }}
                />
                <Slider
                  value={[color.a]}
                  onValueChange={([value]) => onChange({ ...color, a: value })}
                  max={255}
                  min={0}
                  step={1}
                  className="relative w-full"
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {Math.round((color.a / 255) * 100)}%
              </div>
            </div>

            {/* Preset colors */}
            <div className="space-y-2">
              <Label className="text-xs">Preset Colors</Label>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((preset, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded border-2 border-gray-700 hover:border-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                    style={{
                      backgroundColor: `rgb(${preset.r}, ${preset.g}, ${preset.b})`
                    }}
                    onClick={() => onChange({ ...preset, a: color.a })}
                  />
                ))}
              </div>
            </div>

            {/* Manual input */}
            <div className="space-y-2">
              <Label className="text-xs text-white">Manual Input</Label>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={color.r}
                  onChange={(e) => onChange({ ...color, r: parseInt(e.target.value) || 0 })}
                  placeholder="R"
                  className="text-sm bg-gray-900 border border-gray-700 text-white focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={color.g}
                  onChange={(e) => onChange({ ...color, g: parseInt(e.target.value) || 0 })}
                  placeholder="G"
                  className="text-sm bg-gray-900 border border-gray-700 text-white focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={color.b}
                  onChange={(e) => onChange({ ...color, b: parseInt(e.target.value) || 0 })}
                  placeholder="B"
                  className="text-sm bg-gray-900 border border-gray-700 text-white focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Input
                  type="number"
                  min="0"
                  max="255"
                  value={color.a}
                  onChange={(e) => onChange({ ...color, a: parseInt(e.target.value) || 0 })}
                  placeholder="A"
                  className="text-sm bg-gray-900 border border-gray-700 text-white focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <Input
                type="text"
                value={rgbToHex(color.r, color.g, color.b)}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target.value);
                  if (rgb) onChange(rgb);
                }}
                placeholder="Hex Color (#RRGGBB)"
                className="text-sm w-full bg-gray-900 border border-gray-700 text-white focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
