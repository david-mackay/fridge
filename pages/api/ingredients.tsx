import { NextApiRequest, NextApiResponse } from 'next';

const ingredients = [
  { id: 1, name: 'Milk', quantity: '1L', expiryDate: '2023-06-30' },
  { id: 2, name: 'Eggs', quantity: '12', expiryDate: '2025-07-15' },
  { id: 3, name: 'Cheese', quantity: '200g', expiryDate: '2025-07-20' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  switch (method) {
    case 'GET':
      const unexpiredIngredients = ingredients.filter((ingredient) => {
        const expiryDate = new Date(ingredient.expiryDate);
        const today = new Date();
        return expiryDate > today;
      });
      res.status(200).json(unexpiredIngredients);
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}