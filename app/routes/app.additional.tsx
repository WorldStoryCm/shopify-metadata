import { ActionFunctionArgs, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({request}: ActionFunctionArgs) => {
  const {admin} = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
  products(first: 3) {
    edges {
      node {
        id
        title
        metafields(first: 10) {
          edges {
            node {
              namespace
              key
              value
            }
          }
        }
      }
    }
  }
}
`,
  );
  const responseJson = await response.json();

  console.info('responseJson', responseJson!.data)


  return {
    products: responseJson!.data!.products,
  };
};


export default function AdditionalPage() {
  const fetcher = useFetcher<typeof action>();
  // useEffect(() => {
  //   fetcher.submit({}, { method: "POST" })
  // }, []);

  const generateProduct = () => fetcher.submit({}, {method: "POST"});

  console.info('fetcher.state', fetcher.state)

  console.info('responseJson', fetcher)

  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  return (
    <s-page heading="Additional page">
      <s-section heading="Multiple pages">
        <s-paragraph>
          Is loading: {isLoading}
        </s-paragraph>
        <s-paragraph>
          State: {fetcher.state}
        </s-paragraph>
        <s-paragraph>
          Data: {JSON.stringify(fetcher.data)}
        </s-paragraph>
        <s-button
          onClick={generateProduct}
          {...(isLoading ? {loading: true} : {})}
        >
          Generate a product
        </s-button>
      </s-section>
    </s-page>
  );
}
