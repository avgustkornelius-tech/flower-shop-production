import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { useCart } from "./cart-context";
import { Button } from "./ui/button";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const inCart = items.some(item => item.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/product/${product.id}`} className="group block relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 mb-4 border border-border/50">
        <img
          src={product.imageUrl || '/images/bouquet-1.png'}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
        />
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs uppercase tracking-wider font-medium shadow-sm">
            Хит
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white px-4 py-2 uppercase tracking-wider text-sm font-medium shadow-sm">
              Нет в наличии
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <Button
            size="icon"
            onClick={handleAdd}
            disabled={!product.inStock || isAdded}
            className={cn(
              "rounded-full shadow-lg h-12 w-12",
              isAdded ? "bg-secondary text-secondary-foreground" : ""
            )}
          >
            {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="font-serif text-xl mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">{product.category}</p>
        <p className="text-lg font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
      </div>
    </Link>
  );
}
