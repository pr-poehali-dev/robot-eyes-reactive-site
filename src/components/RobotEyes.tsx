import { useEffect, useState } from 'react';

interface RobotEyesProps {
  intensity: number;
}

type Expression = 'idle' | 'excited' | 'pleasure' | 'ecstasy';

export const RobotEyes = ({ intensity }: RobotEyesProps) => {
  const [blinkState, setBlinkState] = useState(false);
  const [expression, setExpression] = useState<Expression>('idle');
  const [eyeOpenness, setEyeOpenness] = useState(1);
  const [pupilSize, setPupilSize] = useState(0.5);
  const [eyeMovement, setEyeMovement] = useState({ x: 0, y: 0 });
  const [isVibrating, setIsVibrating] = useState(false);

  useEffect(() => {
    if (intensity < 20) {
      setExpression('idle');
      setEyeOpenness(1);
      setPupilSize(0.5);
    } else if (intensity < 50) {
      setExpression('excited');
      setEyeOpenness(1.1);
      setPupilSize(0.6);
    } else if (intensity < 80) {
      setExpression('pleasure');
      setEyeOpenness(0.7);
      setPupilSize(0.8);
    } else {
      setExpression('ecstasy');
      setEyeOpenness(0.3);
      setPupilSize(1);
      setIsVibrating(true);
    }

    if (intensity < 80) {
      setIsVibrating(false);
    }
  }, [intensity]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (expression !== 'ecstasy') {
        setBlinkState(true);
        setTimeout(() => setBlinkState(false), 150);
      }
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(blinkInterval);
  }, [expression]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (expression === 'idle') {
        setEyeMovement({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 15,
        });
      } else if (expression === 'excited') {
        setEyeMovement({
          x: Math.sin(Date.now() * 0.003) * 15,
          y: Math.cos(Date.now() * 0.002) * 10,
        });
      } else if (expression === 'pleasure') {
        setEyeMovement({
          x: Math.sin(Date.now() * 0.005) * 25,
          y: -10 + Math.sin(Date.now() * 0.004) * 8,
        });
      } else if (expression === 'ecstasy') {
        setEyeMovement({
          x: Math.sin(Date.now() * 0.01) * 30,
          y: -20 + Math.sin(Date.now() * 0.008) * 5,
        });
      }
    }, 50);

    return () => clearInterval(moveInterval);
  }, [expression]);

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

  return (
    <div className="relative flex items-center justify-center gap-16 select-none">
      <div className="relative">
        <div
          className={`bg-white ${getEyeShape()} w-24 shadow-2xl flex items-center justify-center transition-all duration-300 border-4 border-primary/20 ${
            isVibrating ? 'animate-shake' : ''
          }`}
          style={{
            height: blinkState ? '8px' : `${96 * eyeOpenness}px`,
            transform: `translate(${eyeMovement.x}px, ${eyeMovement.y}px)`,
          }}
        >
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
                  width: `${getPupilSize() * 0.3}px`,
                  height: `${getPupilSize() * 0.3}px`,
                  left: '60%',
                  top: '20%',
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={`bg-white ${getEyeShape()} w-24 shadow-2xl flex items-center justify-center transition-all duration-300 border-4 border-primary/20 ${
            isVibrating ? 'animate-shake' : ''
          }`}
          style={{
            height: blinkState ? '8px' : `${96 * eyeOpenness}px`,
            transform: `translate(${eyeMovement.x}px, ${eyeMovement.y}px)`,
          }}
        >
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
                  width: `${getPupilSize() * 0.3}px`,
                  height: `${getPupilSize() * 0.3}px`,
                  left: '60%',
                  top: '20%',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
