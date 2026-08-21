'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { registerSchema, loginSchema } from '@/lib/validations';

export async function register(formData) {
    // Validate input
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const { name, phone, password, email: rawEmail } = validation.data;
    const email = rawEmail.toLowerCase().trim();

    const supabase = await createClient();

    try {
        // Inscription dans Supabase Auth.
        // Le trigger SQL s'occupera de créer l'entrée dans la table publique "User".
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    phone: phone,
                },
            },
        });

        if (authError) throw authError;

        // Si les identities sont vides, cela signifie que l'utilisateur existe déjà
        if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
            return {
                error: 'Cet email est déjà utilisé. Veuillez vous connecter ou réinitialiser votre mot de passe.',
            };
        }

        return { success: 'Compte créé avec succès ! Connectez-vous.' };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            error: `Erreur: ${error.message || "Une erreur est survenue lors de l'inscription."}`,
        };
    }
}

export async function signInWithMagicLink(email) {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_BASE_URL || '';

    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: email.toLowerCase().trim(),
            options: {
                emailRedirectTo: `${origin}/api/auth/callback`,
            },
        });

        if (error) throw error;
        return { success: 'Lien magique envoyé ! Vérifiez votre boîte mail.' };
    } catch (error) {
        console.error('Magic link error:', error);
        return { error: error.message || "Erreur lors de l'envoi du lien magique." };
    }
}

export async function login(values) {
    // Validate input
    const validation = loginSchema.safeParse(values);
    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const { email: rawEmail, password } = validation.data;
    const email = rawEmail.toLowerCase().trim();

    const supabase = await createClient();

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Supabase Auth Error:', error.message, error.code);

            if (error.message.includes('Invalid login credentials')) {
                return { error: 'Email ou mot de passe incorrect.' };
            }
            if (error.message.includes('Email not confirmed')) {
                return { error: 'Veuillez confirmer votre email avant de vous connecter.' };
            }
            return { error: error.message };
        }

        // Fetch profile for UI/Role check
        const { data: profile } = await supabase
            .from('User')
            .select('role')
            .eq('id', data.user.id)
            .single();

        revalidatePath('/', 'layout');
        return { success: true, user: data.user, role: profile?.role || 'USER' };
    } catch (error) {
        console.error('Login action error:', error);
        return { error: 'Une erreur est survenue lors de la connexion.' };
    }
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
}

export async function getUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase.from('User').select('*').eq('id', user.id).single();

    return { ...user, ...profile };
}
