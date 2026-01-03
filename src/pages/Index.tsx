import { useState, useEffect, useRef } from 'react';
import { RobotEyes } from '@/components/RobotEyes';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [intensity, setIntensity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (freq: number) => {
    if (!audioContextRef.current) return;

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(volume / 100 * 0.3, audioContextRef.current.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.start();
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      stopSound();
      return;
    }

    let baseFreq = 200;
    if (intensity < 20) {
      baseFreq = 200;
    } else if (intensity < 50) {
      baseFreq = 300 + (intensity - 20) * 3;
    } else if (intensity < 80) {
      baseFreq = 400 + (intensity - 50) * 5;
    } else {
      baseFreq = 550 + (intensity - 80) * 10;
    }

    const variation = Math.sin(Date.now() * 0.005) * 50;
    playSound(baseFreq + variation);

    const soundInterval = setInterval(() => {
      const variation = Math.sin(Date.now() * 0.005) * 50;
      playSound(baseFreq + variation);
    }, 100);

    return () => {
      clearInterval(soundInterval);
      stopSound();
    };
  }, [intensity, isPlaying, volume]);

  const getMoodText = () => {
    if (intensity < 20) return 'Спокойствие';
    if (intensity < 50) return 'Интерес';
    if (intensity < 80) return 'Наслаждение';
    return 'Экстаз';
  };

  const getMoodEmoji = () => {
    if (intensity < 20) return '😌';
    if (intensity < 50) return '😊';
    if (intensity < 80) return '😍';
    return '🤤';
  };

  const getMoodColor = () => {
    if (intensity < 20) return 'from-gray-100 to-gray-200';
    if (intensity < 50) return 'from-purple-100 to-pink-100';
    if (intensity < 80) return 'from-purple-200 to-pink-200';
    return 'from-purple-300 to-pink-300';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodColor()} transition-all duration-1000 flex flex-col items-center justify-center p-8`}>
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            Робот-ассистент
          </h1>
          <p className="text-gray-600 text-lg">
            Интерактивный помощник с живыми эмоциями
          </p>
        </div>

        <Card className="p-12 bg-white/90 backdrop-blur-sm shadow-2xl border-none">
          <div className="flex items-center justify-center min-h-[280px] mb-8">
            <RobotEyes intensity={intensity} />
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-5xl">{getMoodEmoji()}</span>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{getMoodText()}</div>
              <div className="text-sm text-gray-500">Уровень: {intensity}%</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Интенсивность взаимодействия
                </label>
                <span className="text-sm text-gray-500">{intensity}%</span>
              </div>
              <Slider
                value={[intensity]}
                onValueChange={(value) => setIntensity(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Громкость звука
                </label>
                <span className="text-sm text-gray-500">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>

            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full h-14 text-lg font-semibold"
              variant={isPlaying ? 'destructive' : 'default'}
            >
              <Icon name={isPlaying ? 'VolumeX' : 'Volume2'} size={24} className="mr-3" />
              {isPlaying ? 'Выключить звук' : 'Включить звук'}
            </Button>
          </div>

          {intensity > 70 && (
            <div className="mt-6 p-4 bg-purple-100 rounded-xl border border-purple-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Максимальное удовольствие достигнуто!</span>
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center text-sm text-gray-600">
          <p>Интерактивный робот реагирует на уровень интенсивности</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
