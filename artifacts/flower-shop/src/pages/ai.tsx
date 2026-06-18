import { useState, useRef, useEffect } from "react";
import { useAiRecommend, ChatMessage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useListProducts, getListProductsQueryKey } from "@workspace/api-client-react";

export default function AiFlorist() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Привет! Я AI-флорист студии "Цветочная". Расскажите, для кого нужен букет, по какому поводу и в каком бюджете, и я подберу идеальные варианты.' }
  ]);
  const [input, setInput] = useState("");
  const [recommendedIds, setRecommendedIds] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const recommendMutation = useAiRecommend();

  const { data: products } = useListProducts({}, {
    query: { 
      queryKey: getListProductsQueryKey({}),
      enabled: recommendedIds.length > 0
    }
  });

  const recommendedProducts = products?.filter(p => recommendedIds.includes(p.id)) || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, recommendMutation.isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || recommendMutation.isPending) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setRecommendedIds([]); // Clear previous recommendations while thinking

    recommendMutation.mutate({
      data: {
        message: input,
        history: messages.filter(m => m.role === 'user' || m.role === 'assistant')
      }
    }, {
      onSuccess: (response) => {
        setMessages([...newMessages, { role: 'assistant', content: response.reply }]);
        if (response.recommendedProductIds?.length > 0) {
          setRecommendedIds(response.recommendedProductIds);
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl h-[calc(100vh-80px)] flex flex-col">
      <div className="text-center mb-8 shrink-0">
        <h1 className="font-serif text-4xl mb-3 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Флорист
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Умный помощник, который понимает язык цветов. Просто опишите свои пожелания.
        </p>
      </div>

      <div className="flex-1 bg-white border border-border shadow-sm flex flex-col overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
        >
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary/30 text-secondary-foreground'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-4 text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-l-2xl rounded-br-2xl' 
                  : 'bg-secondary/10 text-foreground border border-border rounded-r-2xl rounded-bl-2xl'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {recommendMutation.isPending && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary/30 text-secondary-foreground flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-secondary/10 border border-border rounded-r-2xl rounded-bl-2xl p-4 flex gap-2 items-center">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {recommendedProducts.length > 0 && !recommendMutation.isPending && (
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium mb-6 text-center">
                Рекомендованные букеты
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recommendedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-background border-t border-border shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Например: нужен нежный букет на свадьбу до 5000 рублей..."
              className="flex-1 h-14 rounded-none bg-white border-border"
              disabled={recommendMutation.isPending}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-14 w-14 rounded-none shrink-0"
              disabled={!input.trim() || recommendMutation.isPending}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
