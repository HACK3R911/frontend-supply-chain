import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { CargoCard } from "@/components/orders/CargoCard";
import { AddEventDialog } from "@/components/orders/AddEventDialog";
import { RouteMap } from "@/components/orders/RouteMap";
import { mockOrders, mockRouteSegments } from "@/data/mock-data";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  Scale, 
  Box,
  User
} from "lucide-react";
import { OrderStatus } from "@/types/supply-chain";

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedCargoId, setSelectedCargoId] = useState<string | null>(null);
  
  const order = mockOrders.find((o) => o.id === id);
  
  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground">Заказ не найден</h2>
          <p className="text-muted-foreground mt-2">Заказ с указанным ID не существует</p>
          <Button asChild className="mt-4">
            <Link to="/orders">Вернуться к списку заказов</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectedCargo = selectedCargoId 
    ? order.cargos.find((c) => c.id === selectedCargoId) 
    : order.cargos[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/orders" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к заказам
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{order.orderNumber}</h1>
            <Badge variant={statusConfig[order.status].variant} className="text-sm">
              {statusConfig[order.status].label}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {order.origin} → {order.destination}
          </p>
        </div>
      </div>

      {/* Order Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Клиент</p>
                <p className="font-medium">{order.customer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <Building2 className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Подрядчик</p>
                <p className="font-medium">{order.contractor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Scale className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Общий вес</p>
                <p className="font-medium">{order.totalWeight.toLocaleString()} кг</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ожидаемая доставка</p>
                <p className="font-medium">
                  {format(new Date(order.estimatedDelivery), 'dd MMM yyyy', { locale: ru })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Route and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <RouteMap segments={mockRouteSegments} />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">История событий</CardTitle>
              {selectedCargo && (
                <AddEventDialog cargoId={selectedCargo.id} />
              )}
            </CardHeader>
            <CardContent>
              {selectedCargo ? (
                <OrderTimeline events={selectedCargo.events} />
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Выберите груз для просмотра истории событий
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Cargos */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Box className="h-5 w-5" />
                Грузы ({order.cargos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.cargos.length > 0 ? (
                order.cargos.map((cargo) => (
                  <CargoCard
                    key={cargo.id}
                    cargo={cargo}
                    isSelected={selectedCargo?.id === cargo.id}
                    onClick={() => setSelectedCargoId(cargo.id)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Нет грузов в заказе
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
