import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, OrderStatus } from "@/types/supply-chain";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentOrdersProps {
  orders: Order[];
}

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Последние заказы</CardTitle>
        <Link 
          to="/orders" 
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Все заказы
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.orderNumber}</span>
                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.sender?.name || '—'} → {order.recipient?.name || '—'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {order.totalCost.toLocaleString()} ₽
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: ru })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
