import {User} from "../../../types/auth.ts";


type MockUser = User & {email: string, password: string};

export const mockUsers: MockUser[] = [
    { id: 'u1', name: 'Admin',      role: 'admin',      email: 'admin@demo.az',      password: 'admin123' },
    { id: 'u2', name: 'Operator 1',   role: 'operator',   email: 'operator@demo.az',   password: 'op123' },
    { id: 'u3', name: 'Nəzarətçi1', role: 'supervisor', email: 'supervisor@demo.az', password: 'sup123' },
];