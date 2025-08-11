import { Request, Response } from "express";
import { RouteHandler } from "../../../types";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// Example GET handler for products
const handler: RouteHandler = {
  route: "/products",
  method: "GET",
  handler: (req: Request, res: Response): void => {
    const products: Product[] = [
      { id: 1, name: "Laptop", price: 999.99, category: "Electronics" },
      { id: 2, name: "Mouse", price: 29.99, category: "Electronics" },
      { id: 3, name: "Book", price: 19.99, category: "Education" },
    ];

    res.json({
      success: true,
      data: products,
    });
  },
};

export default handler;
