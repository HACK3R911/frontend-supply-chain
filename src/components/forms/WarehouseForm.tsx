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
import { WarehouseType, Contractor, Warehouse } from "@/types/supply-chain";
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useCreateWarehouse, useUpdateWarehouse } from "@/hooks/use-warehouses";

const typeLabels: Record<WarehouseType, string> = {
  main: "Основной",
  transit: "Транзитный",
  distribution: "Распределительный",
};

interface WarehouseFormProps {
  contractors: Contractor[];
  warehouse?: Warehouse;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export interface WarehouseFormData {
  name: string;
  address: string;
  type: WarehouseType;
  contactPersonId?: string;
}

export function WarehouseForm({ contractors, warehouse, open: controlledOpen, onOpenChange, trigger }: WarehouseFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const isEditMode = !!warehouse;

  const [formData, setFormData] = useState<WarehouseFormData>({
    name: "",
    address: "",
    type: "main",
    contactPersonId: undefined,
  });

  useEffect(() => {
    if (warehouse && open) {
      setFormData({
        name: warehouse.name,
        address: warehouse.address,
        type: warehouse.type,
        contactPersonId: warehouse.contactPersonId,
      });
    } else if (!open) {
      setFormData({ name: "", address: "", type: "main", contactPersonId: undefined });
    }
  }, [warehouse, open]);

  const createWarehouse = useCreateWarehouse();
  const updateWarehouse = useUpdateWarehouse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    try {
      if (isEditMode && warehouse) {
        await updateWarehouse.mutateAsync({
          id: warehouse.id,
          name: formData.name,
          address: formData.address,
          type: formData.type,
          contactPersonId: formData.contactPersonId,
        });
      } else {
        await createWarehouse.mutateAsync({
          name: formData.name,
          address: formData.address,
          type: formData.type,
          contactPersonId: formData.contactPersonId,
        });
      }
      setOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isPending = createWarehouse.isPending || updateWarehouse.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ?? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить склад
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode && <Pencil className="h-4 w-4" />}
            {isEditMode ? "Редактирование склада" : "Новый склад"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditMode && (
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={warehouse?.id} disabled className="bg-muted" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Название *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Склад А (Москва)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Тип склада *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: WarehouseType) => setFormData({ ...formData, type: value })}
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

          <div className="space-y-2">
            <Label htmlFor="address">Адрес *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="г. Москва, ул. Складская, д. 1"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Ответственное лицо</Label>
            <Select
              value={formData.contactPersonId || "none"}
              onValueChange={(value) => setFormData({ ...formData, contactPersonId: value === "none" ? undefined : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите контрагента" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не указано</SelectItem>
                {contractors.map((contractor) => (
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
