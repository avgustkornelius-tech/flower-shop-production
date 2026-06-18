import { useRoute } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, Truck, PackageCheck, AlertCircle } from "lucide-react";

export default function OrderStatus() {
  const [, params] = useRoute("/order/:id");
  const id = Number(params?.id);

  const { data: order, isLoading, error } = useGetOrder(id, {
    query: { queryKey: getGetOrderQueryKey(id), enabled: !!id, refetchInterval: 10000 } // Poll every 10s
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
        <h1 className="font-serif text-3xl mb-4">Заказ не найден</h1>
        <p className="text-muted-foreground">Проверьте правильность номера заказа в ссылке.</p>
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
        <div className="bg-white p-8 border border-border shadow-sm mb-8 space-y-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-5/6" />
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'pending', label: 'Принят', icon: Clock },
    { id: 'confirmed', label: 'Собирается', icon: PackageCheck },
    { id: 'delivering', label: 'В пути', icon: Truck },
    { id: 'delivered', label: 'Доставлен', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status) !== -1 
    ? steps.findIndex(s => s.id === order.status) 
    : order.status === 'cancelled' ? -1 : 0;

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">Заказ #{order.id} оформлен</h1>
        <p className="text-lg text-muted-foreground">
          Спасибо за заказ, {order.customerName}! Мы уже начали работу над ним.
        </p>
      </div>

      <div className="bg-white border border-border p-8 md:p-12 shadow-sm mb-12">
        <h2 className="font-serif text-2xl mb-8">Статус заказа</h2>
        
        {order.status === 'cancelled' ? (
          <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 text-center font-medium">
            Заказ отменен
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary/30 -translate-y-1/2 z-0 hidden md:block"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 hidden md:block transition-all duration-1000" 
                 style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white
                      ${isCompleted ? 'border-primary text-primary' : 'border-secondary/50 text-muted-foreground'}
                      ${isCurrent ? 'shadow-[0_0_0_4px_rgba(var(--primary),0.1)]' : ''}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-secondary/10 p-8 border border-border">
          <h3 className="font-serif text-xl mb-6 border-b border-border/50 pb-4">Информация о доставке</h3>
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Адрес:</dt>
              <dd className="font-medium text-right">{order.deliveryAddress}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Дата:</dt>
              <dd className="font-medium text-right">{new Date(order.deliveryDate).toLocaleDateString('ru-RU')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Время:</dt>
              <dd className="font-medium text-right">{order.deliveryTime}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Телефон:</dt>
              <dd className="font-medium text-right">{order.customerPhone}</dd>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <dt className="text-muted-foreground mb-2">Комментарий:</dt>
                <dd className="italic text-foreground/80">{order.notes}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="bg-secondary/10 p-8 border border-border">
          <h3 className="font-serif text-xl mb-6 border-b border-border/50 pb-4">Состав заказа</h3>
          <div className="space-y-4 mb-6">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between items-center text-sm">
                <span className="flex-1 pr-4">{item.productName} <span className="text-muted-foreground">x{item.quantity}</span></span>
                <span className="font-medium">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border/50 pt-4 flex justify-between items-center">
            <span className="font-serif text-xl">Итого</span>
            <span className="font-serif text-2xl text-primary">{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>
    </div>
  );
}
