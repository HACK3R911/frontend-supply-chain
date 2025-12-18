import { Package, Truck, CheckCircle2, Clock, TrendingUp, Box } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { DeliveryChart } from "@/components/dashboard/DeliveryChart";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { useOrders } from "@/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (statsLoading || ordersLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Панель управления</h1>
          <p className="text-muted-foreground">Обзор ключевых показателей цепочки поставок</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[300px] rounded-lg" />
          <Skeleton className="h-[300px] rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Панель управления</h1>
        <p className="text-muted-foreground">Обзор ключевых показателей цепочки поставок</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KPICard
          title="Активные заказы"
          value={stats?.activeOrders ?? 0}
          icon={Package}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="В пути"
          value={stats?.inTransit ?? 0}
          icon={Truck}
          variant="info"
          subtitle="грузов сейчас"
        />
        <KPICard
          title="Доставлено"
          value={stats?.delivered ?? 0}
          icon={CheckCircle2}
          variant="success"
          subtitle="за этот месяц"
        />
        <KPICard
          title="Среднее время"
          value={`${stats?.averageDeliveryTime ?? 0} дн.`}
          icon={Clock}
          variant="warning"
          subtitle="доставки"
        />
        <KPICard
          title="Вовремя"
          value={`${stats?.onTimeDeliveryRate ?? 0}%`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 2.5, isPositive: true }}
        />
        <KPICard
          title="Всего грузов"
          value={stats?.totalCargos ?? 0}
          icon={Box}
          variant="default"
          subtitle="в системе"
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryChart />
        <RecentOrders orders={orders ?? []} />
      </div>
    </div>
  );
};

export default Dashboard;
