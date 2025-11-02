import type { VercelRequest, VercelResponse } from '@vercel/node';
import { mockUsers } from '../_data/mockUsers.ts';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
    const u = mockUsers.find(x => x.email === email && x.password === password);
    if (!u) return res.status(401).json({ message: 'Email və ya parol səhvdir' });

    const token = `mock-token:${u.id}`;

    return res.status(200).json({
        token,
        user: { id: u.id, name: u.name, role: u.role },
    });
}
