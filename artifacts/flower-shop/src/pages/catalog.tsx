import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mockProducts, mockSummary } from "../data/mock-products";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
    }, 500);
    return () => clearTimeout(timer);
  };

  const summary = mockSummary;
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = !debouncedSearch || product.name.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const products = sortedProducts;
  const isLoading = false;

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h4 className="font-serif text-lg font-medium mb-4">Категория</h4>
        <div className="space-y-2">
          <button
            onClick={() => setCategory("all")}
            className={`block text-left w-full px-3 py-2 text-sm transition-colors ${
              category === "all" ? "bg-accent/50 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/20"
            }`}
          >
            Все букеты
          </button>
          {summary?.categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`block text-left w-full px-3 py-2 text-sm transition-colors uppercase tracking-wider ${
                category === cat ? "bg-accent/50 text-primary font-medium" : "text-muted-foreground hover:bg-secondary/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-serif text-lg font-medium mb-4">Цена</h4>
        <Slider
          defaultValue={[0, 20000]}
          max={20000}
          step={500}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(val) => setPriceRange([val[0], val[1]])}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]} ₽</span>
          <span>{priceRange[1]} ₽</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full py-12 px-4 md:px-6 container mx-auto">
      <div className="mb-12">
        <h1 className="font-serif text-5xl mb-4">Каталог</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Свежие авторские букеты для любого повода. Выберите идеальную композицию или воспользуйтесь нашим AI-помощником.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterContent />
        </aside>

        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="search" 
                placeholder="Поиск букетов..." 
                className="pl-10 rounded-none border-border/50 bg-white"
                value={search}
                onChange={handleSearch}
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden rounded-none flex-1">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Фильтры
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-2xl text-left mb-6">Фильтры</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-none bg-white">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">По популярности</SelectItem>
                  <SelectItem value="price_asc">Сначала дешевле</SelectItem>
                  <SelectItem value="price_desc">Сначала дороже</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading