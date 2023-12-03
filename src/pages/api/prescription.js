// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import PRESCRIPTION_SCHEMA from '@/schemas/prescription.json';
export default function handler(req, res) {
  res.status(200).json(PRESCRIPTION_SCHEMA)
}
