import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { mockOrders } from "@/data/mock-data";
import { Plus } from "lucide-react";

const Orders = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Заказы</h1>
          <p className="text-muted-foreground">Управление и отслеживание всех заказов</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Новый заказ
        </Button>
      </div>

      {/* Orders Table */}
      <OrdersTable orders={mockOrders} />
    </div>
  );
};

export default Orders;
