import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Globe, Shield, Palette } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Настройки</h1>
        <p className="text-muted-foreground">Управление параметрами системы</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Уведомления</CardTitle>
              <CardDescription>Настройки оповещений о событиях</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email-уведомления</Label>
              <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push-уведомления</Label>
              <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Уведомления о задержках</Label>
              <p className="text-sm text-muted-foreground">Оповещать при задержке доставки</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-info/10 p-2">
              <Globe className="h-5 w-5 text-info" />
            </div>
            <div>
              <CardTitle className="text-lg">Локализация</CardTitle>
              <CardDescription>Язык и региональные настройки</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="language">Язык интерфейса</Label>
            <Input id="language" value="Русский" readOnly className="max-w-xs" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timezone">Часовой пояс</Label>
            <Input id="timezone" value="UTC+3 (Москва)" readOnly className="max-w-xs" />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-warning/10 p-2">
              <Shield className="h-5 w-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-lg">Безопасность</CardTitle>
              <CardDescription>Настройки безопасности аккаунта</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Двухфакторная аутентификация</Label>
              <p className="text-sm text-muted-foreground">Дополнительный уровень защиты</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <Button variant="outline">Сменить пароль</Button>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-success/10 p-2">
              <Palette className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-lg">Внешний вид</CardTitle>
              <CardDescription>Настройки темы и отображения</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Тёмная тема</Label>
              <p className="text-sm text-muted-foreground">Переключить на тёмный режим</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Компактный режим</Label>
              <p className="text-sm text-muted-foreground">Уменьшить отступы в интерфейсе</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
