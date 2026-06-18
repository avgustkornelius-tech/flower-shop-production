import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOrder } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ArrowRight } from "lucide-react";

export default function Checkout() {
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Корзина пуста", variant: "destructive" });
      return;
    }

    createOrder.mutate({
      data: {
        ...formData,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        toast({ title: "Заказ успешно оформлен!" });
        setLocation(`/order/${order.id}`);
      },
      onError: () => {
        toast({ title: "Ошибка при оформлении", variant: "destructive" });
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-lg">
        <h1 className="font-serif text-4xl mb-6">Ваша корзина пуста</h1>
        <p className="text-muted-foreground mb-10 text-lg">
          Самое время выбрать красивый букет для близкого человека или для себя.
        </p>
        <Button asChild size="lg" className="rounded-none w-full h-14 text-base">
          <Link href="/catalog">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-24">
      <h1 className="font-serif text-5xl mb-12">Оформление заказа</h1>
      
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
            <section className="bg-white p-8 border border-border shadow-sm">
              <h2 className="font-serif text-2xl mb-6">Данные получателя</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Имя</label>
                  <Input required name="customerName" value={formData.customerName} onChange={handleChange} className="rounded-none h-12" placeholder="Анна Смирнова" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Телефон</label>
                  <Input required name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="rounded-none h-12" placeholder="+7 (999) 000-00-00" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Email</label>
                  <Input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="rounded-none h-12" placeholder="anna@example.com" />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 border border-border shadow-sm">
              <h2 className="font-serif text-2xl mb-6">Доставка</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Адрес</label>
                  <Input required name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="rounded-none h-12" placeholder="ул. Тверская 15, кв 45" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Дата</label>
                  <Input required type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="rounded-none h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Время</label>
                  <Input required type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="rounded-none h-12" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium uppercase tracking-wide">Комментарий курьеру / Текст записки</label>
                  <Textarea name="notes" value={formData.notes} onChange={handleChange} className="rounded-none resize-none h-24" placeholder="Позвонить за час / Добавить открытку 'С любовью'" />
                </div>
              </div>
            </section>
          </form>
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-secondary/10 p-8 border border-border">
            <h2 className="font-serif text-2xl mb-8">Ваш заказ</h2>
            <div className="space-y-6 max-h-[50vh] overflow-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 bg-white p-3 border border-border/50">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-20 h-24 object-cover" />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-foreground">{item.product.name}</h4>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-muted-foreground hover:bg-secondary/20">-</button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-muted-foreground hover:bg-secondary/20">+</button>
                      </div>
                      <span className="font-medium">{(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border space-y-4">
              <div className="flex justify-between text-foreground/70">
                <span>Товары ({items.length})</span>
                <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Доставка</span>
                <span className="text-primary font-medium">Бесплатно</span>
              </div>
              <div className="flex justify-between text-2xl font-serif pt-4">
                <span>Итого</span>
                <span className="text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              size="lg" 
              className="w-full mt-8 h-16 text-lg rounded-none shadow-xl flex items-center justify-between px-6"
              disabled={createOrder.isPending}
            >
              <span>{createOrder.isPending ? "Оформляем..." : "Оплатить заказ"}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
