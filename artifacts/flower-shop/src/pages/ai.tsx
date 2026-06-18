import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "Букет «Розовая мечта»",
    price: 3500,
    imageUrl: "https://picsum.photos/seed/flower1/400/500",
    category: "Розы"
  },
  {
    id: 2,
    name: "Букет «Солнечный день»",
    price: 2800,
    imageUrl: "https://picsum.photos/seed/flower2/400/500",
    category: "Подсолнухи"
  },
  {
    id: 3,
    name: "Букет «Весенний сад»",
    price: 4200,
    imageUrl: "https://picsum.photos/seed/flower3/400/500",
    category: "Тюльпаны"
  }
];

export default function AiFlorist() {
  const [input, setInput] = useState("");

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl mb-3 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Флорист
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Умный помощник, который поможет подобрать идеальный букет. Просто опишите свои пожелания.
        </p>
      </div>

      <div className="bg-white border border-border shadow-sm rounded-lg p-8 mb-8">
        <div className="mb-6 p-4 bg-secondary/10 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-2">AI Флорист:</p>
          <p>Привет! Я AI-флорист студии "Цветочная". Расскажите, для кого нужен букет, по какому поводу и в каком бюджете, и я подберу идеальные варианты.</p>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            💡 Попробуйте: "Нужен нежный букет на свадьбу до 5000 рублей"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {mockProducts.map(product => (
            <Link key={product.id} href={`/product/${product.id}`} className="group block">
              <div className="aspect-[3/4] overflow-hidden bg-secondary/10 mb-3 border border-border/50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-serif text-lg mb-1">{product.name}</h3>
              <p className="text-muted-foreground text-sm mb-1">{product.category}</p>
              <p className="text-lg font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
            </Link>
          ))}
        </div>

        <form className="flex gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Например: нужен нежный букет на свадьбу до 5000 рублей..."
            className="flex-1 h-14 rounded-none bg-white border-border"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-14 w-14 rounded-none shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}