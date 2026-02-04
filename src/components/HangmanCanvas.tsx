'use client';

import React, { useRef, useEffect, useState } from 'react';

interface HangmanCanvasProps {
  wrongGuesses: number;
  width?: number;
  height?: number;
  strokeColor?: string;
  lineWidth?: number;
}

export default function HangmanCanvas({
  wrongGuesses,
  width = 200,
  height = 220,
  strokeColor = '#e2e8f0',
  lineWidth = 5,
}: HangmanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prevGuesses, setPrevGuesses] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Critical state colors (5+ errors)
  const getCriticalColor = (errors: number): string => {
    if (errors >= 6) return '#ef4444'; // Red when dead
    if (errors >= 5) return '#f87171'; // Light red at 5
    return strokeColor;
  };

  // Drawing functions for each body part
  const drawGallows = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const baseY = height - 25;
    const postX = 45;
    const topY = 25;
    const ropeX = width / 2 + 15;

    // Base (wider for stability)
    ctx.beginPath();
    ctx.moveTo(15, baseY);
    ctx.lineTo(width - 15, baseY);
    ctx.stroke();

    // Small feet for base stability
    ctx.lineWidth = lineWidth - 1;
    ctx.beginPath();
    ctx.moveTo(15, baseY);
    ctx.lineTo(15, baseY + 8);
    ctx.moveTo(width - 15, baseY);
    ctx.lineTo(width - 15, baseY + 8);
    ctx.stroke();
    ctx.lineWidth = lineWidth;

    // Vertical post
    ctx.beginPath();
    ctx.moveTo(postX, baseY);
    ctx.lineTo(postX, topY);
    ctx.stroke();

    // Support beam (diagonal)
    ctx.beginPath();
    ctx.moveTo(postX, topY + 40);
    ctx.lineTo(postX + 30, topY);
    ctx.stroke();

    // Top bar
    ctx.beginPath();
    ctx.moveTo(postX, topY);
    ctx.lineTo(ropeX, topY);
    ctx.stroke();

    // Rope
    ctx.beginPath();
    ctx.moveTo(ropeX, topY);
    ctx.lineTo(ropeX, topY + 25);
    ctx.stroke();
  };

  const drawHead = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const centerX = width / 2 + 15;
    const centerY = 72;
    const radius = 22;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2 * progress);
    ctx.stroke();

    ctx.shadowBlur = 0;
  };

  const drawBody = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const startX = width / 2 + 15;
    const startY = 94;
    const endY = 150;
    const currentY = startY + (endY - startY) * progress;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, currentY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  };

  const drawLeftArm = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const startX = width / 2 + 15;
    const startY = 108;
    const endX = width / 2 - 18;
    const endY = 130;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  };

  const drawRightArm = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const startX = width / 2 + 15;
    const startY = 108;
    const endX = width / 2 + 48;
    const endY = 130;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  };

  const drawLeftLeg = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const startX = width / 2 + 15;
    const startY = 150;
    const endX = width / 2 - 12;
    const endY = 190;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  };

  const drawRightLeg = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const startX = width / 2 + 15;
    const startY = 150;
    const endX = width / 2 + 42;
    const endY = 190;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
    }

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Draw X eyes when dead (6 errors)
    if (progress >= 1) {
      drawDeadFace(ctx, color);
    }

    ctx.shadowBlur = 0;
  };

  const drawDeadFace = (ctx: CanvasRenderingContext2D, color: string) => {
    const centerX = width / 2 + 15;
    const centerY = 72;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    // Left X eye
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY - 6);
    ctx.lineTo(centerX - 4, centerY);
    ctx.moveTo(centerX - 4, centerY - 6);
    ctx.lineTo(centerX - 10, centerY);
    ctx.stroke();
    
    // Right X eye
    ctx.beginPath();
    ctx.moveTo(centerX + 4, centerY - 6);
    ctx.lineTo(centerX + 10, centerY);
    ctx.moveTo(centerX + 10, centerY - 6);
    ctx.lineTo(centerX + 4, centerY);
    ctx.stroke();
    
    // Sad mouth
    ctx.beginPath();
    ctx.arc(centerX, centerY + 14, 6, 0.2 * Math.PI, 0.8 * Math.PI, true);
    ctx.stroke();
    
    ctx.lineWidth = lineWidth;
  };

  // Draw all parts based on current state
  const drawAll = (
    ctx: CanvasRenderingContext2D, 
    parts: number, 
    animatingPart: number, 
    animProgress: number, 
    shakeOffset: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    
    // Apply shake offset
    ctx.save();
    ctx.translate(shakeOffset, 0);

    const currentColor = getCriticalColor(parts);
    const isCritical = parts >= 5;

    // Always draw gallows
    drawGallows(ctx, strokeColor);

    // Draw completed body parts
    const drawFunctions = [drawHead, drawBody, drawLeftArm, drawRightArm, drawLeftLeg, drawRightLeg];
    
    for (let i = 0; i < parts; i++) {
      const partColor = i >= 4 ? getCriticalColor(i + 1) : strokeColor;
      const glow = i >= 4;
      
      if (i < animatingPart) {
        // Fully drawn
        drawFunctions[i](ctx, 1, partColor, glow);
      } else if (i === animatingPart) {
        // Currently animating
        drawFunctions[i](ctx, animProgress, partColor, glow);
      }
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // If wrongGuesses increased, animate the new part
    if (wrongGuesses > prevGuesses && wrongGuesses <= 6) {
      const partToAnimate = wrongGuesses - 1;
      let animProgress = 0;
      const animDuration = 350; // ms
      const shakeDuration = wrongGuesses >= 5 ? 400 : 250; // Longer shake when critical
      const shakeAmplitude = wrongGuesses >= 5 ? 6 : 4; // Stronger shake when critical
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        
        // Animation progress (0 to 1)
        animProgress = Math.min(elapsed / animDuration, 1);
        // Easing function (ease out)
        const easedProgress = 1 - Math.pow(1 - animProgress, 3);

        // Shake effect
        let shakeOffset = 0;
        if (elapsed < shakeDuration) {
          const shakePhase = (elapsed / shakeDuration) * Math.PI * (wrongGuesses >= 5 ? 6 : 4);
          shakeOffset = Math.sin(shakePhase) * shakeAmplitude * (1 - elapsed / shakeDuration);
        }

        drawAll(ctx, wrongGuesses, partToAnimate, easedProgress, shakeOffset);

        if (animProgress < 1 || elapsed < shakeDuration) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setPrevGuesses(wrongGuesses);
        }
      };

      // Cancel any ongoing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    } else if (wrongGuesses < prevGuesses) {
      // Reset (new game)
      drawAll(ctx, wrongGuesses, -1, 1, 0);
      setPrevGuesses(wrongGuesses);
    } else {
      // No animation needed, just draw current state
      drawAll(ctx, wrongGuesses, -1, 1, 0);
      setPrevGuesses(wrongGuesses);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [wrongGuesses, width, height, strokeColor, lineWidth]);

  // Initial draw when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    drawAll(ctx, wrongGuesses, -1, 1, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
      }}
    />
  );
}
