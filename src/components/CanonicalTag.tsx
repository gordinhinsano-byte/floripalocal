import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

function normalizeCanonical(url: string) {
    try {
        const u = new URL(url);

        // remove query and hash
        u.search = "";
        u.hash = "";

        // force https
        u.protocol = "https:";

        // force www
        if (u.hostname === "floripalocal.com") u.hostname = "www.floripalocal.com";

        // optional: remove trailing slash except on home
        if (u.pathname !== "/" && u.pathname.endsWith("/")) {
            u.pathname = u.pathname.slice(0, -1);
        }

        return u.toString();
    } catch {
        return url;
    }
}

export const CanonicalTag = () => {
    const location = useLocation();

    // Use window.location.origin to get the base domain (e.g. localhost during dev, production domain on deploy)
    // allowing the normalization function to fix it if it matches the production domain
    const currentUrl = typeof window !== 'undefined'
        ? window.location.origin + location.pathname
        : "https://www.floripalocal.com" + location.pathname;

    const canonical = normalizeCanonical(currentUrl);

    return (
        <Helmet>
            <link rel="canonical" href={canonical} />
        </Helmet>
    );
};
