import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { CargoCard } from "@/components/orders/CargoCard";
import { AddEventDialog } from "@/components/orders/AddEventDialog";
import { RouteMap } from "@/components/orders/RouteMap";
import { mockOrders, mockCargos, mockRouteLegs, mockRouteSegments } from "@/data/mock-data";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowLeft, Calendar, Building2, DollarSign, Box, User } from "lucide-react";
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
      <div className="p-6 text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">Заказ не найден</h2>
        <Button asChild className="mt-4"><Link to="/orders">Вернуться</Link></Button>
      </div>
    );
  }

  const orderCargos = mockCargos.filter(c => c.orderId === order.id);
  const selectedCargo = selectedCargoId ? orderCargos.find((c) => c.id === selectedCargoId) : orderCargos[0];
  const cargoEvents = selectedCargo ? mockRouteLegs.filter(rl => rl.cargoId === selectedCargo.id).flatMap(rl => rl.events || []) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link to="/orders" className="gap-2"><ArrowLeft className="h-4 w-4" />Назад</Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{order.orderNumber}</h1>
            <Badge variant={statusConfig[order.status].variant}>{statusConfig[order.status].label}</Badge>
          </div>
          <p className="text-muted-foreground">{order.sender?.name} → {order.recipient?.name}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><User className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Отправитель</p><p className="font-medium">{order.sender?.name || '—'}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-info/10 p-2"><Building2 className="h-5 w-5 text-info" /></div><div><p className="text-sm text-muted-foreground">Получатель</p><p className="font-medium">{order.recipient?.name || '—'}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><DollarSign className="h-5 w-5 text-warning" /></div><div><p className="text-sm text-muted-foreground">Стоимость</p><p className="font-medium">{order.totalCost.toLocaleString()} ₽</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><Calendar className="h-5 w-5 text-success" /></div><div><p className="text-sm text-muted-foreground">Дата доставки</p><p className="font-medium">{order.deliveryDate ? format(new Date(order.deliveryDate), 'dd MMM yyyy', { locale: ru }) : 'Не указана'}</p></div></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RouteMap segments={mockRouteSegments} />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">История событий</CardTitle>
              {selectedCargo && <AddEventDialog cargoId={selectedCargo.id} />}
            </CardHeader>
            <CardContent><OrderTimeline events={cargoEvents} /></CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><Box className="h-5 w-5" />Грузы ({orderCargos.length})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {orderCargos.length > 0 ? orderCargos.map((cargo) => (
                <CargoCard key={cargo.id} cargo={cargo} isSelected={selectedCargo?.id === cargo.id} onClick={() => setSelectedCargoId(cargo.id)} />
              )) : <p className="text-muted-foreground text-center py-4">Нет грузов</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
