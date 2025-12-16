import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCargos } from "@/data/mock-data";
import { MapPin, Truck, Package } from "lucide-react";

const Map = () => {
  // Get unique locations from cargos
  const locations = mockCargos.map((cargo) => ({
    name: cargo.currentLocation,
    cargo: cargo,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Карта грузов</h1>
        <p className="text-muted-foreground">Визуализация текущего расположения грузов</p>
      </div>

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-[400px] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Интерактивная карта</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                  Для отображения интерактивной карты подключите Mapbox или другой картографический сервис
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 left-8 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <div className="absolute top-16 right-24 animate-pulse delay-100">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="absolute bottom-20 left-32 animate-pulse delay-200">
              <div className="w-3 h-3 rounded-full bg-warning" />
            </div>
            <div className="absolute bottom-12 right-16 animate-pulse delay-300">
              <div className="w-3 h-3 rounded-full bg-info" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {loc.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{loc.cargo.trackingNumber}</span>
                </div>
                <Badge variant={loc.cargo.status === 'in_transit' ? 'default' : 'secondary'}>
                  {loc.cargo.status === 'in_transit' ? (
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      В пути
                    </span>
                  ) : (
                    'На месте'
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Map;
