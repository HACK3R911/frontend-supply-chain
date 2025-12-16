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
import { WarehouseType, Contractor } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const typeLabels: Record<WarehouseType, string> = {
  main: "Основной",
  transit: "Транзитный",
  distribution: "Распределительный",
};

interface WarehouseFormProps {
  contractors: Contractor[];
  onSubmit?: (data: WarehouseFormData) => void;
}

export interface WarehouseFormData {
  name: string;
  address: string;
  type: WarehouseType;
  contactPersonId?: string;
}

export function WarehouseForm({ contractors, onSubmit }: WarehouseFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: "",
    address: "",
    type: "main",
    contactPersonId: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    onSubmit?.(formData);
    toast.success("Склад успешно добавлен");
    setOpen(false);
    setFormData({ name: "", address: "", type: "main", contactPersonId: undefined });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить склад
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новый склад</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  <SelectItem key={contractor.id} value={contractor.id}>
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
