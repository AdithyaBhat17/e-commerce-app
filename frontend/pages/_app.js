import Page from "../components/Page";
import NProgress from "nprogress";
import Router from "next/router";
import "../components/styles/nprogress.css";

import { ApolloProvider } from "@apollo/client";
import withData from "../lib/withData";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    // if any pages have getInitialProps, go and fetch the data using its queries.
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query; // allows us to access any query variables.
  return { pageProps };
};

export default withData(MyApp);
