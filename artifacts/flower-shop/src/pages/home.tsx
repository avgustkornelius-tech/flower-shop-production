import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredProducts = [
  {
    id: 1,
    name: "Букет «Розовая мечта»",
    price: 3500,
    imageUrl: "https://picsum.photos/seed/flower1/400/500",
    category: "Розы",
    inStock: true,
    isFeatured: true
  },
  {
    id: 2,
    name: "Букет «Солнечный день»",
    price: 2800,
    imageUrl: "https://placehold.co/400x500/FFB6C1/000000?text=Pink+Bouquet",
    category: "Подсолнухи",
    inStock: true,
    isFeatured: true
  },
  {
    id: 3,
    name: "Букет «Весенний сад»",
    price: 4200,
    imageUrl: "https://picsum.photos/seed/flower3/400/500",
    category: "Тюльпаны",
    inStock: true,
    isFeatured: true
  },
  {
    id: 4,
    name: "Букет «Элегантность»",
    price: 5500,
    imageUrl: "https://picsum.photos/seed/flower4/400/500",
    category: "Лилии",
    inStock: true,
    isFeatured: true
  }
];

export default function Home() {
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
                  AI Флорист
                </Link>
              </Button>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/product/${product.id}`} className="group block relative">
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 mb-4 border border-border/50">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isFeatured && (
                      <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs uppercase tracking-wider font-medium shadow-sm">
                        Хит
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">{product.category}</p>
                    <p className="text-lg font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
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
    </div>
  );
}