import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCargos } from "@/hooks/use-cargos";
import { useTransport } from "@/hooks/use-transport";
import { CargoStatus, TransportType } from "@/types/supply-chain";
import { MapPin, Truck, Package, Ship, Plane, Train } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig: Record<CargoStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  at_warehouse: { label: "На складе", variant: "secondary" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  delayed: { label: "Задержка", variant: "destructive" },
};

const transportIcons: Record<TransportType, typeof Truck> = { truck: Truck, ship: Ship, plane: Plane, train: Train };

const Map = () => {
  const { data: cargos, isLoading: cargosLoading } = useCargos();
  const { data: transport, isLoading: transportLoading } = useTransport();

  if (cargosLoading || transportLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Карта грузов</h1>
          <p className="text-muted-foreground">Визуализация текущего расположения</p>
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const activeCargos = (cargos ?? []).filter(c => c.currentStatus === 'in_transit');
  const activeTransport = (transport ?? []).filter(t => t.coordinates);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Карта грузов</h1>
        <p className="text-muted-foreground">Визуализация текущего расположения</p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-[400px] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Интерактивная карта</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">Для отображения подключите Mapbox или Google Maps</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeCargos.map((cargo) => (
          <Card key={cargo.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                {cargo.cargoId}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground truncate">{cargo.description}</span>
                <Badge variant={statusConfig[cargo.currentStatus].variant}>
                  {statusConfig[cargo.currentStatus].label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {activeTransport.map((t) => {
          const Icon = transportIcons[t.type];
          return (
            <Card key={t.regNumber} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  {t.regNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground">
                📍 {t.coordinates?.lat.toFixed(4)}, {t.coordinates?.lng.toFixed(4)}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Map;
