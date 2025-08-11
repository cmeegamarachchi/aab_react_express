import { Request, Response } from 'express';
import { RouteHandler } from '../../../types';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

const handlers: RouteHandler[] = [
  {
    route: '/users',
    method: 'GET',
    handler: (req: Request, res: Response): void => {
      const users: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ];
      res.json({ success: true, data: users });
    },
  },
  {
    route: '/users',
    method: 'POST',
    handler: (req: Request<{}, {}, CreateUserRequest>, res: Response): void => {
      const { name, email } = req.body;
      if (!name || !email) {
        res.status(400).json({
          success: false,
          error: 'Name and email are required',
        });
        return;
      }
      const newUser: User = {
        id: Date.now(),
        name,
        email,
        createdAt: new Date().toISOString(),
      };
      res.status(201).json({ success: true, data: newUser });
    },
  },
  {
    route: '/users/:id',
    method: 'DELETE',
    handler: (req: Request<{ id: string }>, res: Response): void => {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }
      res.json({
        success: true,
        message: `User ${userId} deleted successfully`,
      });
    },
  },
];

export default handlers;
