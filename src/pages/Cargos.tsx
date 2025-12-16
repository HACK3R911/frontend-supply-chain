import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockCargos } from "@/data/mock-data";
import { CargoStatus } from "@/types/supply-chain";
import { useState } from "react";
import { Search, Package, MapPin, Scale, Box } from "lucide-react";

const statusConfig: Record<CargoStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  at_warehouse: { label: "На складе", variant: "secondary" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  delayed: { label: "Задержка", variant: "destructive" },
};

const Cargos = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCargos = mockCargos.filter(
    (cargo) =>
      cargo.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cargo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cargo.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Грузы</h1>
        <p className="text-muted-foreground">Отслеживание всех грузов в системе</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Поиск по номеру, описанию, локации..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Cargo Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCargos.map((cargo) => (
          <Card key={cargo.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    {cargo.trackingNumber}
                  </CardTitle>
                </div>
                <Badge variant={statusConfig[cargo.status].variant}>
                  {statusConfig[cargo.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground">{cargo.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{cargo.currentLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span>{cargo.weight} кг</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                  <Box className="h-4 w-4" />
                  <span>{cargo.volume} м³ • {cargo.events.length} событий</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredCargos.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Грузы не найдены
          </div>
        )}
      </div>
    </div>
  );
};

export default Cargos;
