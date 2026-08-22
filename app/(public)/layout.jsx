import Banner from '@/components/Banner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
    return (
        <>
            <Banner />
            <Navbar />
            <main id="main-content" className="pb-20 sm:pb-0 min-h-[calc(100vh-80px)]">
                {children}
            </main>
            <Footer />
        </>
    );
}
