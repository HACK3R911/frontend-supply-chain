import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWarehouses } from "@/hooks/use-warehouses";
import { useContractors } from "@/hooks/use-contractors";
import { WarehouseType } from "@/types/supply-chain";
import { WarehouseForm } from "@/components/forms/WarehouseForm";
import { Search, Warehouse, MapPin, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const typeConfig: Record<WarehouseType, { label: string; variant: "default" | "secondary" | "outline" }> = {
  main: { label: "Основной", variant: "default" },
  transit: { label: "Транзитный", variant: "secondary" },
  distribution: { label: "Распределительный", variant: "outline" },
};

const Warehouses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses();
  const { data: contractors, isLoading: contractorsLoading } = useContractors();

  const filteredWarehouses = (warehouses ?? []).filter((warehouse) => {
    const matchesSearch =
      warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      warehouse.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || warehouse.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getContactPerson = (contactPersonId?: string) => {
    if (!contactPersonId) return null;
    return contractors?.find(c => c.id === contactPersonId);
  };

  if (warehousesLoading || contractorsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Склады</h1>
            <p className="text-muted-foreground">Точки хранения и перевалки грузов</p>
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Склады</h1>
          <p className="text-muted-foreground">Точки хранения и перевалки грузов</p>
        </div>
        <WarehouseForm contractors={contractors ?? []} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, адресу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип склада" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="main">Основной</SelectItem>
            <SelectItem value="transit">Транзитный</SelectItem>
            <SelectItem value="distribution">Распределительный</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => {
          const contactPerson = getContactPerson(warehouse.contactPersonId);
          return (
            <Card key={warehouse.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-primary" />
                      {warehouse.name}
                    </CardTitle>
                  </div>
                  <Badge variant={typeConfig[warehouse.type].variant}>
                    {typeConfig[warehouse.type].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{warehouse.address}</span>
                </div>
                {contactPerson && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{contactPerson.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredWarehouses.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Склады не найдены
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehouses;
