import React from 'react';
import Layout from '@theme/Layout';
import { Helmet } from 'react-helmet';
import { docsearchConfig } from './docsearch_config'; // Adjust the path as needed



export default function MyReactPage() {
  return (
    <Layout>
      <Helmet>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/typesense-docsearch-css@0.3.0" />
        <script src="https://cdn.jsdelivr.net/npm/typesense-docsearch.js@3.4"></script>
		<script src="./docsearch_config.js"></script>
		<script>
          {`
            window.addEventListener('load', function() {
              docsearch(${JSON.stringify(docsearchConfig)});
            });
          `}
        </script>
      </Helmet>
      <h1>My React page</h1>
      <p>This is a React page!</p>
	  <div id="searchbar">test</div>
    </Layout>
  );
}