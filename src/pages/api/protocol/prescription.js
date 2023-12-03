// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prescriptionProtocolDefinition } from '@/protocols/prescription';
export default function handler(req, res) {
  res.status(200).json(prescriptionProtocolDefinition)
}
