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
import { ContractorRole } from "@/types/supply-chain";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const roleLabels: Record<ContractorRole, string> = {
  supplier: "Поставщик",
  carrier: "Перевозчик",
  client: "Клиент",
};

interface ContractorFormProps {
  onSubmit?: (data: ContractorFormData) => void;
}

export interface ContractorFormData {
  name: string;
  inn: string;
  legalAddress: string;
  contacts: string;
  role: ContractorRole;
}

export function ContractorForm({ onSubmit }: ContractorFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ContractorFormData>({
    name: "",
    inn: "",
    legalAddress: "",
    contacts: "",
    role: "client",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.inn || !formData.legalAddress) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    if (formData.inn.length !== 10 && formData.inn.length !== 12) {
      toast.error("ИНН должен содержать 10 или 12 цифр");
      return;
    }

    onSubmit?.(formData);
    toast.success("Контрагент успешно добавлен");
    setOpen(false);
    setFormData({ name: "", inn: "", legalAddress: "", contacts: "", role: "client" });
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inn">ИНН *</Label>
              <Input
                id="inn"
                value={formData.inn}
                onChange={(e) => setFormData({ ...formData, inn: e.target.value.replace(/\D/g, '') })}
                placeholder="1234567890"
                maxLength={12}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Роль *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: ContractorRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legalAddress">Юридический адрес *</Label>
            <Textarea
              id="legalAddress"
              value={formData.legalAddress}
              onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
              placeholder="г. Москва, ул. Примерная, д. 1"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contacts">Контакты</Label>
            <Textarea
              id="contacts"
              value={formData.contacts}
              onChange={(e) => setFormData({ ...formData, contacts: e.target.value })}
              placeholder="+7 (999) 123-45-67, email@example.com"
              rows={2}
            />
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
