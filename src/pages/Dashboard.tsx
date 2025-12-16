import { Package, Truck, CheckCircle2, Clock, TrendingUp, Box } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { DeliveryChart } from "@/components/dashboard/DeliveryChart";
import { mockOrders, dashboardStats } from "@/data/mock-data";

const Dashboard = () => {
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
          value={dashboardStats.activeOrders}
          icon={Package}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="В пути"
          value={dashboardStats.inTransit}
          icon={Truck}
          variant="info"
          subtitle="грузов сейчас"
        />
        <KPICard
          title="Доставлено"
          value={dashboardStats.delivered}
          icon={CheckCircle2}
          variant="success"
          subtitle="за этот месяц"
        />
        <KPICard
          title="Среднее время"
          value={`${dashboardStats.averageDeliveryTime} дн.`}
          icon={Clock}
          variant="warning"
          subtitle="доставки"
        />
        <KPICard
          title="Вовремя"
          value={`${dashboardStats.onTimeDeliveryRate}%`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 2.5, isPositive: true }}
        />
        <KPICard
          title="Всего грузов"
          value={dashboardStats.totalCargos}
          icon={Box}
          variant="default"
          subtitle="в системе"
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryChart />
        <RecentOrders orders={mockOrders} />
      </div>
    </div>
  );
};

export default Dashboard;
