import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventType, RouteLeg } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const eventTypeLabels: Record<EventType, string> = {
  created: "Создан",
  departed: "Отправлен",
  arrived: "Прибыл",
  delivered: "Доставлен",
  delayed: "Задержка",
  customs: "Таможня",
};

interface EventFormProps {
  routeLegs: RouteLeg[];
  onSubmit?: (data: EventFormData) => void;
}

export interface EventFormData {
  routeLegId: string;
  eventType: EventType;
  timestamp: string;
  description: string;
  lat?: number;
  lng?: number;
}

export function EventForm({ routeLegs, onSubmit }: EventFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    routeLegId: "",
    eventType: "created",
    timestamp: new Date().toISOString().slice(0, 16),
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.routeLegId || !formData.description) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    onSubmit?.(formData);
    toast.success("Событие успешно добавлено");
    setOpen(false);
    setFormData({
      routeLegId: "",
      eventType: "created",
      timestamp: new Date().toISOString().slice(0, 16),
      description: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить событие
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новое событие</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="routeLeg">Участок маршрута *</Label>
            <Select
              value={formData.routeLegId}
              onValueChange={(value) => setFormData({ ...formData, routeLegId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите участок маршрута" />
              </SelectTrigger>
              <SelectContent>
                {routeLegs.map((leg) => (
                  <SelectItem key={leg.id} value={leg.id}>
                    {leg.startWarehouse?.name || 'Неизвестно'} → {leg.endWarehouse?.name || 'Неизвестно'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Тип события *</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value: EventType) => setFormData({ ...formData, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timestamp">Дата и время *</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={formData.timestamp}
                onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Груз прибыл на склад назначения"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Широта</Label>
              <Input
                id="lat"
                type="number"
                value={formData.lat || ""}
                onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) || undefined })}
                placeholder="55.7558"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Долгота</Label>
              <Input
                id="lng"
                type="number"
                value={formData.lng || ""}
                onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) || undefined })}
                placeholder="37.6173"
                step="any"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Добавить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
