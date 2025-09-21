import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProductSchema, insertCartSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Product routes
  app.get("/api/products", async (req, res, next) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/products/:id", async (req, res, next) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/products", requireAdmin, async (req, res, next) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/products/:id", requireAdmin, async (req, res, next) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res, next) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Cart routes
  app.get("/api/cart", requireAuth, async (req, res, next) => {
    try {
      const cartItems = await storage.getCartByUser(req.user!.id);
      res.json(cartItems);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/cart", requireAuth, async (req, res, next) => {
    try {
      const cartData = insertCartSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const cartItem = await storage.addToCart(cartData);
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/cart/:productId", requireAuth, async (req, res, next) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: "Valid quantity required" });
      }
      
      const cartItem = await storage.updateCartItem(req.user!.id, req.params.productId, quantity);
      if (quantity === 0) {
        return res.status(204).send();
      }
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart/:productId", requireAuth, async (req, res, next) => {
    try {
      const success = await storage.removeFromCart(req.user!.id, req.params.productId);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/cart", requireAuth, async (req, res, next) => {
    try {
      await storage.clearCart(req.user!.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Order routes
  app.post("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order items are required" });
      }

      // Calculate total amount
      const totalAmount = items.reduce((sum: number, item: any) => {
        return sum + (parseFloat(item.price) * item.quantity);
      }, 0);

      const orderData = insertOrderSchema.parse({
        userId: req.user!.id,
        totalAmount: totalAmount.toString(),
        status: "pending"
      });

      // Validate items before creating order (without orderId since it doesn't exist yet)
      const orderItemsData = items.map((item: any) => {
        // Validate that required fields are present
        if (!item.productId || !item.quantity || !item.price) {
          throw new Error("Missing required order item fields: productId, quantity, and price are required");
        }
        return {
          productId: item.productId,
          quantity: parseInt(item.quantity),
          price: item.price.toString()
        };
      });

      const order = await storage.createOrder(orderData, orderItemsData);
      
      // Clear the user's cart after successful order
      await storage.clearCart(req.user!.id);
      
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders", requireAuth, async (req, res, next) => {
    try {
      const orders = await storage.getOrdersByUser(req.user!.id);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res, next) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to user or user is admin
      if (order.userId !== req.user!.id && !req.user!.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
