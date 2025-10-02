import { apiService } from '@/lib/api';
import SubcategoryClientPage from './subcategory-client-page';

// This function runs at build time to pre-render dynamic routes
export async function generateStaticParams() {
  try {
    // Hardcoded fallback subcategories
    const hardcodedSlugs: string[] = ["sofas", "beds", "chairs", "dining-tables", "refrigerators", "washing-machines", "air-conditioners", "televisions", "computers", "mobiles", "speakers", "home-theaters", "microwave-ovens", "mixers-grinders", "fans", "heaters", "geysers-water-heaters", "vacuum-cleaners", "robotic-vacuum-cleaners", "wall-clocks", "watches", "wooden-cabinets-storage", "cooling-machines"];

    // Attempt to fetch subcategories from the API
    let apiSubcategorySlugs: string[] = [];
    try {
      console.log('Attempting to fetch subcategories from API for generateStaticParams...');
      const response = await apiService.getSubcategory(); 
      console.log('API Response for getSubcategory:', JSON.stringify(response, null, 2));
      const products = response.data || [];
      console.log('Products from API:', JSON.stringify(products.map(p => p.name), null, 2));
      apiSubcategorySlugs = Array.from(new Set(products.map(product => product.subcategorySlug)));
      console.log('API Subcategory Slugs:', apiSubcategorySlugs);
    } catch (apiError) {
      console.error('API call for generateStaticParams failed:', apiError);
    }

    // Combine hardcoded and API-fetched slugs, then deduplicate
    const allSubcategorySlugs = Array.from(new Set([...hardcodedSlugs, ...apiSubcategorySlugs]));
    console.log('All Subcategory Slugs for static generation:', allSubcategorySlugs);

    return allSubcategorySlugs.map((slug) => ({
      subcategory: slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return []; // Return an empty array to avoid build failures
  }
}

export default function SubcategoryServerPage({ params }: { params: { subcategory: string } }) {
  return <SubcategoryClientPage subcategorySlug={params.subcategory} />;
}
