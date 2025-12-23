import React, { useEffect, useRef, useState } from 'react';

interface TreeParticle {
  yRatio: number;
  y: number;
  baseX: number;
  baseZ: number;
  x: number;
  z: number;
  hue: number;
  size: number;
  blinkSpeed: number;
  blinkOffset: number;
  currentRadiusScale: number;
  targetRadiusScale: number;
  alpha: number;
}

interface SnowParticle {
  x: number;
  y: number;
  z: number;
  vy: number;
  size: number;
}

interface ChristmasTreeProps {
  onClose: () => void;
}

const ChristmasTree: React.FC<ChristmasTreeProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<TreeParticle[]>([]);
  const snowParticlesRef = useRef<SnowParticle[]>([]);
  const animationFrameRef = useRef<number>();
  const messageShownRef = useRef(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  
  const loveLetter = "在这个特别的夜晚，\n我想把最亮的星星摘下来给你。\n愿你的世界即使在寒冬，\n也永远温暖如春。\n亲爱的，圣诞快乐！\n永远爱你。";

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let angleY = 0;
    const autoRotateSpeed = 0.005;
    let isInteracting = false;
    let lastX = 0;
    let state: 'waiting' | 'blooming' | 'idle' = 'waiting';
    let bloomStartTime = Date.now();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // 3D辅助函数
    const project3D = (x: number, y: number, z: number) => {
      const fov = 350;
      const scale = fov / (fov + z);
      const x2d = x * scale + width / 2;
      const y2d = y * scale + height / 2;
      return { x: x2d, y: y2d, scale };
    };

    const rotateY = (x: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: x * cos - z * sin,
        z: x * sin + z * cos
      };
    };

    // 创建树粒子
    const createTreeParticle = (yRatio: number, angleOffset: number, radiusMax: number): TreeParticle => {
      const y = (yRatio - 0.5) * 500;
      const spiralAngle = yRatio * Math.PI * 15 + angleOffset;
      const radius = (1 - yRatio) * radiusMax;
      const baseX = Math.cos(spiralAngle) * radius;
      const baseZ = Math.sin(spiralAngle) * radius;
      
      const hue = Math.random() < 0.8 ? 120 + Math.random() * 40 : Math.random() * 60 + 330;
      const finalHue = Math.random() > 0.95 ? 60 : hue;
      
      return {
        yRatio,
        y,
        baseX,
        baseZ,
        x: baseX,
        z: baseZ,
        hue: finalHue,
        size: Math.random() * 2 + 1,
        blinkSpeed: Math.random() * 0.05 + 0.01,
        blinkOffset: Math.random() * Math.PI * 2,
        currentRadiusScale: 0,
        targetRadiusScale: 1,
        alpha: 0.4
      };
    };

    // 创建雪花粒子
    const createSnowParticle = (): SnowParticle => ({
      x: Math.random() * width - width / 2,
      y: -height / 2 - Math.random() * height,
      z: Math.random() * 600 - 300,
      vy: Math.random() * 1 + 0.5,
      size: Math.random() * 2 + 0.5
    });

    // 初始化场景
    const initTree = () => {
      particlesRef.current = [];
      for (let i = 0; i < 800; i++) {
        particlesRef.current.push(createTreeParticle(Math.random(), Math.random() * Math.PI * 2, 180));
      }
      snowParticlesRef.current = [];
      for (let i = 0; i < 150; i++) {
        snowParticlesRef.current.push(createSnowParticle());
      }
    };

    initTree();

    // 打字机效果函数
    const typeWriter = (text: string) => {
      let i = 0;
      setMessage('');
      const speed = 100;
      
      const type = () => {
        if (i < text.length) {
          const char = text.charAt(i);
          setMessage(prev => prev + char);
          i++;
          setTimeout(type, speed);
        }
      };
      type();
    };

    // 星星类
    class Star {
      y = -260;
      size = 10;
      color = '#ffeb3b';
      glow = 0;

      draw(ctx: CanvasRenderingContext2D, rotationAngle: number) {
        const p = project3D(0, this.y + 50, 0);
        this.glow = 15 + 10 * Math.sin(Date.now() * 0.003);

        if (p.scale > 0) {
          const gradient = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, this.glow * p.scale);
          gradient.addColorStop(0, 'rgba(255, 235, 59, 1)');
          gradient.addColorStop(0.4, 'rgba(255, 215, 0, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, this.glow * p.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const topStar = new Star();

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 更新旋转
      if (!isInteracting) {
        angleY += autoRotateSpeed;
      }

      // 更新状态
      if (state === 'waiting') {
        state = 'blooming';
        bloomStartTime = Date.now();
      }

      // 更新雪花
      snowParticlesRef.current.forEach(p => {
        p.y += p.vy;
        if (p.y > height / 2) {
          const reset = createSnowParticle();
          p.x = reset.x;
          p.y = -height / 2;
          p.z = reset.z;
          p.vy = reset.vy;
          p.size = reset.size;
        }
      });

      // 更新树粒子
      let allExpanded = true;
      particlesRef.current.forEach(p => {
        p.alpha = 0.4 + 0.4 * Math.sin(Date.now() * p.blinkSpeed * 0.05 + p.blinkOffset);
        
        if (state === 'blooming') {
          if (p.currentRadiusScale < 0.99) {
            p.currentRadiusScale += 0.02 * (1.1 - p.yRatio);
            if (p.currentRadiusScale > 1) p.currentRadiusScale = 1;
            allExpanded = false;
          } else {
            p.currentRadiusScale = 1;
          }
        } else if (state === 'idle') {
          p.currentRadiusScale = 1;
        }

        const currentRadius = p.currentRadiusScale;
        p.x = p.baseX * currentRadius;
        p.z = p.baseZ * currentRadius;
      });

      // 所有粒子展开后，进入idle状态并显示消息
      // 使用两种判断：粒子全部展开，或者超过3秒（确保消息一定会显示）
      const bloomDuration = Date.now() - bloomStartTime;
      const shouldShowMessage = (state === 'blooming' && allExpanded) || (bloomDuration > 3000);
      
      if (shouldShowMessage && !messageShownRef.current) {
        state = 'idle';
        messageShownRef.current = true;
        setTimeout(() => {
          setShowMessage(true);
          typeWriter(loveLetter);
        }, 1000);
      }

      // 深度排序
      particlesRef.current.sort((a, b) => {
        const ra = rotateY(a.x, a.z, angleY);
        const rb = rotateY(b.x, b.z, angleY);
        return rb.z - ra.z;
      });

      // 绘制雪花
      snowParticlesRef.current.forEach(p => {
        const rotated = rotateY(p.x, p.z, angleY * 0.5);
        const proj = project3D(rotated.x, p.y, rotated.z);
        if (proj.scale > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * proj.scale})`;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 绘制树
      particlesRef.current.forEach(p => {
        const rotated = rotateY(p.x, p.z, angleY);
        const proj = project3D(rotated.x, p.y + 50, rotated.z);
        if (proj.scale > 0) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
          let brightness = 50;
          if (p.hue < 70) brightness = 70;
          ctx.fillStyle = `hsla(${p.hue}, 80%, ${brightness}%, ${p.alpha})`;
          ctx.fill();
        }
      });

      // 绘制星星
      if (state === 'blooming' || state === 'idle') {
        topStar.draw(ctx, angleY);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 交互逻辑
    const container = canvas.parentElement;
    if (!container) return;

    const onStart = (x: number) => {
      isInteracting = true;
      lastX = x;
    };

    const onMove = (x: number) => {
      if (!isInteracting) return;
      const deltaX = x - lastX;
      angleY += deltaX * 0.005;
      lastX = x;
    };

    const onEnd = () => {
      isInteracting = false;
    };

    const handleMouseDown = (e: MouseEvent) => onStart(e.clientX);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const handleMouseUp = () => onEnd();
    const handleTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      onMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => onEnd();

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[60] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${isClosing ? 'animate-fade-out-overlay' : 'animate-fade-in-overlay'}`}>
      <div className="absolute inset-0 animate-fade-in-bg" style={{ 
        background: 'radial-gradient(circle at center, #1a2a3a 0%, #000000 100%)'
      }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-0 animate-fade-in-canvas"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* 消息卡片 */}
      {showMessage && (
        <div className="absolute bottom-[15%] left-0 right-0 flex justify-center px-4 animate-fade-in-up">
          <div className="max-w-md w-full text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="font-serif text-4xl md:text-5xl text-amber-300 mb-4" style={{
              fontFamily: "'Dancing Script', cursive",
              textShadow: '0 0 10px rgba(255, 202, 40, 0.5)'
            }}>
              Merry Christmas
            </div>
            <div 
              className="text-base md:text-lg text-slate-200 leading-relaxed whitespace-pre-line min-h-[120px]"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
            >
              {message}
            </div>
          </div>
        </div>
      )}

      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 p-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-800/50 text-amber-200/70 hover:text-amber-200 transition-all opacity-0 animate-fade-in-close"
        style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style>{`
        @keyframes fadeInOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInBg {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInCanvas {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-overlay {
          animation: fadeInOverlay 0.6s ease-out forwards;
        }
        .animate-fade-in-bg {
          animation: fadeInBg 0.8s ease-out forwards;
        }
        .animate-fade-in-canvas {
          animation: fadeInCanvas 1s ease-out 0.2s forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-fade-in-close {
          animation: fadeInOverlay 0.5s ease-out forwards;
        }
        @keyframes fadeOutOverlay {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        .animate-fade-out-overlay {
          animation: fadeOutOverlay 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
};

export default ChristmasTree;

