export class User {
    id?: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    password: string;
    // relaciones (opcional, pueden ser cargadas mediante include en Prisma)
    declarations?: any[];
    operations?: any[];
}

