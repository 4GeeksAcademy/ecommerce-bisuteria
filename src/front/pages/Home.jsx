import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { productsAPI, cartAPI, handleAPIError, formatPrice } from '../utils/api';
import { 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Shield, 
  Truck, 
  HeadphonesIcon,
  ArrowRight,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'react-toastify';

const Home = () => {
  const { state, actions, getters } = useStore();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getProducts({ per_page: 8 });
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error('Error loading featured products:', error);
      toast.error('Error al cargar productos destacados');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!getters.isAuthenticated) {
      toast.info('Inicia sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    try {
      actions.setLoading(true);
      await cartAPI.addToCart({ product_id: product.id, quantity: 1 });
      actions.addToCart({
        id: Date.now(), // Temporal ID
        product_id: product.id,
        product: product,
        quantity: 1
      });
      toast.success(`${product.name} agregado al carrito`);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Bienvenido a{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Onix 2.0
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
                Descubre productos únicos con la mejor calidad y precios increíbles. 
                Tu experiencia de compra perfecta nos espera.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/products" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explorar Productos
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-700 transition-all duration-300"
                >
                  Únete Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-primary-100">Productos</div>
                      <TrendingUp className="w-5 h-5 text-green-300" />
                    </div>
                    <div className="text-3xl font-bold">10,000+</div>
                    <div className="text-primary-100">En nuestro catálogo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-10 transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-300 to-pink-300 rounded-full opacity-10 transform -translate-x-32 translate-y-32"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              ¿Por qué elegir Onix 2.0?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia de compra online con garantías que nos distinguen
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-xl mb-6 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Envío Gratis</h3>
              <p className="text-secondary-600">
                Envío gratuito en compras mayores a $50. Recibe tus productos en 24-48 horas.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Compra Segura</h3>
              <p className="text-secondary-600">
                Pagos 100% seguros con encriptación SSL. Tu información está siempre protegida.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">Soporte 24/7</h3>
              <p className="text-secondary-600">
                Atención al cliente disponible todos los días. Estamos aquí para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Explora nuestras categorías
            </h2>
            <p className="text-lg text-secondary-600">
              Encuentra exactamente lo que buscas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {state.categories.slice(0, 8).map((category, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600', 
                'from-purple-500 to-purple-600',
                'from-red-500 to-red-600',
                'from-yellow-500 to-yellow-600',
                'from-pink-500 to-pink-600',
                'from-indigo-500 to-indigo-600',
                'from-orange-500 to-orange-600'
              ];
              
              return (
                <Link
                  key={category.value}
                  to={`/products?category=${category.value}`}
                  className="group block"
                >
                  <div className={`bg-gradient-to-br ${colors[index]} rounded-xl p-6 text-white text-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                    <div className="text-3xl mb-3">
                      {index === 0 && '💻'}
                      {index === 1 && '👕'}
                      {index === 2 && '🏠'}
                      {index === 3 && '📚'}
                      {index === 4 && '⚽'}
                      {index === 5 && '💄'}
                      {index === 6 && '🧸'}
                      {index === 7 && '🔧'}
                    </div>
                    <h3 className="font-semibold text-lg">{category.label}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Productos destacados
              </h2>
              <p className="text-lg text-secondary-600">
                Los más populares de nuestra tienda
              </p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              Ver todos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden animate-pulse">
                  <div className="bg-secondary-200 h-48"></div>
                  <div className="p-4">
                    <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-2/3 mb-4"></div>
                    <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors">
                        <Heart className="w-4 h-4 text-secondary-600 hover:text-red-500" />
                      </button>
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          ¡Últimas unidades!
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-secondary-600">(4.8)</span>
                    </div>
                    
                    <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      <Link to={`/product/${product.id}`}>
                        {product.name}
                      </Link>
                    </h3>
                    
                    <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-secondary-500">
                          Stock: {product.stock}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          product.stock === 0
                            ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md transform hover:scale-105'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center btn-primary px-8 py-3"
            >
              Ver todos los productos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mantente al día con Onix 2.0
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Suscríbete y recibe ofertas exclusivas, nuevos productos y descuentos especiales
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg text-secondary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                Suscribirse
              </button>
            </div>
            <p className="text-sm text-primary-200 mt-3">
              *No spam. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-secondary-600">Productos</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-secondary-600">Clientes Felices</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-secondary-600">Satisfacción</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">24h</div>
              <div className="text-secondary-600">Envío Rápido</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;