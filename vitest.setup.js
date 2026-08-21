// Les tests "lib" tournent en environnement node (pas de DOM) : ce setup
// ne s'applique qu'aux tests de composants qui tournent en jsdom.
if (typeof window !== 'undefined') {
    await import('@testing-library/jest-dom');

    // Mock IntersectionObserver for framer-motion viewport features
    class IntersectionObserverMock {
        constructor(callback) {
            this.callback = callback;
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
    }

    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: IntersectionObserverMock,
    });

    Object.defineProperty(global, 'IntersectionObserver', {
        writable: true,
        configurable: true,
        value: IntersectionObserverMock,
    });
}
