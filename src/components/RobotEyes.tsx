import { useEffect, useRef, useState } from 'react';

interface EyePosition {
  x: number;
  y: number;
}

interface RobotEyesProps {
  trackingMode: 'motion' | 'face' | 'expression' | 'idle';
}

export const RobotEyes = ({ trackingMode }: RobotEyesProps) => {
  const [leftEyePos, setLeftEyePos] = useState<EyePosition>({ x: 0, y: 0 });
  const [rightEyePos, setRightEyePos] = useState<EyePosition>({ x: 0, y: 0 });
  const [blinkState, setBlinkState] = useState(false);
  const [expression, setExpression] = useState<'normal' | 'happy' | 'curious'>('normal');
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    };

    if (trackingMode !== 'idle') {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trackingMode]);

  useEffect(() => {
    if (!videoRef.current || trackingMode === 'idle') return;

    const processFrame = () => {
      if (trackingMode === 'motion') {
        const moveX = (Math.sin(Date.now() * 0.001) * 15);
        const moveY = (Math.cos(Date.now() * 0.0015) * 10);
        setLeftEyePos({ x: moveX, y: moveY });
        setRightEyePos({ x: moveX, y: moveY });
      } else if (trackingMode === 'face') {
        const faceX = (Math.sin(Date.now() * 0.002) * 20);
        const faceY = (Math.cos(Date.now() * 0.002) * 15);
        setLeftEyePos({ x: faceX, y: faceY });
        setRightEyePos({ x: faceX, y: faceY });
        setExpression('curious');
      } else if (trackingMode === 'expression') {
        const exprX = (Math.sin(Date.now() * 0.003) * 10);
        const exprY = (Math.cos(Date.now() * 0.003) * 8);
        setLeftEyePos({ x: exprX, y: exprY });
        setRightEyePos({ x: exprX, y: exprY });
        setExpression(Math.random() > 0.5 ? 'happy' : 'normal');
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    processFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [trackingMode]);

  const getEyeShape = () => {
    if (blinkState) return 'h-2';
    if (expression === 'happy') return 'h-20 rounded-t-full rounded-b-lg';
    if (expression === 'curious') return 'h-24 w-24';
    return 'h-24 w-24';
  };

  return (
    <div className="relative flex items-center justify-center gap-16">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="hidden"
      />
      
      <div className="relative">
        <div
          className={`bg-white rounded-full ${getEyeShape()} w-24 shadow-2xl flex items-center justify-center transition-all duration-200 border-4 border-gray-200`}
          style={{
            transform: `translate(${leftEyePos.x}px, ${leftEyePos.y}px)`,
          }}
        >
          {!blinkState && (
            <div
              className="bg-gray-900 rounded-full w-12 h-12 transition-all duration-150"
              style={{
                transform: `translate(${leftEyePos.x * 0.3}px, ${leftEyePos.y * 0.3}px)`,
              }}
            >
              <div className="bg-white rounded-full w-4 h-4 ml-7 mt-2" />
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={`bg-white rounded-full ${getEyeShape()} w-24 shadow-2xl flex items-center justify-center transition-all duration-200 border-4 border-gray-200`}
          style={{
            transform: `translate(${rightEyePos.x}px, ${rightEyePos.y}px)`,
          }}
        >
          {!blinkState && (
            <div
              className="bg-gray-900 rounded-full w-12 h-12 transition-all duration-150"
              style={{
                transform: `translate(${rightEyePos.x * 0.3}px, ${rightEyePos.y * 0.3}px)`,
              }}
            >
              <div className="bg-white rounded-full w-4 h-4 ml-7 mt-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
