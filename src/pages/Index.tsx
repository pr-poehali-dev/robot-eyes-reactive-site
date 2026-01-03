import { useState } from 'react';
import { RobotEyes } from '@/components/RobotEyes';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [motionTracking, setMotionTracking] = useState(false);
  const [faceTracking, setFaceTracking] = useState(false);
  const [expressionTracking, setExpressionTracking] = useState(false);

  const getTrackingMode = (): 'motion' | 'face' | 'expression' | 'idle' => {
    if (expressionTracking) return 'expression';
    if (faceTracking) return 'face';
    if (motionTracking) return 'motion';
    return 'idle';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Интерактивный Робот
          </h1>
          <p className="text-gray-600 text-lg">
            Глаза робота реагируют на движение и распознают лица через камеру
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[300px] bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-gray-200">
          <RobotEyes trackingMode={getTrackingMode()} />
        </div>

        <Card className="p-8 space-y-6 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Settings" size={28} className="text-primary" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Настройки робота
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="motion" className="text-base font-medium text-gray-900 cursor-pointer">
                  Отслеживание движения
                </Label>
                <p className="text-sm text-gray-500">
                  Глаза следят за движениями перед камерой
                </p>
              </div>
              <Switch
                id="motion"
                checked={motionTracking}
                onCheckedChange={setMotionTracking}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="face" className="text-base font-medium text-gray-900 cursor-pointer">
                  Распознавание лиц
                </Label>
                <p className="text-sm text-gray-500">
                  Робот находит и следит за лицами в кадре
                </p>
              </div>
              <Switch
                id="face"
                checked={faceTracking}
                onCheckedChange={setFaceTracking}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="expression" className="text-base font-medium text-gray-900 cursor-pointer">
                  Изменение выражения
                </Label>
                <p className="text-sm text-gray-500">
                  Глаза меняют форму в зависимости от эмоций
                </p>
              </div>
              <Switch
                id="expression"
                checked={expressionTracking}
                onCheckedChange={setExpressionTracking}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {(motionTracking || faceTracking || expressionTracking) && (
            <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <Icon name="Camera" size={20} className="text-primary mt-0.5" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Камера активна:</span> Разрешите доступ к камере для работы отслеживания
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Вдохновлено интерфейсом СберКассы</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
