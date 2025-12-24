import { useState, useEffect } from "react";
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
import { CargoStatus, Order, Cargo } from "@/types/supply-chain";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useCreateCargo, useUpdateCargo } from "@/hooks/use-cargos";

const statusLabels: Record<CargoStatus, string> = {
  at_warehouse: "На складе",
  in_transit: "В пути",
  delivered: "Доставлен",
  delayed: "Задержка",
};

interface CargoFormProps {
  orders: Order[];
  cargo?: Cargo;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export interface CargoFormData {
  cargoId: string;
  orderId: string;
  weight: number;
  volume: number;
  description: string;
  currentStatus: CargoStatus;
}

export function CargoForm({ orders, cargo, open: controlledOpen, onOpenChange, trigger }: CargoFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const isEditMode = !!cargo;

  const [formData, setFormData] = useState<CargoFormData>({
    cargoId: "",
    orderId: "",
    weight: 0,
    volume: 0,
    description: "",
    currentStatus: "at_warehouse",
  });

  useEffect(() => {
    if (cargo && open) {
      setFormData({
        cargoId: cargo.cargoId,
        orderId: cargo.orderId,
        weight: cargo.weight,
        volume: cargo.volume,
        description: cargo.description,
        currentStatus: cargo.currentStatus,
      });
    } else if (!open) {
      setFormData({
        cargoId: "",
        orderId: "",
        weight: 0,
        volume: 0,
        description: "",
        currentStatus: "at_warehouse",
      });
    }
  }, [cargo, open]);

  const createCargo = useCreateCargo();
  const updateCargo = useUpdateCargo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cargoId || !formData.orderId || !formData.description) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (formData.weight <= 0 || formData.volume <= 0) {
      toast.error("Вес и объём должны быть больше 0");
      return;
    }

    try {
      if (isEditMode && cargo) {
        await updateCargo.mutateAsync({
          id: cargo.id,
          orderId: formData.orderId,
          weight: formData.weight,
          volume: formData.volume,
          description: formData.description,
          currentStatus: formData.currentStatus,
        });
      } else {
        await createCargo.mutateAsync({
          cargoId: formData.cargoId,
          orderId: formData.orderId,
          weight: formData.weight,
          volume: formData.volume,
          description: formData.description,
          currentStatus: formData.currentStatus,
        });
      }
      setOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isPending = createCargo.isPending || updateCargo.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ?? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить груз
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode && <Pencil className="h-4 w-4" />}
            {isEditMode ? "Редактирование груза" : "Новый груз"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditMode && (
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={cargo?.id} disabled className="bg-muted" />
            </div>
          )}

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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
