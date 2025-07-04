import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store.jsx';
import { cartAPI, handleAPIError, formatPrice } from '../utils/api';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProductCard = ({ 
  product, 
  showQuickView = true, 
  showWishlist = true,
  className = "",
  variant = "default" // default, compact, detailed
}) => {
  const { state, actions, getters } = useStore();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!getters.isAuthenticated) {
      toast.info('Inicia sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      toast.error('Producto sin stock');
      return;
    }

    try {
      setIsLoading(true);
      await cartAPI.addToCart({ 
        product_id: product.id, 
        quantity: quantity 
      });
      
      actions.addToCart({
        id: Date.now(),
        product_id: product.id,
        product: product,
        quantity: quantity
      });
      
      toast.success(`${product.name} agregado al carrito`);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!getters.isAuthenticated) {
      toast.info('Inicia sesión para agregar a favoritos');
      navigate('/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted 
        ? 'Eliminado de favoritos' 
        : 'Agregado a favoritos'
    );
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Sin stock', color: 'bg-red-500', textColor: 'text-red-600' };
    } else if (product.stock <= 5) {
      return { text: '¡Últimas unidades!', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
    } else if (product.stock <= 10) {
      return { text: 'Stock limitado', color: 'bg-orange-500', textColor: 'text-orange-600' };
    }
    return { text: 'En stock', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const stockStatus = getStockStatus();

  // Diferentes variantes del componente
  if (variant === "compact") {
    return (
      <Link to={`/product/${product.id}`} className={`block group ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="relative">
            <img
              src={imageError ? 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' : product.image_url}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.stock <= 5 && (
              <div className="absolute top-2 left-2">
                <span className={`${stockStatus.color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                  {stockStatus.text}
                </span>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-secondary-900 text-sm line-clamp-2 mb-1">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isLoading}
                className={`p-1 rounded transition-all ${
                  product.stock === 0
                    ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Variante por defecto (completa)
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={imageError ? 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop' : product.image_url}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
                title="Vista rápida"
              >
                <Eye className="w-4 h-4 text-secondary-600 hover:text-primary-600" />
              </button>
            )}
            {showWishlist && (
              <button
                onClick={handleWishlist}
                className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors"
                title={isWishlisted ? "Eliminar de favoritos" : "Agregar a favoritos"}
              >
                <Heart className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'text-red-500 fill-current' : 'text-secondary-600 hover:text-red-500'
                }`} />
              </button>
            )}
          </div>
        </div>

        {/* Stock badge */}
        {product.stock <= 10 && (
          <div className="absolute top-2 left-2">
            <span className={`${stockStatus.color} text-white px-2 py-1 rounded-full text-xs font-medium`}>
              {stockStatus.text}
            </span>
          </div>
        )}

        {/* Discount badge (ejemplo) */}
        {product.discount && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              -{product.discount}%
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-400 mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < (product.rating || 4) ? 'fill-current' : 'text-secondary-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-secondary-600">
            ({product.rating || 4.8}) · {product.reviews || Math.floor(Math.random() * 50) + 10} reseñas
          </span>
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
          {product.description || 'Producto de alta calidad con las mejores características del mercado.'}
        </p>
        
        {/* Category */}
        <div className="mb-3">
          <span className="inline-block bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
            {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'General'}
          </span>
        </div>
        
        {/* Price and Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-sm text-secondary-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-secondary-500">
              <span className={stockStatus.textColor}>
                Stock: {product.stock}
              </span>
            </div>
          </div>

          {/* Quantity selector for detailed variant */}
          {variant === "detailed" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-secondary-300 rounded-lg">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                  className="p-2 hover:bg-secondary-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (quantity < product.stock) setQuantity(quantity + 1);
                  }}
                  className="p-2 hover:bg-secondary-50 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
              product.stock === 0
                ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <div className="loading-spinner mr-2"></div>
            ) : (
              <ShoppingCart className="w-4 h-4 mr-2" />
            )}
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;