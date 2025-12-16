import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderForm } from "@/components/forms/OrderForm";
import { mockOrders, mockContractors } from "@/data/mock-data";

const Orders = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Заказы</h1>
          <p className="text-muted-foreground">Управление и отслеживание всех заказов</p>
        </div>
        <OrderForm contractors={mockContractors} />
      </div>

      {/* Orders Table */}
      <OrdersTable orders={mockOrders} />
    </div>
  );
};

export default Orders;
