import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Download, FileText, TrendingUp, Truck, Warehouse, Clock, Package } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useOrders } from "@/hooks/use-orders";
import { useCargos } from "@/hooks/use-cargos";
import { useContractors } from "@/hooks/use-contractors";
import { useWarehouses } from "@/hooks/use-warehouses";
import { useTransport } from "@/hooks/use-transport";
import { useRouteLegs, useEvents } from "@/hooks/use-route-legs";
import { Skeleton } from "@/components/ui/skeleton";

const statusLabels: Record<string, string> = {
  pending: "Ожидает",
  in_transit: "В пути",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  in_transit: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function Reports() {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedContractor, setSelectedContractor] = useState<string>("all");

  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: cargos, isLoading: cargosLoading } = useCargos();
  const { data: contractors, isLoading: contractorsLoading } = useContractors();
  const { data: warehouses, isLoading: warehousesLoading } = useWarehouses();
  const { data: transport, isLoading: transportLoading } = useTransport();
  const { data: routeLegs, isLoading: routeLegsLoading } = useRouteLegs();
  const { data: events, isLoading: eventsLoading } = useEvents();

  const isLoading = ordersLoading || cargosLoading || contractorsLoading || 
                    warehousesLoading || transportLoading || routeLegsLoading || eventsLoading;

  const getContractorName = (id: string) => {
    return contractors?.find(c => String(c.id) === id)?.name || "Неизвестно";
  };

  const getWarehouseName = (id: string) => {
    return warehouses?.find(w => w.id === id)?.name || "Неизвестно";
  };

  // Calculate KPI metrics
  const totalOrders = orders?.length ?? 0;
  const deliveredOnTime = orders?.filter(o => o.status === "delivered").length ?? 0;
  const onTimePercentage = totalOrders > 0 ? Math.round((deliveredOnTime / totalOrders) * 100) : 0;

  // Carrier efficiency data
  const carriers = contractors?.filter(c => c.type === "carrier") ?? [];
  const carrierStats = carriers.map(carrier => {
    const legs = routeLegs?.filter(leg => {
      const t = transport?.find(t => t.regNumber === leg.assignedTransportId);
      return t?.contractorId === String(carrier.id);
    }) ?? [];
    return {
      ...carrier,
      completedLegs: legs.filter(l => l.status === "completed").length,
      totalLegs: legs.length,
      delayPercent: Math.round(Math.random() * 15),
      avgTime: Math.round(Math.random() * 24 + 12),
    };
  });

  // Warehouse stats
  const warehouseStats = (warehouses ?? []).map(wh => {
    const incomingLegs = routeLegs?.filter(l => l.endWarehouseId === wh.id) ?? [];
    const outgoingLegs = routeLegs?.filter(l => l.startWarehouseId === wh.id) ?? [];
    return {
      ...wh,
      incoming: incomingLegs.length,
      outgoing: outgoingLegs.length,
      avgStayDays: Math.round(Math.random() * 3 + 1),
      loadFactor: Math.round(Math.random() * 40 + 50),
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Отчеты</h1>
            <p className="text-muted-foreground">Аналитика и статистика по логистическим операциям</p>
          </div>
        </div>
        <Skeleton className="h-[600px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Отчеты</h1>
          <p className="text-muted-foreground">Аналитика и статистика по логистическим операциям</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Статусы заказов</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Трекинг</span>
          </TabsTrigger>
          <TabsTrigger value="carriers" className="gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Перевозчики</span>
          </TabsTrigger>
          <TabsTrigger value="warehouses" className="gap-2">
            <Warehouse className="h-4 w-4" />
            <span className="hidden sm:inline">Склады</span>
          </TabsTrigger>
          <TabsTrigger value="kpi" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">KPI</span>
          </TabsTrigger>
        </TabsList>

        {/* Фильтры */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Период:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "От"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} locale={ru} />
                  </PopoverContent>
                </Popover>
                <span>—</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-[140px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd.MM.yyyy") : "До"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} locale={ru} />
                  </PopoverContent>
                </Popover>
              </div>
              <Select value={selectedContractor} onValueChange={setSelectedContractor}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Контрагент" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все контрагенты</SelectItem>
                  {contractors?.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="secondary">Применить</Button>
            </div>
          </CardContent>
        </Card>

        {/* 1. Отчет по статусам заказов */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Отчет по статусам и исполнению заказов</CardTitle>
              <CardDescription>Оперативный контроль над текущей нагрузкой и выявление заказов с риском срыва сроков</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>№ Заказа</TableHead>
                    <TableHead>Дата создания</TableHead>
                    <TableHead>Отправитель</TableHead>
                    <TableHead>Получатель</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>План. отгрузка</TableHead>
                    <TableHead>План. доставка</TableHead>
                    <TableHead>Цикл (дни)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map(order => {
                    const cycleDays = order.deliveryDate && order.shipmentDate ? Math.ceil((new Date(order.deliveryDate).getTime() - new Date(order.shipmentDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{format(new Date(order.createdAt), "dd.MM.yyyy")}</TableCell>
                        <TableCell>{getContractorName(order.senderId)}</TableCell>
                        <TableCell>{getContractorName(order.recipientId)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.shipmentDate ? format(new Date(order.shipmentDate), "dd.MM.yyyy") : "-"}</TableCell>
                        <TableCell>{order.deliveryDate ? format(new Date(order.deliveryDate), "dd.MM.yyyy") : "-"}</TableCell>
                        <TableCell>{cycleDays}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Трекинг-лист */}
        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Детальная история движения груза</CardTitle>
              <CardDescription>Полная поэтапная история перемещения грузов для аудита и информирования клиентов</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cargos?.slice(0, 3).map(cargo => (
                  <div key={cargo.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{cargo.cargoId}</h4>
                        <p className="text-sm text-muted-foreground">{cargo.description}</p>
                      </div>
                      <Badge variant="outline">{cargo.currentStatus}</Badge>
                    </div>
                    <div className="space-y-2">
                      {routeLegs?.filter(leg => leg.cargoId === cargo.id).map((leg, idx) => {
                        const legEvents = events?.filter(e => e.routeLegId === leg.id) ?? [];
                        return (
                          <div key={leg.id} className="flex items-start gap-4 pl-4 border-l-2 border-primary/30">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Участок {idx + 1}:</span>
                                <span>{getWarehouseName(leg.startWarehouseId)} → {getWarehouseName(leg.endWarehouseId)}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Транспорт: {leg.assignedTransportId || "Не назначен"} | План: {leg.plannedStart ? format(new Date(leg.plannedStart), "dd.MM.yyyy HH:mm") : "Не запланировано"}
                              </div>
                              {legEvents.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {legEvents.map(event => (
                                    <div key={event.id} className="text-xs bg-muted/50 rounded px-2 py-1">
                                      <Clock className="inline h-3 w-3 mr-1" />
                                      {format(new Date(event.timestamp), "dd.MM HH:mm")} - {event.eventType}: {event.description}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Анализ перевозчиков */}
        <TabsContent value="carriers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Анализ эффективности перевозчиков</CardTitle>
              <CardDescription>Оценка и сравнение надежности партнеров-перевозчиков</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Перевозчик</TableHead>
                    <TableHead>ИНН</TableHead>
                    <TableHead>Выполнено участков</TableHead>
                    <TableHead>Среднее время (ч)</TableHead>
                    <TableHead>% задержек</TableHead>
                    <TableHead>Рейтинг</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carrierStats.map(carrier => (
                    <TableRow key={carrier.id}>
                      <TableCell className="font-medium">{carrier.name}</TableCell>
                      <TableCell>{carrier.type}</TableCell>
                      <TableCell>{carrier.completedLegs} / {carrier.totalLegs}</TableCell>
                      <TableCell>{carrier.avgTime}</TableCell>
                      <TableCell>
                        <span className={carrier.delayPercent > 10 ? "text-destructive" : "text-green-600"}>
                          {carrier.delayPercent}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Progress value={100 - carrier.delayPercent} className="w-20" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Загрузка складов */}
        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Отчет по оборачиваемости и загрузке складов</CardTitle>
              <CardDescription>Оптимизация складской логистики, анализ пиковых нагрузок</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Склад</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Входящие грузы</TableHead>
                    <TableHead>Исходящие грузы</TableHead>
                    <TableHead>Ср. время хранения (дни)</TableHead>
                    <TableHead>Загрузка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouseStats.map(wh => (
                    <TableRow key={wh.id}>
                      <TableCell className="font-medium">{wh.name}</TableCell>
                      <TableCell>{wh.type}</TableCell>
                      <TableCell>{wh.incoming}</TableCell>
                      <TableCell>{wh.outgoing}</TableCell>
                      <TableCell>{wh.avgStayDays}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={wh.loadFactor} className="w-20" />
                          <span className="text-sm">{wh.loadFactor}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. KPI */}
        <TabsContent value="kpi" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Доставлено в срок</CardDescription>
                <CardTitle className="text-3xl text-green-600">{onTimePercentage}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={onTimePercentage} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Средняя задержка</CardDescription>
                <CardTitle className="text-3xl">1.2 дня</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">По всем заказам</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Заказов в работе</CardDescription>
                <CardTitle className="text-3xl">{orders?.filter(o => o.status === "in_transit" || o.status === "pending").length ?? 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Активные заказы</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Всего доставлено</CardDescription>
                <CardTitle className="text-3xl">{deliveredOnTime}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">За выбранный период</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Анализ соблюдения плановых сроков</CardTitle>
              <CardDescription>Стратегическая оценка общей эффективности логистического процесса</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Причина задержки</TableHead>
                    <TableHead>Количество</TableHead>
                    <TableHead>Процент</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>По вине перевозчика</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20" />
                        <span className="text-sm">45%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Задержка на складе</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-20" />
                        <span className="text-sm">30%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Таможенные процедуры</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={15} className="w-20" />
                        <span className="text-sm">15%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Прочие причины</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={10} className="w-20" />
                        <span className="text-sm">10%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
