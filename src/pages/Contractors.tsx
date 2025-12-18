import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContractors } from "@/hooks/use-contractors";
import { ContractorRole } from "@/types/supply-chain";
import { ContractorForm } from "@/components/forms/ContractorForm";
import { Search, Building2, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const roleConfig: Record<ContractorRole, { label: string; variant: "default" | "secondary" | "outline" }> = {
  supplier: { label: "Поставщик", variant: "default" },
  carrier: { label: "Перевозчик", variant: "secondary" },
  client: { label: "Клиент", variant: "outline" },
};

const Contractors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  const { data: contractors, isLoading } = useContractors();

  const filteredContractors = (contractors ?? []).filter((contractor) => {
    const matchesSearch =
      contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor.inn.includes(searchQuery) ||
      contractor.legalAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || contractor.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Контрагенты</h1>
            <p className="text-muted-foreground">Управление поставщиками, перевозчиками и клиентами</p>
          </div>
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Контрагенты</h1>
          <p className="text-muted-foreground">Управление поставщиками, перевозчиками и клиентами</p>
        </div>
        <ContractorForm />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, ИНН, адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="supplier">Поставщик</SelectItem>
            <SelectItem value="carrier">Перевозчик</SelectItem>
            <SelectItem value="client">Клиент</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Наименование</TableHead>
              <TableHead>ИНН</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Адрес</TableHead>
              <TableHead>Контакты</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{contractor.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{contractor.inn}</TableCell>
                <TableCell>
                  <Badge variant={roleConfig[contractor.role].variant}>
                    {roleConfig[contractor.role].label}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{contractor.legalAddress}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">{contractor.contacts}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredContractors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Контрагенты не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Contractors;
