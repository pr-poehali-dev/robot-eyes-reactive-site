import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface HeartParticlesProps {
  intensity: number;
}

export const HeartParticles = ({ intensity }: HeartParticlesProps) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (intensity < 40) {
      setHearts([]);
      return;
    }

    const heartCount = Math.floor((intensity - 40) / 10);
    const interval = Math.max(200, 1000 - intensity * 8);

    const createHeart = () => {
      const newHeart: Heart = {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: 100,
        size: 20 + Math.random() * 30,
        duration: 2 + Math.random() * 2,
        delay: 0,
      };

      setHearts((prev) => {
        const updated = [...prev, newHeart];
        return updated.slice(-heartCount);
      });

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, (newHeart.duration + newHeart.delay) * 1000);
    };

    const heartInterval = setInterval(createHeart, interval);

    return () => clearInterval(heartInterval);
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up"
          style={{
            left: `${heart.x}%`,
            bottom: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💖
        </div>
      ))}
    </div>
  );
};
