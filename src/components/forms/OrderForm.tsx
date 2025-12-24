import { useState, useEffect } from "react";
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
import { OrderStatus, Contractor, Order } from "@/types/supply-chain";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useCreateOrder, useUpdateOrder } from "@/hooks/use-orders";

const statusLabels: Record<OrderStatus, string> = {
  pending: "Ожидает",
  in_transit: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

interface OrderFormProps {
  contractors: Contractor[];
  order?: Order;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
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

export function OrderForm({ contractors, order, open: controlledOpen, onOpenChange, trigger }: OrderFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const isEditMode = !!order;

  const [formData, setFormData] = useState<OrderFormData>({
    orderNumber: "",
    totalCost: 0,
    status: "pending",
    senderId: "",
    recipientId: "",
  });

  useEffect(() => {
    if (order && open) {
      setFormData({
        orderNumber: order.orderNumber,
        totalCost: order.totalCost,
        status: order.status,
        senderId: order.sender?.id ? String(order.sender.id) : "",
        recipientId: order.recipient?.id ? String(order.recipient.id) : "",
        shipmentDate: order.shipmentDate ? new Date(order.shipmentDate).toISOString().slice(0, 16) : undefined,
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().slice(0, 16) : undefined,
      });
    } else if (!open) {
      setFormData({
        orderNumber: "",
        totalCost: 0,
        status: "pending",
        senderId: "",
        recipientId: "",
      });
    }
  }, [order, open]);

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.orderNumber || !formData.senderId || !formData.recipientId) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (formData.senderId === formData.recipientId) {
      toast.error("Отправитель и получатель должны быть разными");
      return;
    }

    try {
      if (isEditMode && order) {
        await updateOrder.mutateAsync({
          id: order.id,
          totalCost: formData.totalCost,
          status: formData.status,
          senderId: formData.senderId,
          recipientId: formData.recipientId,
          shipmentDate: formData.shipmentDate,
          deliveryDate: formData.deliveryDate,
        });
      } else {
        await createOrder.mutateAsync({
          orderNumber: formData.orderNumber,
          totalCost: formData.totalCost,
          status: formData.status,
          senderId: formData.senderId,
          recipientId: formData.recipientId,
          shipmentDate: formData.shipmentDate,
          deliveryDate: formData.deliveryDate,
        });
      }
      setOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isPending = createOrder.isPending || updateOrder.isPending;
  const suppliers = contractors.filter(c => c.type === 'supplier');
  const clients = contractors.filter(c => c.type === 'client');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ?? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Новый заказ
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode && <Pencil className="h-4 w-4" />}
            {isEditMode ? "Редактирование заказа" : "Новый заказ"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditMode && (
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={order?.id} disabled className="bg-muted" />
            </div>
          )}

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
                  <SelectItem key={contractor.id} value={String(contractor.id)}>
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
                  <SelectItem key={contractor.id} value={String(contractor.id)}>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
