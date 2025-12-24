import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order, OrderStatus, Contractor } from "@/types/supply-chain";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Search, ArrowUpDown, Eye, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { OrderForm } from "@/components/forms/OrderForm";

interface OrdersTableProps {
  orders: Order[];
  contractors: Contractor[];
}

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "secondary" },
  in_transit: { label: "В пути", variant: "default" },
  delivered: { label: "Доставлен", variant: "outline" },
  cancelled: { label: "Отменён", variant: "destructive" },
};

type SortField = 'orderNumber' | 'createdAt' | 'status' | 'totalCost';
type SortDirection = 'asc' | 'desc';

export function OrdersTable({ orders, contractors }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (order: Order, e: React.MouseEvent) => {
    // Don't open edit dialog if clicking on action buttons
    if ((e.target as HTMLElement).closest('button, a')) return;
    setEditingOrder(order);
    setEditDialogOpen(true);
  };

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.sender?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.recipient?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'orderNumber':
          comparison = a.orderNumber.localeCompare(b.orderNumber);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'totalCost':
          comparison = a.totalCost - b.totalCost;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по номеру, контрагенту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидает</SelectItem>
            <SelectItem value="in_transit">В пути</SelectItem>
            <SelectItem value="delivered">Доставлен</SelectItem>
            <SelectItem value="cancelled">Отменён</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('orderNumber')} className="-ml-4 h-8 gap-1">
                  Номер заказа <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="-ml-4 h-8 gap-1">
                  Статус <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Отправитель</TableHead>
              <TableHead>Получатель</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('createdAt')} className="-ml-4 h-8 gap-1">
                  Дата создания <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort('totalCost')} className="-ml-4 h-8 gap-1">
                  Стоимость <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow 
                key={order.id} 
                onClick={(e) => handleRowClick(order, e)}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell><span className="text-sm">{order.sender?.name || '—'}</span></TableCell>
                <TableCell><span className="text-sm">{order.recipient?.name || '—'}</span></TableCell>
                <TableCell>{format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}</TableCell>
                <TableCell>{order.totalCost.toLocaleString()} ₽</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/orders/${order.id}`}><Eye className="h-4 w-4" /></Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Заказы не найдены</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <OrderForm
        contractors={contractors}
        order={editingOrder ?? undefined}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        trigger={<></>}
      />
    </div>
  );
}
