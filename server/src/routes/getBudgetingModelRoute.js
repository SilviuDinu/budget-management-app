import jwt from 'jsonwebtoken';
import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';

export const setBudgetingModelRoute = {
  path: '/api/users/:userId/get-budgeting-plan/',
  method: 'get',
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    if (!authorization) {
      return res.status(401).json({ message: 'No auth token sent' });
    }

    const token = authorization.includes('Bearer')
      ? authorization.split(' ')[1]
      : authorization;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unable to verify token' });
      }

      const { id, isVerified } = decoded;

      if (id !== userId) {
        return res
          .status(403)
          .json({ message: "Not allowed to update this users's data" });
      }

      if (!isVerified) {
        return res
          .status(403)
          .json({
            message:
              'You need to verify your email before you can update your data',
          });
      }

      const db = getDbConnection('react-auth-db');

      const result = await db
        .collection('users')
        .findOne({ _id: ObjectID(userId) });

      if (!result || !result.budgetingPlan?.length) {
        res.status(404).json({ message: 'User or plan not found' });
        return;
      }

      if (result.ok && result.value) {
        res
          .status(200)
          .json({
            status: 'Budgeting plan retrieved successfully',
            budgetingPlan: result.budgetingPlan,
          });
        return;
      }

      res.status(500).json({
        message: 'Could not update or insert record',
      });
    });
  },
};
