import qs from "qs";
import { getStrapiURL } from "./api-helpers";

const CF_ACCESS_CLIENT_ID = process.env.CF_ACCESS_CLIENT_ID
const CF_ACCESS_CLIENT_SECRET = process.env.CF_ACCESS_CLIENT_SECRET
function deepMerge(target, source) {
  const filteredSource = source
  for (const key in filteredSource) {
    // Check if the property is an object, and exists in both target and source
    if (filteredSource[key] instanceof Object && key in target) {
      // Recursively merge both objects
      Object.assign(filteredSource[key], deepMerge(target[key], filteredSource[key]));
    }
  }
  // Merge source into target
  return Object.assign(target || {}, filteredSource);
}
export async function fetchAPI(
  path: string,
  urlParamsObject = {},
  options = {}
) {
  try {
    // Merge default and user options
    let headers = {
      "Content-Type": "application/json",
    }
    if (CF_ACCESS_CLIENT_ID && CF_ACCESS_CLIENT_SECRET) {
      headers = {
        ...headers,
        "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET
      }
    }
    const mergedOptions = deepMerge({
      next: { revalidate: 0 },
      headers: headers
    },
      options
    );

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`;

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions);
  const data = await response.json();
  return data;

} catch (error) {
  console.error(error);
  throw new Error(`Please check if your server is running and you set all the required tokens.`);
}
}
