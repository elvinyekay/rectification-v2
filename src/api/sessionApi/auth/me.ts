import type { VercelRequest, VercelResponse } from '@vercel/node';
import { mockUsers } from '../_data/mockUsers';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '');

    const match = token.match(/^mock-token:(.+)$/);
    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    const userId = match[1];
    const u = mockUsers.find(x => x.id === userId);
    if (!u) return res.status(401).json({ message: 'Unauthorized' });

    return res.status(200).json({ id: u.id, name: u.name, role: u.role });
}
