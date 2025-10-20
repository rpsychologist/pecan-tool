import Network from "./components/network"
import { fetchAPI } from "@/app/[lang]/utils/fetch-api";

async function getNodes(lang: string, role: string) {
  const token = process.env.STRAPI_API_TOKEN;

  const path = `/nodes`;
  const urlParamsObject = {
    locale: lang,
    pagination: { limit: -1 },
    populate: {
      nodeClarification: true,
      overrides: {
        filters: {
          customRole: { roleId: { $eq: role || "" } }
        },
        populate: {
          customRole: true
        }
      }
    }
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return await fetchAPI(path, urlParamsObject, options);
}

async function getNetworkConfig(lang: string) {
  const token = process.env.STRAPI_API_TOKEN;

  const path = `/network-config`;

  const urlParamsObject = {
    locale: lang,
  };
  const options = { headers: { Authorization: `Bearer ${token}` } };
  return await fetchAPI(path, urlParamsObject, options);
}
async function getNetwork(id: string) {
  const token = process.env.STRAPI_API_TOKEN;

  const path = `/networks/${id}`;
  const urlParamsObject = {};
  const options = {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    next: { revalidate: 0 }
  };
  return await fetchAPI(path, urlParamsObject, options);
}
export default async function NetworkPage({ params, searchParams }: { params: { lang: string }, searchParams: any }) {
  const data = await getNodes(params.lang, searchParams?.role)
  let savedNetwork
  const networkConfigData = await getNetworkConfig(params.lang)
  if (searchParams?.id) {
    savedNetwork = await getNetwork(searchParams?.id)
  }
  return (
    <div>
      <Network 
        nodes={data.data} 
        savedNetwork={savedNetwork} 
        lang={params.lang} 
        config={networkConfigData?.data?.attributes} 
        />
    </div>
  );
}

const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE
export const dynamic = NEXT_DEMO_MODE ? 'force-static' : 'force-dynamic'