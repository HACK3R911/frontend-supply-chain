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
import { OrderStatus, Contractor } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Ожидает",
  in_transit: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

interface OrderFormProps {
  contractors: Contractor[];
  onSubmit?: (data: OrderFormData) => void;
}

export interface OrderFormData {
  orderNumber: string;
  totalCost: number;
  status: OrderStatus;
  senderId: string;
  recipientId: string;
  shipmentDate?: string;
  deliveryDate?: string;
}

export function OrderForm({ contractors, onSubmit }: OrderFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: "",
    totalCost: 0,
    status: "pending",
    senderId: "",
    recipientId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderNumber || !formData.senderId || !formData.recipientId) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (formData.senderId === formData.recipientId) {
      toast.error("Отправитель и получатель должны быть разными");
      return;
    }

    onSubmit?.(formData);
    toast.success("Заказ успешно создан");
    setOpen(false);
    setFormData({
      orderNumber: "",
      totalCost: 0,
      status: "pending",
      senderId: "",
      recipientId: "",
    });
  };

  const suppliers = contractors.filter(c => c.role === 'supplier');
  const clients = contractors.filter(c => c.role === 'client');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Новый заказ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новый заказ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Номер заказа *</Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="ORD-2024-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Статус *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: OrderStatus) => setFormData({ ...formData, status: value })}
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
            <Label htmlFor="sender">Отправитель *</Label>
            <Select
              value={formData.senderId}
              onValueChange={(value) => setFormData({ ...formData, senderId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите отправителя" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((contractor) => (
                  <SelectItem key={contractor.id} value={contractor.id}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Получатель *</Label>
            <Select
              value={formData.recipientId}
              onValueChange={(value) => setFormData({ ...formData, recipientId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите получателя" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((contractor) => (
                  <SelectItem key={contractor.id} value={contractor.id}>
                    {contractor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCost">Стоимость (₽)</Label>
            <Input
              id="totalCost"
              type="number"
              value={formData.totalCost || ""}
              onChange={(e) => setFormData({ ...formData, totalCost: Number(e.target.value) })}
              placeholder="150000"
              min={0}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipmentDate">Дата отгрузки</Label>
              <Input
                id="shipmentDate"
                type="datetime-local"
                value={formData.shipmentDate || ""}
                onChange={(e) => setFormData({ ...formData, shipmentDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Дата доставки</Label>
              <Input
                id="deliveryDate"
                type="datetime-local"
                value={formData.deliveryDate || ""}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Создать</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
