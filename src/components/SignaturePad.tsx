'use client';

import { useRef, useEffect, useState } from 'react';

interface SignaturePadProps {
  value?: string; // stored as data URL
  onChange: (dataUrl: string) => void;
}

export default function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(!!value);
  // Snapshots taken before each stroke so a single bad stroke can be undone
  // without redrawing the whole signature. Capped to bound memory use.
  const [history, setHistory] = useState<{ snapshot: ImageData; hadSig: boolean }[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas background + restore saved signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);

  function getPos(e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev, { snapshot, hadSig: hasSig }].slice(-10));
    }
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPos.current) return;

    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  }

  function endDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSig(true);
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL('image/png'));
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHasSig(false);
    onChange('');
  }

  function undoStroke() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || history.length === 0) return;
    const last = history[history.length - 1];
    ctx.putImageData(last.snapshot, 0, 0);
    setHistory(prev => prev.slice(0, -1));
    setHasSig(last.hadSig);
    onChange(last.hadSig ? canvas.toDataURL('image/png') : '');
  }

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Signature area — draw your signature here with your mouse or finger"
          width={560}
          height={120}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasSig && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm">Sign here using mouse or touchscreen</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Draw your signature above
        </p>
        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              type="button"
              onClick={undoStroke}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Undo stroke
            </button>
          )}
          {hasSig && (
            <button
              type="button"
              onClick={clearSignature}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Clear & Redo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
