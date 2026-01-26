import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

export const CanonicalTag = () => {
    const location = useLocation();

    // Ensure we are using the preferred domain
    const baseUrl = "https://www.floripalocal.com";

    // Remove query parameters and trailing slashes for canonical URL
    const pathname = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
    const canonicalUrl = `${baseUrl}${pathname}`;

    return (
        <Helmet>
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:url" content={canonicalUrl} />
        </Helmet>
    );
};
