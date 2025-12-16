import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EventType } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'departed', label: 'Отправлен' },
  { value: 'arrived', label: 'Прибыл' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'delayed', label: 'Задержка' },
  { value: 'customs', label: 'Таможенное оформление' },
];

interface AddEventDialogProps {
  cargoId: string;
  onEventAdded?: () => void;
}

export function AddEventDialog({ cargoId, onEventAdded }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState<EventType>('arrived');
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would make an API call
    toast({
      title: "Событие добавлено",
      description: `Событие "${eventTypes.find(t => t.value === eventType)?.label}" успешно зарегистрировано.`,
    });
    
    setOpen(false);
    setLocation("");
    setDescription("");
    onEventAdded?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить событие
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Новое событие</DialogTitle>
            <DialogDescription>
              Зарегистрируйте новое событие для груза
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="event-type">Тип события</Label>
              <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Локация</Label>
              <Input
                id="location"
                placeholder="Например: Москва, Склад А"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                placeholder="Дополнительная информация о событии..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
