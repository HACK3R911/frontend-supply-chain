import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteSegment } from "@/types/supply-chain";
import { Truck, Ship, Plane, Train, CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteMapProps {
  segments: RouteSegment[];
}

const transportIcons = {
  truck: Truck,
  ship: Ship,
  plane: Plane,
  train: Train,
};

const statusStyles = {
  completed: {
    line: "bg-success",
    dot: "border-success bg-success",
    icon: CheckCircle2,
    iconColor: "text-success",
  },
  active: {
    line: "bg-primary animate-pulse",
    dot: "border-primary bg-primary",
    icon: Circle,
    iconColor: "text-primary",
  },
  pending: {
    line: "bg-border",
    dot: "border-muted-foreground bg-background",
    icon: Clock,
    iconColor: "text-muted-foreground",
  },
};

export function RouteMap({ segments }: RouteMapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Маршрут доставки</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {segments.map((segment, index) => {
            const TransportIcon = transportIcons[segment.transportType];
            const StatusIcon = statusStyles[segment.status].icon;
            const isLast = index === segments.length - 1;

            return (
              <div key={segment.id} className="flex items-start gap-4 pb-8 last:pb-0">
                {/* Status indicator */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "h-4 w-4 rounded-full border-2",
                    statusStyles[segment.status].dot
                  )} />
                  {!isLast && (
                    <div className={cn(
                      "w-0.5 flex-1 min-h-[60px]",
                      statusStyles[segment.status].line
                    )} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 -mt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{segment.from}</span>
                    <StatusIcon className={cn("h-4 w-4", statusStyles[segment.status].iconColor)} />
                  </div>
                  
                  {!isLast && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <TransportIcon className="h-4 w-4" />
                      <span>→ {segment.to}</span>
                    </div>
                  )}
                  
                  {segment.status === 'completed' && segment.endTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Завершено
                    </p>
                  )}
                  {segment.status === 'active' && (
                    <p className="text-xs text-primary mt-1 flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      В процессе
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Final destination */}
          {segments.length > 0 && (
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "h-4 w-4 rounded-full border-2",
                  segments[segments.length - 1].status === 'completed' 
                    ? "border-success bg-success" 
                    : "border-muted-foreground bg-background"
                )} />
              </div>
              <div className="flex-1 -mt-1">
                <span className="font-medium text-foreground">
                  {segments[segments.length - 1].to}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
