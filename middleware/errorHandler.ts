import { NextApiRequest, NextApiResponse } from 'next';
import { AppError } from '../types/errors';

export function errorHandler(
  err: Error,
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Internal server error'
  });
} 