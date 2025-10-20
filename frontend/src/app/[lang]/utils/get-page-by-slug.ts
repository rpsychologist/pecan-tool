import {fetchAPI} from "@/app/[lang]/utils/fetch-api";

export async function getPageBySlug(slug: string, lang: string) {
    const token = process.env.STRAPI_API_TOKEN;

    const path = `/pages`;
    const urlParamsObject = {filters: {slug}, locale: lang};
    const options = {headers: {Authorization: `Bearer ${token}`}};
    return await fetchAPI(path, urlParamsObject, options);
}