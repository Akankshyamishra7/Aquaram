import { Product, Order, Coupon } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/seedProducts';
import { connectToDatabase } from './db';
import { ProductModel } from '@/models/Product';
import { OrderModel } from '@/models/Order';

// In-memory fallback repository
let inMemoryProducts: Product[] = [...INITIAL_PRODUCTS];
let inMemoryOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'AQU-849201',
    items: [
      {
        productId: 'prod-discus-cobalt',
        name: 'Royal Blue Cobalt Discus (4-inch)',
        price: 4499,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      },
    ],
    shippingAddress: {
      fullName: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      phone: '+91 98765 43210',
      addressLine1: 'B-402, Sea Green Residency, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400020',
      country: 'India',
    },
    subtotal: 8998,
    shippingFee: 0,
    discount: 899,
    total: 8099,
    paymentMethod: 'demo',
    paymentStatus: 'completed',
    orderStatus: 'shipped',
    trackingNumber: 'BLUEDART-AQ-98214',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const VALID_COUPONS: Coupon[] = [
  {
    code: 'AQUA10',
    discountPercent: 10,
    minOrderValue: 999,
    description: '10% off on all aquatic products (Min order ₹999)',
  },
  {
    code: 'OCEAN500',
    discountAmount: 500,
    minOrderValue: 2499,
    description: 'Flat ₹500 discount on orders above ₹2,499',
  },
  {
    code: 'REEF20',
    discountPercent: 20,
    minOrderValue: 4999,
    description: '20% off on premium reef and exotic fish (Min order ₹4,999)',
  },
];

// Product methods
export async function getProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  bestSeller?: boolean;
  specialDeal?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Promise<Product[]> {
  const db = await connectToDatabase();
  let products: Product[] = [];

  if (db) {
    try {
      const query: Record<string, unknown> = {};
      if (options?.category && options.category !== 'all') {
        query.category = options.category;
      }
      if (options?.featured) query.isFeatured = true;
      if (options?.bestSeller) query.isBestSeller = true;
      if (options?.specialDeal) query.isSpecialDeal = true;
      if (options?.search) {
        query.$or = [
          { name: { $regex: options.search, $options: 'i' } },
          { description: { $regex: options.search, $options: 'i' } },
          { category: { $regex: options.search, $options: 'i' } },
        ];
      }

      const docs = await ProductModel.find(query).lean();
      if (docs && docs.length > 0) {
        products = docs.map((doc: any) => ({
          ...doc,
          id: doc._id.toString(),
        }));
      } else {
        // Fallback to memory if empty
        products = [...inMemoryProducts];
      }
    } catch {
      products = [...inMemoryProducts];
    }
  } else {
    products = [...inMemoryProducts];
  }

  // Filter in memory for search, category, and pricing
  if (options?.category && options.category !== 'all') {
    products = products.filter((p) => p.category === options.category);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  if (options?.featured) {
    products = products.filter((p) => p.isFeatured);
  }
  if (options?.bestSeller) {
    products = products.filter((p) => p.isBestSeller);
  }
  if (options?.specialDeal) {
    products = products.filter((p) => p.isSpecialDeal);
  }
  if (options?.minPrice !== undefined) {
    products = products.filter((p) => p.price >= (options.minPrice || 0));
  }
  if (options?.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= (options.maxPrice || Infinity));
  }

  // Sorting
  if (options?.sort) {
    switch (options.sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc: any = await ProductModel.findOne({ slug }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    } catch {
      // Fallback below
    }
  }
  return inMemoryProducts.find((p) => p.slug === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc: any = await ProductModel.findById(id).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    } catch {
      // Fallback below
    }
  }
  return inMemoryProducts.find((p) => p.id === id) || null;
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const slug =
    data.slug ||
    (data.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: data.name || 'New Aquarium Product',
    slug,
    category: data.category || 'freshwater-fish',
    price: Number(data.price) || 999,
    originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
    discountPercentage: data.discountPercentage || 0,
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 1,
    stock: Number(data.stock) ?? 10,
    inStock: (Number(data.stock) ?? 10) > 0,
    images: data.images && data.images.length > 0 ? data.images : [
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80',
    ],
    description: data.description || 'Premium aquarium product with healthy guarantee.',
    shortDescription: data.shortDescription,
    isFeatured: !!data.isFeatured,
    isBestSeller: !!data.isBestSeller,
    isSpecialDeal: !!data.isSpecialDeal,
    isLiveStock: !!data.isLiveStock,
    careLevel: data.careLevel || 'Beginner',
    temperament: data.temperament || 'Peaceful',
    waterParameters: data.waterParameters,
    specifications: data.specifications,
    createdAt: new Date().toISOString(),
  };

  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await ProductModel.create(newProduct);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn('Failed to insert product in MongoDB, storing in memory:', e);
    }
  }

  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated: any = await ProductModel.findByIdAndUpdate(id, updates, { new: true }).lean();
      if (updated) return { ...updated, id: updated._id.toString() };
    } catch {
      // Fallback below
    }
  }

  const index = inMemoryProducts.findIndex((p) => p.id === id);
  if (index !== -1) {
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
    return inMemoryProducts[index];
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  if (db) {
    try {
      await ProductModel.findByIdAndDelete(id);
    } catch {
      // Fallback below
    }
  }

  const initialLength = inMemoryProducts.length;
  inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id);
  return inMemoryProducts.length < initialLength;
}

// Order methods
export async function getOrders(): Promise<Order[]> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const docs = await OrderModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((doc: any) => ({
          ...doc,
          id: doc._id.toString(),
        }));
      }
    } catch {
      // Fallback below
    }
  }
  return inMemoryOrders;
}

export async function getOrderById(orderNumberOrId: string): Promise<Order | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const doc: any = await OrderModel.findOne({
        $or: [{ orderNumber: orderNumberOrId }, { _id: orderNumberOrId }],
      }).lean();
      if (doc) return { ...doc, id: doc._id.toString() };
    } catch {
      // Fallback
    }
  }
  return (
    inMemoryOrders.find(
      (o) => o.orderNumber === orderNumberOrId || o.id === orderNumberOrId
    ) || null
  );
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const orderNumber = `AQU-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    items: orderData.items || [],
    shippingAddress: orderData.shippingAddress!,
    subtotal: orderData.subtotal || 0,
    shippingFee: orderData.shippingFee || 0,
    discount: orderData.discount || 0,
    total: orderData.total || 0,
    paymentMethod: orderData.paymentMethod || 'demo',
    paymentStatus: orderData.paymentStatus || 'completed',
    orderStatus: 'confirmed',
    trackingNumber: `AQUA-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
  };

  const db = await connectToDatabase();
  if (db) {
    try {
      const created = await OrderModel.create(newOrder);
      return { ...created.toObject(), id: created._id.toString() };
    } catch (e) {
      console.warn('Failed to insert order in MongoDB:', e);
    }
  }

  inMemoryOrders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: Order['orderStatus']
): Promise<Order | null> {
  const db = await connectToDatabase();
  if (db) {
    try {
      const updated: any = await OrderModel.findByIdAndUpdate(
        id,
        { orderStatus: status },
        { new: true }
      ).lean();
      if (updated) return { ...updated, id: updated._id.toString() };
    } catch {
      // Fallback
    }
  }

  const order = inMemoryOrders.find((o) => o.id === id || o.orderNumber === id);
  if (order) {
    order.orderStatus = status;
    return order;
  }
  return null;
}

export function validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
  const cleanCode = code.trim().toUpperCase();
  const coupon = VALID_COUPONS.find((c) => c.code === cleanCode);

  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code.' };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for this code.`,
    };
  }

  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round((subtotal * coupon.discountPercent) / 100);
  } else if (coupon.discountAmount) {
    discount = coupon.discountAmount;
  }

  return {
    valid: true,
    discount,
    message: `Coupon "${coupon.code}" applied successfully! You saved ₹${discount.toLocaleString('en-IN')}.`,
  };
}

export async function seedDatabase(): Promise<{ count: number }> {
  inMemoryProducts = [...INITIAL_PRODUCTS];
  const db = await connectToDatabase();
  if (db) {
    try {
      await ProductModel.deleteMany({});
      await ProductModel.insertMany(INITIAL_PRODUCTS);
      return { count: INITIAL_PRODUCTS.length };
    } catch (err) {
      console.warn('Error during MongoDB seed:', err);
    }
  }
  return { count: INITIAL_PRODUCTS.length };
}
