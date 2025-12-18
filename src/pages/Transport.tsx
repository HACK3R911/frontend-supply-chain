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
import { useTransport } from "@/hooks/use-transport";
import { useContractors } from "@/hooks/use-contractors";
import { TransportType } from "@/types/supply-chain";
import { TransportForm } from "@/components/forms/TransportForm";
import { Search, Truck, Ship, Plane, Train, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const typeConfig: Record<TransportType, { label: string; icon: typeof Truck; variant: "default" | "secondary" | "outline" }> = {
  truck: { label: "Грузовик", icon: Truck, variant: "default" },
  ship: { label: "Корабль", icon: Ship, variant: "secondary" },
  plane: { label: "Самолёт", icon: Plane, variant: "outline" },
  train: { label: "Поезд", icon: Train, variant: "secondary" },
};

const Transport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: transport, isLoading: transportLoading } = useTransport();
  const { data: contractors, isLoading: contractorsLoading } = useContractors();

  const filteredTransport = (transport ?? []).filter((t) => {
    const matchesSearch = t.regNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getContractor = (contractorId?: string) => {
    if (!contractorId) return null;
    return contractors?.find(c => c.id === contractorId);
  };

  if (transportLoading || contractorsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Транспорт</h1>
            <p className="text-muted-foreground">Транспортные средства для перевозки грузов</p>
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
          <h1 className="text-2xl font-bold text-foreground">Транспорт</h1>
          <p className="text-muted-foreground">Транспортные средства для перевозки грузов</p>
        </div>
        <TransportForm contractors={contractors ?? []} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по рег. номеру..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Тип транспорта" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="truck">Грузовик</SelectItem>
            <SelectItem value="ship">Корабль</SelectItem>
            <SelectItem value="plane">Самолёт</SelectItem>
            <SelectItem value="train">Поезд</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Рег. номер</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Грузоподъёмность</TableHead>
              <TableHead>Перевозчик</TableHead>
              <TableHead>Координаты</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransport.map((t) => {
              const contractor = getContractor(t.contractorId);
              const TypeIcon = typeConfig[t.type].icon;
              return (
                <TableRow key={t.regNumber}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium font-mono">{t.regNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={typeConfig[t.type].variant}>
                      {typeConfig[t.type].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{t.capacity.toLocaleString()} кг</TableCell>
                  <TableCell>{contractor?.name || "—"}</TableCell>
                  <TableCell>
                    {t.coordinates ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{t.coordinates.lat.toFixed(4)}, {t.coordinates.lng.toFixed(4)}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredTransport.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Транспорт не найден
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transport;
