'use client';

import Head from 'next/head';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'product';
    structuredData?: any;
}

export function SEOHead({
    title = 'ElectroFurni Pickup - Best Prices for Electronics & Furniture | Mumbai',
    description = 'Get the best prices for your old electronics and furniture. Free doorstep pickup service in Mumbai. Instant quotes, hassle-free process. Contact us today!',
    keywords = 'electronics pickup, furniture pickup, sell old electronics, sell furniture, Mumbai, best prices, doorstep pickup, instant quotes',
    image = 'https://placehold.co/1200x630/png?text=ElectroFurni+Pickup',
    url = process.env.NEXT_PUBLIC_BASE_URL || 'https://electrofurni.com',
    type = 'website',
    structuredData,
}: SEOHeadProps) {
    const fullTitle = title.includes('ElectroFurni') ? title : `${title} | ElectroFurni Pickup`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="author" content="ElectroFurni Pickup" />
            <meta name="language" content="en" />
            <meta name="revisit-after" content="7 days" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content="ElectroFurni Pickup" />
            <meta property="og:locale" content="en_IN" />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@electrofurni" />
            <meta name="twitter:creator" content="@electrofurni" />

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="msapplication-TileColor" content="#2563eb" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="ElectroFurni" />

            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Preconnect to external domains */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://wa.me" />

            {/* DNS Prefetch */}
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="dns-prefetch" href="//fonts.gstatic.com" />

            {/* Structured Data */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            )}

            {/* Additional SEO Scripts */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LocalBusiness",
                        "name": "ElectroFurni Pickup",
                        "description": "Best prices for electronics and furniture pickup service in Mumbai",
                        "url": url,
                        "telephone": "+919876543210",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "123 Business Street, Andheri East",
                            "addressLocality": "Mumbai",
                            "addressRegion": "Maharashtra",
                            "postalCode": "400093",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "19.1136",
                            "longitude": "72.8697"
                        },
                        "openingHours": "Mo-Su 09:00-21:00",
                        "priceRange": "$$",
                        "paymentAccepted": "Cash, UPI, Bank Transfer",
                        "currenciesAccepted": "INR",
                        "areaServed": {
                            "@type": "City",
                            "name": "Mumbai"
                        },
                        "serviceType": "Electronics and Furniture Pickup Service",
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Electronics and Furniture",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Product",
                                        "name": "Electronics"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Product",
                                        "name": "Furniture"
                                    }
                                }
                            ]
                        }
                    }),
                }}
            />
        </Head>
    );
}
