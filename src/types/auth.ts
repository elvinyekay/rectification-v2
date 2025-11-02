export type Role = 'admin' | 'operator' | 'supervisor';

export interface User {
    id: string;
    name: string;
    role: Role;
}
