import { useEffect, useState } from 'react';

interface RobotEyesProps {
  intensity: number;
  motionDetected: boolean;
}

type Expression = 'idle' | 'excited' | 'pleasure' | 'ecstasy';

export const RobotEyes = ({ intensity, motionDetected }: RobotEyesProps) => {
  const [blinkState, setBlinkState] = useState(false);
  const [expression, setExpression] = useState<Expression>('idle');
  const [eyeOpenness, setEyeOpenness] = useState(1);
  const [pupilSize, setPupilSize] = useState(0.5);
  const [eyeMovement, setEyeMovement] = useState({ x: 0, y: 0 });
  const [isVibrating, setIsVibrating] = useState(false);
  const [lidHeight, setLidHeight] = useState(0);

  useEffect(() => {
    if (intensity < 20) {
      setExpression('idle');
      setEyeOpenness(1);
      setPupilSize(0.5);
      setLidHeight(0);
    } else if (intensity < 50) {
      setExpression('excited');
      setEyeOpenness(1.15);
      setPupilSize(0.65);
      setLidHeight(10);
    } else if (intensity < 80) {
      setExpression('pleasure');
      setEyeOpenness(0.6);
      setPupilSize(0.85);
      setLidHeight(25);
    } else {
      setExpression('ecstasy');
      setEyeOpenness(0.25);
      setPupilSize(1.1);
      setLidHeight(40);
      setIsVibrating(true);
    }

    if (intensity < 80) {
      setIsVibrating(false);
    }
  }, [intensity]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (expression !== 'ecstasy' && !motionDetected) {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, [expression, motionDetected]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (motionDetected && intensity > 30) {
        const speed = 0.003 + (intensity / 100) * 0.007;
        const amplitude = 15 + (intensity / 100) * 20;
        setEyeMovement({
          x: Math.sin(Date.now() * speed) * amplitude,
          y: -5 - (intensity / 100) * 15 + Math.cos(Date.now() * speed * 0.7) * 10,
        });
      } else if (expression === 'idle') {
        setEyeMovement({
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 10,
        });
      } else if (expression === 'excited') {
        setEyeMovement({
          x: Math.sin(Date.now() * 0.004) * 18,
          y: Math.cos(Date.now() * 0.003) * 12,
        });
      } else if (expression === 'pleasure') {
        setEyeMovement({
          x: Math.sin(Date.now() * 0.006) * 25,
          y: -12 + Math.sin(Date.now() * 0.005) * 8,
        });
      } else if (expression === 'ecstasy') {
        setEyeMovement({
          x: Math.sin(Date.now() * 0.012) * 35,
          y: -25 + Math.sin(Date.now() * 0.01) * 5,
        });
      }
    }, 50);

    return () => clearInterval(moveInterval);
  }, [expression, motionDetected, intensity]);

  const getEyeHeight = () => {
    if (blinkState) return 'h-2';
    const height = 96 * eyeOpenness;
    return `h-[${height}px]`;
  };

  const getEyeShape = () => {
    if (expression === 'idle') return 'rounded-full';
    if (expression === 'excited') return 'rounded-full';
    if (expression === 'pleasure') return 'rounded-[50%] rounded-t-full';
    if (expression === 'ecstasy') return 'rounded-full';
    return 'rounded-full';
  };

  const getPupilSize = () => {
    return 48 * pupilSize;
  };

  const renderEye = () => {
    const eyeHeight = blinkState ? 8 : 96 * eyeOpenness;
    
    return (
      <div className="relative">
        <div
          className={`relative bg-white ${getEyeShape()} w-24 shadow-2xl flex items-center justify-center transition-all duration-300 border-4 border-purple-300/40 overflow-hidden ${
            isVibrating ? 'animate-shake' : ''
          }`}
          style={{
            height: `${eyeHeight}px`,
            transform: `translate(${eyeMovement.x}px, ${eyeMovement.y}px)`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-pink-200/60 to-transparent transition-all duration-500"
            style={{
              height: `${lidHeight}%`,
            }}
          />
          
          {!blinkState && (
            <div
              className="bg-gray-900 rounded-full transition-all duration-300 relative"
              style={{
                width: `${getPupilSize()}px`,
                height: `${getPupilSize()}px`,
              }}
            >
              <div 
                className="bg-white rounded-full absolute"
                style={{
                  width: `${getPupilSize() * 0.35}px`,
                  height: `${getPupilSize() * 0.35}px`,
                  left: '65%',
                  top: '15%',
                }}
              />
              {intensity > 60 && (
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 65% 15%, rgba(255,182,193,0.4) 0%, transparent 60%)',
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex items-center justify-center gap-16 select-none">
      {renderEye()}
      {renderEye()}
    </div>
  );
};