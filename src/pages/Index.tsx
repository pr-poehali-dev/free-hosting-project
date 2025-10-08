import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Свежий хлеб', price: 45, category: 'Хлеб', image: '/placeholder.svg' },
  { id: 2, name: 'Молоко 3.2%', price: 85, category: 'Молочные', image: '/placeholder.svg' },
  { id: 3, name: 'Яйца С1', price: 120, category: 'Яйца', image: '/placeholder.svg' },
  { id: 4, name: 'Сыр российский', price: 350, category: 'Молочные', image: '/placeholder.svg' },
  { id: 5, name: 'Помидоры', price: 180, category: 'Овощи', image: '/placeholder.svg' },
  { id: 6, name: 'Огурцы', price: 140, category: 'Овощи', image: '/placeholder.svg' },
  { id: 7, name: 'Яблоки', price: 95, category: 'Фрукты', image: '/placeholder.svg' },
  { id: 8, name: 'Бананы', price: 110, category: 'Фрукты', image: '/placeholder.svg' },
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState<'home' | 'catalog'>('home');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">ONLINE STORE</h1>
          
          <nav className="flex gap-6">
            <button
              onClick={() => setActiveSection('home')}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                activeSection === 'home' ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setActiveSection('catalog')}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                activeSection === 'catalog' ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground'
              }`}
            >
              Каталог
            </button>
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-muted" />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 space-y-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Итого:</span>
                        <span>{totalPrice} ₽</span>
                      </div>
                      <Button className="w-full">Оформить заказ</Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeSection === 'home' && (
          <div className="space-y-16">
            <section className="text-center space-y-4">
              <h2 className="text-5xl font-bold tracking-tight">Продукты с доставкой</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Свежие продукты питания с бесплатной доставкой на дом
              </p>
              <Button size="lg" onClick={() => setActiveSection('catalog')} className="mt-6">
                Перейти в каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-8">Популярные товары</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">{product.price} ₽</span>
                        <Button size="sm" onClick={() => addToCart(product)}>
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'catalog' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Каталог продуктов</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Package" size={20} />
                <span>{products.length} товаров</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{product.price} ₽</span>
                      <Button size="sm" onClick={() => addToCart(product)}>
                        Добавить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">О магазине</h3>
              <p className="text-sm text-muted-foreground">
                Доставка свежих продуктов питания прямо к вашей двери
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Контакты</h3>
              <p className="text-sm text-muted-foreground">Телефон: +7 (999) 123-45-67</p>
              <p className="text-sm text-muted-foreground">Email: info@store.ru</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Режим работы</h3>
              <p className="text-sm text-muted-foreground">Ежедневно: 8:00 — 22:00</p>
              <p className="text-sm text-muted-foreground">Доставка: 9:00 — 21:00</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
