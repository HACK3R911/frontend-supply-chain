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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateContractor } from "@/hooks/use-contractors";

const typeLabels: Record<string, string> = {
  supplier: "Поставщик",
  carrier: "Перевозчик",
  client: "Клиент",
};

interface ContractorFormProps {
  onSubmit?: (data: ContractorFormData) => void;
}

export interface ContractorFormData {
  name: string;
  type: string;
  contact: string;
}

export function ContractorForm({ onSubmit }: ContractorFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ContractorFormData>({
    name: "",
    type: "client",
    contact: "",
  });

  const createContractor = useCreateContractor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    try {
      await createContractor.mutateAsync({
        name: formData.name,
        type: formData.type,
        contact: formData.contact,
      });
      onSubmit?.(formData);
      setOpen(false);
      setFormData({ name: "", type: "client", contact: "" });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить контрагента
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Новый контрагент</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Наименование *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder='ООО "Компания"'
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Тип *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
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
            <Label htmlFor="contact">Контакты</Label>
            <Textarea
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="+7 (999) 123-45-67, email@example.com"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={createContractor.isPending}>
              {createContractor.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
