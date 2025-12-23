import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransportType, Contractor } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const typeLabels: Record<TransportType, string> = {
  truck: "Грузовик",
  ship: "Корабль",
  plane: "Самолёт",
  train: "Поезд",
};

interface TransportFormProps {
  contractors: Contractor[];
  onSubmit?: (data: TransportFormData) => void;
}

export interface TransportFormData {
  regNumber: string;
  type: TransportType;
  capacity: number;
  contractorId?: string;
}

export function TransportForm({ contractors, onSubmit }: TransportFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TransportFormData>({
    regNumber: "",
    type: "truck",
    capacity: 0,
    contractorId: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.regNumber || formData.capacity <= 0) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    onSubmit?.(formData);
    toast.success("Транспорт успешно добавлен");
    setOpen(false);
    setFormData({ regNumber: "", type: "truck", capacity: 0, contractorId: undefined });
  };

  const carriers = contractors.filter(c => c.type === 'carrier');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить транспорт
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новое транспортное средство</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regNumber">Рег. номер *</Label>
              <Input
                id="regNumber"
                value={formData.regNumber}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value.toUpperCase() })}
                placeholder="А123АА77"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Тип *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TransportType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Грузоподъёмность (кг) *</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              placeholder="5000"
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractor">Перевозчик</Label>
            <Select
              value={formData.contractorId || "none"}
              onValueChange={(value) => setFormData({ ...formData, contractorId: value === "none" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите перевозчика" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указан</SelectItem>
                {carriers.map((contractor) => (
                  <SelectItem key={contractor.id} value={String(contractor.id)}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
