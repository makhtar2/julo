import Banner from '@/components/Banner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
    return (
        <>
            <Banner />
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
        </>
    );
}
