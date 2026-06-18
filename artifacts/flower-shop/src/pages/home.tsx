import { useGetFeaturedProducts, getGetFeaturedProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Heart, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";

export default function Home() {
  const { data: featuredProducts, isLoading } = useGetFeaturedProducts({
    query: { queryKey: getGetFeaturedProductsQueryKey() }
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#Fdfbf9]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-accent/30 rounded-bl-full blur-3xl opacity-50 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 w-1/2 h-2/3 bg-secondary/20 rounded-tr-full blur-3xl opacity-50 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[1.1] text-foreground mb-6">
              Искусство <br/><span className="text-primary italic">дарить эмоции.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10 leading-relaxed max-w-lg">
              Авторские букеты с душой, собранные вручную в нашей московской мастерской. Доставляем красоту и тепло.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-none px-8 text-base h-14">
                <Link href="/catalog">Смотреть каталог</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none px-8 text-base h-14 bg-transparent border-primary/20 hover:bg-primary/5">
                <Link href="/ai" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Подобрать с ИИ
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[600px] hidden md:block"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-t-full rounded-b-[400px] overflow-hidden border border-primary/10">
              <img 
                src="/images/bouquet-1.png" 
                alt="Beautiful bouquet" 
                className="w-full h-full object-cover object-center mix-blend-multiply opacity-90"
              />
            </div>
            {/* Floating badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 top-1/3 bg-white p-4 shadow-xl border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold">Сделано с любовью</p>
                <p className="text-xs text-muted-foreground">Каждый цветок отобран вручную</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl mb-3">Хиты студии</h2>
              <p className="text-muted-foreground">Букеты, которые выбирают чаще всего</p>
            </div>
            <Link href="/catalog" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors uppercase tracking-wider text-sm font-medium">
              Весь каталог <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[3/4] rounded-none" />
                  <Skeleton className="h-6 w-2/3 rounded-none" />
                  <Skeleton className="h-4 w-1/3 rounded-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts?.slice(0, 4).map((product, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Button asChild variant="outline" className="rounded-none w-full border-primary/20">
              <Link href="/catalog">Весь каталог</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl">Свежесть</h3>
              <p className="text-muted-foreground leading-relaxed">
                Прямые поставки от проверенных плантаций каждые 2 дня.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl">Эстетика</h3>
              <p className="text-muted-foreground leading-relaxed">
                Современная упаковка, гармоничные сочетания оттенков и фактур.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl">AI Помощник</h3>
              <p className="text-muted-foreground leading-relaxed">
                Умный ассистент поможет подобрать идеальный букет под ваш повод.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563241527-3004b7be0ffd')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 max-w-2xl mx-auto leading-tight">
            Подарите эмоции, которые запомнятся
          </h2>
          <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto text-lg">
            Оформите заказ сейчас, и мы доставим букет в течение 2 часов в любую точку Москвы.
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-none px-10 h-14 text-base bg-white text-primary hover:bg-white/90">
            <Link href="/catalog">Выбрать букет</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
