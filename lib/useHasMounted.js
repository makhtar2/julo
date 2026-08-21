'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Détecte si le composant a fini de s'hydrater côté client, sans passer par
 * un setState dans un useEffect (évite le rendu en cascade et satisfait
 * react-hooks/set-state-in-effect).
 */
export function useHasMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}
