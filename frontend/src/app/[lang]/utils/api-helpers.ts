export function getStrapiURL(path = '', internal = false) {
    return `${process.env.NEXT_INTERNAL_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}
const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE
export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    if(NEXT_DEMO_MODE) {
        return url
    } else return `${getStrapiURL()}${url}`;
    // Otherwise prepend the URL path with the Strapi URL

}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ADDS DELAY TO SIMULATE SLOW API REMOVE FOR PRODUCTION
export const delay = (time: number) => new Promise((resolve) => setTimeout(() => resolve(1), time));
