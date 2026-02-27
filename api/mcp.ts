import type { VercelRequest, VercelResponse } from '@vercel/node';

// Vercel Streamable HTTP entry point — to be finalized during deployment setup
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ status: 'ok', server: 'brazilian-sectoral-regulations-mcp' });
}
