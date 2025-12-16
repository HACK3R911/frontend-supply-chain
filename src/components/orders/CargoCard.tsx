import { Cargo, CargoStatus } from "@/types/supply-chain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Scale, Box } from "lucide-react";

interface CargoCardProps {
  cargo: Cargo;
  onClick?: () => void;
  isSelected?: boolean;
}

const statusConfig: Record<CargoStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  at_warehouse: { label: "На складе", variant: "secondary" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  delayed: { label: "Задержка", variant: "destructive" },
};

export function CargoCard({ cargo, onClick, isSelected }: CargoCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              {cargo.trackingNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {cargo.description}
            </p>
          </div>
          <Badge variant={statusConfig[cargo.status].variant}>
            {statusConfig[cargo.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-sm">
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
            <span>{cargo.volume} м³</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
