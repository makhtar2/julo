'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addRating({ productId, rating, review }) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: 'Veuillez vous connecter pour laisser un avis.' };

    try {
        // Check if user already rated this product
        const { data: existingRating } = await supabase
            .from('Rating')
            .select('id')
            .eq('userId', user.id)
            .eq('productId', productId)
            .single();

        if (existingRating) {
            return { error: 'Vous avez déjà évalué ce produit.' };
        }

        const { error } = await supabase.from('Rating').insert([
            {
                userId: user.id,
                productId,
                rating,
                review,
            },
        ]);

        if (error) throw error;

        revalidatePath(`/product/${productId}`);
        revalidatePath(`/shop`);

        return { success: 'Merci pour votre avis !' };
    } catch (error) {
        console.error('Add rating error:', error);
        return { error: "Une erreur est survenue lors de l'enregistrement de votre avis." };
    }
}
