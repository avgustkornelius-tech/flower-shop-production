import { useRoute } from "wouter";
import { useGetProduct, getGetProductQueryKey, useListReviews, getListReviewsQueryKey, useCreateReview } from "@workspace/api-client-react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Truck, ShieldCheck, Heart, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = Number(params?.id);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useGetProduct(id, {
    query: { queryKey: getGetProductQueryKey(id), enabled: !!id }
  });

  const { data: reviews } = useListReviews({ productId: id }, {
    query: { queryKey: getListReviewsQueryKey({ productId: id }), enabled: !!id }
  });

  const createReview = useCreateReview();
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Добавлено в корзину",
        description: `${product.name} (${quantity} шт.)`,
      });
    }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      toast({ title: "Ошибка", description: "Заполните все поля", variant: "destructive" });
      return;
    }
    
    createReview.mutate({
      data: {
        productId: id,
        customerName: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }
    }, {
      onSuccess: () => {
        toast({ title: "Спасибо за отзыв!" });
        setReviewForm({ name: "", rating: 5, comment: "" });
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey({ productId: id }) });
      }
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">Букет не найден</h1>
        <p className="text-muted-foreground">Возможно он был удален или ссылка неверна.</p>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-[3/4] rounded-none" />
          <div className="space-y-6 pt-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative aspect-[3/4] bg-secondary/10 border border-border">
            <img 
              src={product.imageUrl || '/images/bouquet-1.png'} 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply"
            />
            {product.isFeatured && (
              <div className="absolute top-4 left-4 bg-white px-4 py-2 text-sm uppercase tracking-wider font-medium shadow-sm">
                Хит продаж
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <p className="text-primary text-sm uppercase tracking-wider font-medium mb-3">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl mb-4 text-foreground">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
                <div className="flex items-center gap-1 bg-secondary/20 px-3 py-1 text-sm text-secondary-foreground">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({product.reviewCount})</span>
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-3 text-foreground/80">
                <Truck className="w-5 h-5 text-primary" />
                <span>Бесплатная доставка от 5000 ₽ по Москве</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <Heart className="w-5 h-5 text-primary" />
                <span>Соберем максимально похоже, свежесть гарантируем</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Фото букета перед отправкой</span>
              </div>
            </div>

            <div className="border-t border-border pt-8 mt-auto">
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center border border-border bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 text-muted-foreground hover:bg-secondary/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 text-muted-foreground hover:bg-secondary/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xl font-medium text-primary">
                  Итого: {(product.price * quantity).toLocaleString('ru-RU')} ₽
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full h-16 text-lg rounded-none shadow-xl"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 border-t border-border pt-16">
          <h2 className="font-serif text-3xl mb-12 text-center">Отзывы покупателей</h2>
          
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {reviews?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Пока нет отзывов. Станьте первым!</p>
              ) : (
                reviews?.map(review => (
                  <div key={review.id} className="bg-white p-6 border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-lg">{review.customerName}</span>
                      <div className="flex gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-muted/30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/80 leading-relaxed">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wider">
                      {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-secondary/10 p-8 border border-border h-fit">
              <h3 className="font-serif text-2xl mb-6">Оставить отзыв</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <Input 
                    required 
                    value={reviewForm.name} 
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="rounded-none bg-white border-border/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Оценка</label>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}
                        className="focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${i < reviewForm.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Комментарий</label>
                  <Textarea 
                    required 
                    rows={4}
                    value={reviewForm.comment} 
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="rounded-none bg-white border-border/50 resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={createReview.isPending}
                  className="w-full rounded-none"
                >
                  {createReview.isPending ? "Отправка..." : "Отправить"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
