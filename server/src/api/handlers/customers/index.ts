import { Request, Response } from "express";
import { RouteHandler } from "../../../types";
import customers from "./customers"; // Assuming customers is an array of customer objects

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  street_address: string;
  city: string;
  country: string;
  signed_on_date: string;
}

interface CreateCustomerRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  street_address: string;
  city: string;
  country: string;
  signed_on_date: string;
}

const handlers: RouteHandler[] = [
  {
    route: "/customers",
    method: "GET",
    handler: (req: Request, res: Response): void => {
      res.json(customers);
    },
  },
  {
    route: "/customers/:id",
    method: "PUT",
    handler: (req: Request<{ id: string }>, res: Response): void => {
      const customer = customers.find((c) => c.id === req.params.id);
      if (!customer) {
        res.status(404).json({ success: false, error: "Customer not found" });
        return;
      }
      const { first_name, last_name, email, street_address, city, country, signed_on_date } = req.body;
      if (!first_name || !last_name || !email || !street_address || !city || !country || !signed_on_date) {
        res.status(400).json({
          success: false,
          error: "All fields are required",
        });
        return;
      }
      Object.assign(customer, req.body);
      res.json({ success: true, data: customer });
    },
  },
  {
    route: "/customers",
    method: "POST",
    handler: (req: Request<{}, {}, CreateCustomerRequest>, res: Response): void => {
      const { first_name, last_name, email, street_address, city, country, signed_on_date } = req.body;
      if (!first_name || !last_name || !email || !street_address || !city || !country || !signed_on_date) {
        res.status(400).json({
          success: false,
          error: "All fields are required",
        });
        return;
      }
      const newCustomer: Customer = {
        id: `customer_${Date.now()}`,
        first_name,
        last_name,
        email,
        street_address,
        city,
        country,
        signed_on_date,
      };

      customers.push(newCustomer);

      res.status(201).json({ success: true, data: newCustomer });
    },
  }
];

export default handlers;
