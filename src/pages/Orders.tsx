import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderForm } from "@/components/forms/OrderForm";
import { useOrders } from "@/hooks/use-orders";
import { useContractors } from "@/hooks/use-contractors";
import { Skeleton } from "@/components/ui/skeleton";

const Orders = () => {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: contractors, isLoading: contractorsLoading } = useContractors();

  if (ordersLoading || contractorsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Заказы</h1>
            <p className="text-muted-foreground">Управление и отслеживание всех заказов</p>
          </div>
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Заказы</h1>
          <p className="text-muted-foreground">Управление и отслеживание всех заказов</p>
        </div>
        <OrderForm contractors={contractors ?? []} />
      </div>
      <OrdersTable orders={orders ?? []} contractors={contractors ?? []} />
    </div>
  );
};

export default Orders;
