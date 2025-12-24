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
import { TransportType, Contractor, Transport } from "@/types/supply-chain";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useCreateTransport, useUpdateTransport } from "@/hooks/use-transport";

const typeLabels: Record<TransportType, string> = {
  truck: "Грузовик",
  ship: "Корабль",
  plane: "Самолёт",
  train: "Поезд",
};

interface TransportFormProps {
  contractors: Contractor[];
  transport?: Transport;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export interface TransportFormData {
  regNumber: string;
  type: TransportType;
  capacity: number;
  contractorId?: string;
}

export function TransportForm({ contractors, transport, open: controlledOpen, onOpenChange, trigger }: TransportFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const isEditMode = !!transport;

  const [formData, setFormData] = useState<TransportFormData>({
    regNumber: "",
    type: "truck",
    capacity: 0,
    contractorId: undefined,
  });

  useEffect(() => {
    if (transport && open) {
      setFormData({
        regNumber: transport.regNumber,
        type: transport.type,
        capacity: transport.capacity,
        contractorId: transport.contractorId,
      });
    } else if (!open) {
      setFormData({ regNumber: "", type: "truck", capacity: 0, contractorId: undefined });
    }
  }, [transport, open]);

  const createTransport = useCreateTransport();
  const updateTransport = useUpdateTransport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.regNumber || formData.capacity <= 0) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    try {
      if (isEditMode && transport) {
        await updateTransport.mutateAsync({
          regNumber: transport.regNumber,
          type: formData.type,
          capacity: formData.capacity,
          contractorId: formData.contractorId,
        });
      } else {
        await createTransport.mutateAsync({
          regNumber: formData.regNumber,
          type: formData.type,
          capacity: formData.capacity,
          contractorId: formData.contractorId,
        });
      }
      setOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isPending = createTransport.isPending || updateTransport.isPending;
  const carriers = contractors.filter(c => c.type === 'carrier');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ?? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить транспорт
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode && <Pencil className="h-4 w-4" />}
            {isEditMode ? "Редактирование транспорта" : "Новое транспортное средство"}
          </DialogTitle>
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
                disabled={isEditMode}
                className={isEditMode ? "bg-muted" : ""}
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
