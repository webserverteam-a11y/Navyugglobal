const BASE_URL =
  "https://olivedrab-hummingbird-426242.hostingersite.com/wp-json/custom/v1";

async function fetchAPI(endpoint) {
  const response = await fetch(`${BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Export all APIs here
export const getHomepageData = () => fetchAPI("homepage");
export const getAboutPageData = () => fetchAPI("about-page");
export const getCompaniesPageData = () => fetchAPI("portfolio-page");
export const getVerticalsPageData = () => fetchAPI("verticals/211");
export const getMediaPageData = () => fetchAPI("media");
export const getBlogsData = () => fetchAPI("blogs");
export const getBlogDetails = (slug) =>
  fetchAPI(`blogs/${slug}`);
export const getContactPageData = () => fetchAPI("pitch-to-us");
export const getFooterData = () => fetchAPI("footer");