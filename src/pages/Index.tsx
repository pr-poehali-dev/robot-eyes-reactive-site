import { useState, useEffect, useRef } from 'react';
import { RobotEyes } from '@/components/RobotEyes';
import { HeartParticles } from '@/components/HeartParticles';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [intensity, setIntensity] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [motionDetected, setMotionDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousFrameRef = useRef<ImageData | null>(null);
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

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    };

    const detectMotion = () => {
      if (!videoRef.current || !cameraEnabled) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (previousFrameRef.current) {
        let diffSum = 0;
        for (let i = 0; i < currentFrame.data.length; i += 4) {
          const diff = Math.abs(currentFrame.data[i] - previousFrameRef.current.data[i]);
          diffSum += diff;
        }

        const avgDiff = diffSum / (currentFrame.data.length / 4);
        const motionThreshold = 10;
        const isMotion = avgDiff > motionThreshold;

        setMotionDetected(isMotion);

        if (isMotion && intensity < 100) {
          setIntensity((prev) => Math.min(100, prev + 0.5));
        } else if (!isMotion && intensity > 0) {
          setIntensity((prev) => Math.max(0, prev - 0.2));
        }
      }

      previousFrameRef.current = currentFrame;
      animationFrameId = requestAnimationFrame(detectMotion);
    };

    if (cameraEnabled) {
      startCamera();
      detectMotion();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [cameraEnabled, intensity]);

  const playSound = (freq: number, waveType: OscillatorType = 'sine') => {
    if (!audioContextRef.current) return;

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = waveType;
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
    let waveType: OscillatorType = 'sine';
    
    if (intensity < 20) {
      baseFreq = 200;
      waveType = 'sine';
    } else if (intensity < 50) {
      baseFreq = 300 + (intensity - 20) * 3;
      waveType = 'sine';
    } else if (intensity < 80) {
      baseFreq = 400 + (intensity - 50) * 4;
      waveType = 'triangle';
    } else {
      baseFreq = 500 + (intensity - 80) * 8;
      waveType = 'sawtooth';
    }

    const variation = Math.sin(Date.now() * 0.005) * (20 + intensity * 0.5);
    playSound(baseFreq + variation, waveType);

    const soundInterval = setInterval(() => {
      const variation = Math.sin(Date.now() * 0.005) * (20 + intensity * 0.5);
      playSound(baseFreq + variation, waveType);
    }, 80);

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
    <div className={`min-h-screen bg-gradient-to-br ${getMoodColor()} transition-all duration-1000 flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
      <HeartParticles intensity={intensity} />
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <div className="max-w-3xl w-full space-y-8 relative z-20">
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
            <RobotEyes intensity={intensity} motionDetected={motionDetected} />
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

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
              <div className="space-y-1">
                <Label htmlFor="camera" className="text-base font-medium cursor-pointer">
                  Отслеживание через камеру
                </Label>
                <p className="text-sm text-gray-500">
                  Робот реагирует на ваши движения
                </p>
              </div>
              <Switch
                id="camera"
                checked={cameraEnabled}
                onCheckedChange={setCameraEnabled}
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

          {motionDetected && cameraEnabled && (
            <div className="mt-6 p-4 bg-green-100 rounded-xl border border-green-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <Icon name="Camera" size={20} className="text-green-600" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Движение обнаружено!</span> Интенсивность растёт автоматически
                </p>
              </div>
            </div>
          )}
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
          <p>Интерактивный робот с отслеживанием движений и звуковыми реакциями</p>
        </div>
      </div>
    </div>
  );
};

export default Index;