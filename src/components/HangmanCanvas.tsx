'use client';

import React, { useRef, useEffect, useState } from 'react';

interface HangmanCanvasProps {
  wrongGuesses: number;
  width?: number;
  height?: number;
}

// Futuristic color palette
const COLORS = {
  // Structure (cyan/teal neon)
  structure: '#00f5ff',
  structureGlow: '#00f5ff',
  structureDim: '#0891b2',
  
  // Body (purple/magenta neon)
  body: '#c084fc',
  bodyGlow: '#a855f7',
  
  // Critical state (red/orange)
  critical: '#ff6b6b',
  criticalGlow: '#ef4444',
  dead: '#ff4757',
  
  // Accents
  accent: '#f472b6',
  warning: '#fbbf24',
};

export default function HangmanCanvas({
  wrongGuesses,
  width = 200,
  height = 220,
}: HangmanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prevGuesses, setPrevGuesses] = useState(0);
  const animationRef = useRef<number | null>(null);
  const idleAnimRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // Get body color based on error count
  const getBodyColor = (errors: number) => {
    if (errors >= 6) return COLORS.dead;
    if (errors >= 5) return COLORS.critical;
    if (errors >= 4) return COLORS.warning;
    return COLORS.body;
  };

  // Create animated metallic gradient
  const createMetallicGradient = (
    ctx: CanvasRenderingContext2D, 
    x1: number, y1: number, 
    x2: number, y2: number, 
    time: number
  ) => {
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    
    // Animated offset for the "shine" effect
    const offset = (Math.sin(time * 0.002) + 1) / 2; // 0 to 1, oscillating
    
    // Metallic colors - cyan to teal to white highlight
    gradient.addColorStop(0, '#0891b2'); // Dark teal
    gradient.addColorStop(Math.max(0, offset - 0.2), '#0891b2');
    gradient.addColorStop(offset, '#67e8f9'); // Bright cyan (highlight)
    gradient.addColorStop(Math.min(1, offset + 0.1), '#ffffff'); // White flash
    gradient.addColorStop(Math.min(1, offset + 0.2), '#22d3ee'); // Cyan
    gradient.addColorStop(1, '#0e7490'); // Dark teal
    
    return gradient;
  };

  // Draw futuristic gallows (tech frame) with metallic animation
  const drawGallows = (ctx: CanvasRenderingContext2D, time: number) => {
    const baseY = height - 25;
    const postX = 40;
    const topY = 22;
    const ropeX = width / 2 + 15;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Base platform with metallic gradient
    const baseGradient = createMetallicGradient(ctx, 10, baseY, width - 10, baseY, time);
    ctx.strokeStyle = baseGradient;
    ctx.lineWidth = 4;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    ctx.moveTo(10, baseY);
    ctx.lineTo(width - 10, baseY);
    ctx.stroke();

    // Tech details on base
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLORS.structureDim;
    ctx.shadowBlur = 3;
    
    // Left tech marker
    ctx.beginPath();
    ctx.moveTo(20, baseY - 5);
    ctx.lineTo(20, baseY + 5);
    ctx.moveTo(15, baseY);
    ctx.lineTo(25, baseY);
    ctx.stroke();
    
    // Right tech marker
    ctx.beginPath();
    ctx.moveTo(width - 20, baseY - 5);
    ctx.lineTo(width - 20, baseY + 5);
    ctx.moveTo(width - 25, baseY);
    ctx.lineTo(width - 15, baseY);
    ctx.stroke();

    // Main vertical post with metallic gradient (vertical shine)
    const postGradient = createMetallicGradient(ctx, postX - 5, baseY, postX + 5, topY, time + 500);
    ctx.lineWidth = 5;
    ctx.strokeStyle = postGradient;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f5ff';
    
    ctx.beginPath();
    ctx.moveTo(postX, baseY);
    ctx.lineTo(postX, topY);
    ctx.stroke();

    // Horizontal beam with metallic gradient
    const beamGradient = createMetallicGradient(ctx, postX, topY, ropeX + 5, topY, time + 1000);
    ctx.strokeStyle = beamGradient;
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.moveTo(postX - 5, topY);
    ctx.lineTo(ropeX + 5, topY);
    ctx.stroke();

    // Corner bracket (tech style)
    ctx.lineWidth = 3;
    ctx.strokeStyle = COLORS.structureDim;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.moveTo(postX, topY + 25);
    ctx.lineTo(postX + 20, topY);
    ctx.stroke();

    // Energy nodes (small circles at joints) - pulsing
    const nodePulse = (Math.sin(time * 0.005) + 1) / 2;
    const nodeColor = `rgba(0, 245, 255, ${0.7 + nodePulse * 0.3})`;
    ctx.fillStyle = nodeColor;
    ctx.shadowBlur = 12 + nodePulse * 8;
    ctx.shadowColor = '#00f5ff';
    
    // Base left node
    ctx.beginPath();
    ctx.arc(20, baseY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Base right node
    ctx.beginPath();
    ctx.arc(width - 20, baseY, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Top corner node
    ctx.beginPath();
    ctx.arc(postX, topY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Rope attachment node
    ctx.beginPath();
    ctx.arc(ropeX, topY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Digital rope (dashed energy beam)
    ctx.strokeStyle = COLORS.accent;
    ctx.shadowColor = COLORS.accent;
    ctx.shadowBlur = 6;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ropeX, topY + 3);
    ctx.lineTo(ropeX, topY + 28);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.shadowBlur = 0;
  };

  // Draw futuristic head (hexagonal/circular with tech details)
  const drawHead = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const centerX = width / 2 + 15;
    const centerY = 72;
    const radius = 20;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
    }

    // Main head circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    // Inner tech ring (when fully drawn)
    if (progress >= 1) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.shadowBlur = 0;
  };

  // Draw body (energy core style)
  const drawBody = (ctx: CanvasRenderingContext2D, progress: number, color: string, glow: boolean) => {
    const startX = width / 2 + 15;
    const startY = 92;
    const endY = 148;
    const currentY = startY + (endY - startY) * progress;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
    }

    // Main body line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, currentY);
    ctx.stroke();

    // Core energy node in middle (when fully drawn)
    if (progress >= 1) {
      const coreY = (startY + endY) / 2;
      ctx.fillStyle = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(startX, coreY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  };

  // Draw arm with energy effect
  const drawArm = (
    ctx: CanvasRenderingContext2D, 
    progress: number, 
    color: string, 
    glow: boolean,
    isLeft: boolean
  ) => {
    const startX = width / 2 + 15;
    const startY = 105;
    const endX = isLeft ? width / 2 - 15 : width / 2 + 45;
    const endY = 128;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Hand node
    if (progress >= 1) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  };

  // Draw leg with energy effect
  const drawLeg = (
    ctx: CanvasRenderingContext2D, 
    progress: number, 
    color: string, 
    glow: boolean,
    isLeft: boolean
  ) => {
    const startX = width / 2 + 15;
    const startY = 148;
    const endX = isLeft ? width / 2 - 5 : width / 2 + 35;
    const endY = 188;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    if (glow) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Foot node
    if (progress >= 1) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(endX, endY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
  };

  // Draw dead face (glitchy X eyes)
  const drawDeadFace = (ctx: CanvasRenderingContext2D, color: string) => {
    const centerX = width / 2 + 15;
    const centerY = 72;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    
    // Left X eye
    ctx.beginPath();
    ctx.moveTo(centerX - 10, centerY - 5);
    ctx.lineTo(centerX - 4, centerY + 1);
    ctx.moveTo(centerX - 4, centerY - 5);
    ctx.lineTo(centerX - 10, centerY + 1);
    ctx.stroke();
    
    // Right X eye
    ctx.beginPath();
    ctx.moveTo(centerX + 4, centerY - 5);
    ctx.lineTo(centerX + 10, centerY + 1);
    ctx.moveTo(centerX + 10, centerY - 5);
    ctx.lineTo(centerX + 4, centerY + 1);
    ctx.stroke();
    
    // Glitchy mouth
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - 6, centerY + 10);
    ctx.lineTo(centerX - 2, centerY + 13);
    ctx.lineTo(centerX + 2, centerY + 9);
    ctx.lineTo(centerX + 6, centerY + 12);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  };

  // Main draw function
  const drawAll = (
    ctx: CanvasRenderingContext2D, 
    parts: number, 
    animatingPart: number, 
    animProgress: number, 
    shakeOffset: number,
    time: number
  ) => {
    ctx.clearRect(0, 0, width, height);
    
    // Dark background with subtle gradient
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    gradient.addColorStop(0, 'rgba(30, 27, 75, 0.3)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.save();
    ctx.translate(shakeOffset, 0);

    // Draw gallows with animated metallic effect
    drawGallows(ctx, time);

    // Draw body parts
    const drawFunctions = [
      (ctx: CanvasRenderingContext2D, p: number, c: string, g: boolean) => drawHead(ctx, p, c, g),
      (ctx: CanvasRenderingContext2D, p: number, c: string, g: boolean) => drawBody(ctx, p, c, g),
      (ctx: CanvasRenderingContext2D, p: number, c: string, g: boolean) => drawArm(ctx, p, c, g, true),
      (ctx: CanvasRenderingContext2D, p: number, c: string, g: boolean) => drawArm(ctx, p, c, g, false),
      (ctx: CanvasRenderingContext2D, p: number, c: string, g: boolean) => drawLeg(ctx, p, c, g, true),
      (ctx: CanvasRenderingContext2D, p: number, c: string, g: boolean) => drawLeg(ctx, p, c, g, false),
    ];
    
    for (let i = 0; i < parts && i < 6; i++) {
      const color = getBodyColor(i + 1);
      const glow = true;
      
      // If animatingPart is -1, draw all parts fully (idle state)
      // If we're before the animating part, draw fully
      // If we ARE the animating part, draw with progress
      if (animatingPart === -1 || i < animatingPart) {
        drawFunctions[i](ctx, 1, color, glow);
      } else if (i === animatingPart) {
        drawFunctions[i](ctx, animProgress, color, glow);
      }
      // Parts after animatingPart are not drawn yet
    }

    // Draw dead face when game over
    if (parts >= 6) {
      drawDeadFace(ctx, COLORS.dead);
    }

    ctx.restore();
  };

  // Idle animation loop (continuous metallic shine)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();
    
    const idleAnimate = (currentTime: number) => {
      timeRef.current = currentTime;
      
      // Only redraw if not in the middle of a part animation
      if (!animationRef.current) {
        drawAll(ctx, wrongGuesses, -1, 1, 0, currentTime);
      }
      
      idleAnimRef.current = requestAnimationFrame(idleAnimate);
    };

    idleAnimRef.current = requestAnimationFrame(idleAnimate);

    return () => {
      if (idleAnimRef.current) {
        cancelAnimationFrame(idleAnimRef.current);
      }
    };
  }, [wrongGuesses, width, height]);

  // Part animation (when wrong guess happens)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (wrongGuesses > prevGuesses && wrongGuesses <= 6) {
      const partToAnimate = wrongGuesses - 1;
      let animProgress = 0;
      const animDuration = 400;
      const shakeDuration = wrongGuesses >= 5 ? 500 : 300;
      const shakeAmplitude = wrongGuesses >= 5 ? 8 : 5;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        
        animProgress = Math.min(elapsed / animDuration, 1);
        const easedProgress = 1 - Math.pow(1 - animProgress, 3);

        let shakeOffset = 0;
        if (elapsed < shakeDuration) {
          const shakePhase = (elapsed / shakeDuration) * Math.PI * (wrongGuesses >= 5 ? 8 : 5);
          shakeOffset = Math.sin(shakePhase) * shakeAmplitude * (1 - elapsed / shakeDuration);
        }

        drawAll(ctx, wrongGuesses, partToAnimate, easedProgress, shakeOffset, currentTime);

        if (animProgress < 1 || elapsed < shakeDuration) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animationRef.current = null;
          setPrevGuesses(wrongGuesses);
        }
      };

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = requestAnimationFrame(animate);
    } else if (wrongGuesses !== prevGuesses) {
      setPrevGuesses(wrongGuesses);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [wrongGuesses]);

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
