import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Sparkles, Menu, X } from "lucide-react";
import { useCart } from "./cart-context";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/ai", label: "AI Флорист", icon: <Sparkles className="w-4 h-4 ml-1" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-foreground/80 hover:text-foreground"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                Цветочная.
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide uppercase flex items-center transition-colors hover:text-primary ${
                  location === link.href ? "text-primary font-medium" : "text-foreground/70"
                }`}
              >
                {link.label}
                {link.icon}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/checkout" className="relative p-2 text-foreground/80 hover:text-foreground transition-colors group">
              <ShoppingBag className="w-6 h-6" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary rounded-full group-hover:scale-110 transition-transform"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background border-r border-border md:hidden shadow-2xl"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                    Цветочная.
                  </span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-foreground/60 hover:text-foreground">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-lg tracking-wide uppercase flex items-center transition-colors ${
                        location === link.href ? "text-primary font-medium" : "text-foreground/70"
                      }`}
                    >
                      {link.label}
                      {link.icon}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">Москва, ул. Тверская 15</p>
                  <p className="text-sm text-muted-foreground">+7 (999) 123-45-67</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full relative">
        {children}
      </main>

      <footer className="bg-secondary/20 border-t border-border/50 py-12 md:py-16 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-primary block mb-4">
                Цветочная.
              </span>
              <p className="text-foreground/70 max-w-sm mb-6 leading-relaxed">
                Бутиковая студия флористики в Москве. Мы создаем не просто букеты, мы передаем чувства.
              </p>
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium mb-4">Меню</h4>
              <ul className="space-y-3">
                <li><Link href="/catalog" className="text-foreground/70 hover:text-primary transition-colors">Каталог</Link></li>
                <li><Link href="/ai" className="text-foreground/70 hover:text-primary transition-colors flex items-center gap-1">AI Флорист <Sparkles className="w-3 h-3" /></Link></li>
                <li><Link href="/checkout" className="text-foreground/70 hover:text-primary transition-colors">Корзина</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium mb-4">Контакты</h4>
              <ul className="space-y-3 text-foreground/70">
                <li>+7 (999) 123-45-67</li>
                <li>hello@tsvetochnaya.ru</li>
                <li>Москва, ул. Тверская 15</li>
                <li>Ежедневно 09:00 - 21:00</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} Цветочная. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
