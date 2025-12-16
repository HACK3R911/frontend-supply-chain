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
import { CargoStatus, Order } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const statusLabels: Record<CargoStatus, string> = {
  at_warehouse: "На складе",
  in_transit: "В пути",
  delivered: "Доставлен",
  delayed: "Задержка",
};

interface CargoFormProps {
  orders: Order[];
  onSubmit?: (data: CargoFormData) => void;
}

export interface CargoFormData {
  cargoId: string;
  orderId: string;
  weight: number;
  volume: number;
  description: string;
  currentStatus: CargoStatus;
}

export function CargoForm({ orders, onSubmit }: CargoFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CargoFormData>({
    cargoId: "",
    orderId: "",
    weight: 0,
    volume: 0,
    description: "",
    currentStatus: "at_warehouse",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cargoId || !formData.orderId || !formData.description) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (formData.weight <= 0 || formData.volume <= 0) {
      toast.error("Вес и объём должны быть больше 0");
      return;
    }

    onSubmit?.(formData);
    toast.success("Груз успешно добавлен");
    setOpen(false);
    setFormData({
      cargoId: "",
      orderId: "",
      weight: 0,
      volume: 0,
      description: "",
      currentStatus: "at_warehouse",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить груз
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новый груз</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cargoId">Идентификатор груза *</Label>
              <Input
                id="cargoId"
                value={formData.cargoId}
                onChange={(e) => setFormData({ ...formData, cargoId: e.target.value })}
                placeholder="TRK-001-2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус *</Label>
              <Select
                value={formData.currentStatus}
                onValueChange={(value: CargoStatus) => setFormData({ ...formData, currentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Заказ *</Label>
            <Select
              value={formData.orderId}
              onValueChange={(value) => setFormData({ ...formData, orderId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите заказ" />
              </SelectTrigger>
              <SelectContent>
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    {order.orderNumber} - {order.recipient?.name || 'Неизвестный получатель'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание груза *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Электроника - партия смартфонов"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Вес (кг) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight || ""}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                placeholder="250"
                min={0}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Объём (м³) *</Label>
              <Input
                id="volume"
                type="number"
                value={formData.volume || ""}
                onChange={(e) => setFormData({ ...formData, volume: Number(e.target.value) })}
                placeholder="2.5"
                min={0}
                step={0.1}
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
