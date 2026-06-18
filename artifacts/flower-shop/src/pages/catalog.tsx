import { useState } from "react";
import { useListProducts, useGetCatalogSummary, getListProductsQueryKey, getGetCatalogSummaryQueryKey } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  // Handle search debounce manually for simplicity
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
    }, 500);
    return () => clearTimeout(timer);
  };

  const { data: summary } = useGetCatalogSummary({
    query: { queryKey: getGetCatalogSummaryQueryKey() }
  });

  const queryParams = {
    ...(category !== "all" && { category }),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(sortBy !== "popular" && { sortBy: sortBy as any }),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  };

  const { data: products, isLoading } = useListProducts(queryParams, {
    query: { queryKey: getListProductsQueryKey(queryParams) }
  });

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
        {/* Desktop Filters */}
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full aspect-[3/4] rounded-none" />
                  <Skeleton className="h-6 w-2/3 rounded-none" />
                  <Skeleton className="h-4 w-1/3 rounded-none" />
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="py-24 text-center border border-border bg-white">
              <h3 className="font-serif text-2xl mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground mb-6">Попробуйте изменить параметры поиска или фильтры</p>
              <Button 
                variant="outline" 
                className="rounded-none"
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                  setCategory("all");
                  setPriceRange([0, 20000]);
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
