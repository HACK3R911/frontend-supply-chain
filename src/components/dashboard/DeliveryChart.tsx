import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'Пн', deliveries: 12, orders: 15 },
  { name: 'Вт', deliveries: 19, orders: 22 },
  { name: 'Ср', deliveries: 15, orders: 18 },
  { name: 'Чт', deliveries: 22, orders: 25 },
  { name: 'Пт', deliveries: 28, orders: 30 },
  { name: 'Сб', deliveries: 18, orders: 20 },
  { name: 'Вс', deliveries: 8, orders: 10 },
];

export function DeliveryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Динамика доставок</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--chart-2))" 
                fillOpacity={1} 
                fill="url(#colorOrders)"
                name="Заказы"
              />
              <Area 
                type="monotone" 
                dataKey="deliveries" 
                stroke="hsl(var(--chart-1))" 
                fillOpacity={1} 
                fill="url(#colorDeliveries)"
                name="Доставки"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
