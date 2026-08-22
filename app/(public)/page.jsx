import BestSelling from '@/components/BestSelling';
import Hero from '@/components/Hero';
import Newsletter from '@/components/Newsletter';
import OurSpecs from '@/components/OurSpec';
import LatestProducts from '@/components/LatestProducts';
import Faq from '@/components/Faq';
import { getProducts } from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';
import { getActiveBanners } from '@/app/actions/banner';

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function Home() {
    const [{ products }, { categories }, { banners }] = await Promise.all([
        getProducts(),
        getCategories(),
        getActiveBanners(),
    ]);

    const categoriesList = categories?.map((c) => c.name) || [];

    return (
        <div className="bg-white text-zinc-900">
            <Hero initialCategories={categoriesList} initialBanners={banners || []} />
            <LatestProducts products={products} />
            <BestSelling products={products} />
            <OurSpecs />
            <Faq />
            <Newsletter />
        </div>
    );
}
