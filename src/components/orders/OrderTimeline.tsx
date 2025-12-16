import { TrackingEvent, EventType } from "@/types/supply-chain";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Package, Truck, MapPin, CheckCircle2, AlertTriangle, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  events: TrackingEvent[];
}

const eventConfig: Record<EventType, { icon: typeof Package; color: string; bgColor: string }> = {
  created: { icon: Package, color: "text-info", bgColor: "bg-info/10" },
  departed: { icon: Truck, color: "text-primary", bgColor: "bg-primary/10" },
  arrived: { icon: MapPin, color: "text-warning", bgColor: "bg-warning/10" },
  delivered: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  delayed: { icon: AlertTriangle, color: "text-destructive", bgColor: "bg-destructive/10" },
  customs: { icon: FileCheck, color: "text-muted-foreground", bgColor: "bg-muted" },
};

export function OrderTimeline({ events }: OrderTimelineProps) {
  if (!events || events.length === 0) {
    return <p className="text-muted-foreground text-center py-4">Нет событий</p>;
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-1">
      {sortedEvents.map((event, index) => {
        const config = eventConfig[event.eventType];
        const Icon = config.icon;
        const isLast = index === sortedEvents.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", config.bgColor)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border my-2" />}
            </div>
            <div className="flex-1 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="font-medium text-foreground">{event.description}</h4>
                <time className="text-sm text-muted-foreground">
                  {format(new Date(event.timestamp), 'dd MMM yyyy, HH:mm', { locale: ru })}
                </time>
              </div>
              {event.coordinates && (
                <p className="text-sm text-muted-foreground mt-1">
                  📍 {event.coordinates.lat.toFixed(4)}, {event.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
