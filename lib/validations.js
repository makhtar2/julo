import { z } from 'zod';

export const phoneRegex = /^(77|78|76|70|75|33)\d{7}$/;

export const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/\./g, '').replace(/-/g, '');
    const phoneToTest = cleanPhone.startsWith('221') ? cleanPhone.slice(3) : cleanPhone;
    return phoneRegex.test(phoneToTest);
};

export const registerSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
    email: z.string().email("Format d'email invalide"),
    phone: z.string().min(8, 'Numéro de téléphone invalide').max(20).optional(),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export const loginSchema = z.object({
    email: z.string().email("Format d'email invalide"),
    password: z.string().min(1, 'Mot de passe requis'),
});

export const productSchema = z.object({
    name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
    description: z
        .string()
        .min(10, 'La description doit contenir au moins 10 caractères')
        .max(2000),
    mrp: z.number().positive('Le prix de base doit être positif'),
    price: z.number().positive('Le prix de vente doit être positif'),
    categoryId: z.string().uuid('Catégorie invalide'),
    stock: z.number().int().nonnegative('Le stock ne peut pas être négatif'),
    images: z.array(z.string()).min(1, 'Veuillez ajouter au moins une image'),
    guarantee: z.string().max(50).optional(),
});

export const updateProductSchema = productSchema.partial();
