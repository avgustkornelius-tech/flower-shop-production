export default function Catalog() {
  const products = [
    {
      id: 1,
      name: "Букет «Розовая мечта»",
      price: 3500,
      imageUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400"
    },
    {
      id: 2,
      name: "Букет «Солнечный день»",
      price: 2800,
      imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400"
    },
    {
      id: 3,
      name: "Букет «Весенний сад»",
      price: 4200,
      imageUrl: "https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=400"
    }
  ];

  return (
    <div className="w-full py-12 px-4 md:px-6 container mx-auto">
      <div className="mb-12">
        <h1 className="font-serif text-5xl mb-4">Каталог</h1>
        <p className="text-muted-foreground text-lg">Свежие авторские букеты</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <div key={product.id} className="group block">
            <div className="aspect-[3/4] overflow-hidden bg-secondary/10 mb-4 border border-border/50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-serif text-xl mb-1">{product.name}</h3>
            <p className="text-lg font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
          </div>
        ))}
      </div>
    </div>
  );
}