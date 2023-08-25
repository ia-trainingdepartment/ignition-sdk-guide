/* 

This was just a test to see if i could "inject' the 
 front end docsearch adapter as described here:
https://typesense.org/docs/guide/docsearch.html#option-c-custom-docs-framework-with-docsearch-js-v3-modal-layout

The reason was that at the time (8/25/2023) I was investigating
the reason why the typesense/docusaurus theme did not add
a search bar to the SDK index page:
/home/jortega/forked_sdk_guide/jortega-ignition-sdk-guide/src/pages/index.js

The theme successfully added the searchbar for all /docs pages
But not pages at root / (ie: localhost:3000/index, localhost:3000/my-react-page etc)


It appears as if the searchbar does get injected into the DOM
at the #searchbar div.
The current issue with this implementation is when attempting
to interact with the searchbar that gets injected, the modal
that normally pops up instead gets injected into the 
body of the DOM, at the bottom of all of the docusaurus page
elements, and has undefined behavior when attempting to search

For now, I have taken out the #searchbar div from the index
but am leaving this code for future reference or possibilities
 */


import React, { useEffect } from 'react';

const Docsearch_Searchbar = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/typesense-docsearch.js@3.4';
    document.body.appendChild(script);

    script.onload = () => {
      docsearch({
        container: '#searchbar',
        typesenseCollectionName: 'ia_um',
        typesenseServerConfig: {
          nodes: [
            {
              host: 'localhost',
              port: '8108',
              protocol: 'http'
            }
          ],
          apiKey: 'C3D6X494OpD36rN1i50NMUOn3nmxslbDs4DV9eQVzfexL6hK'
        },
        typesenseSearchParameters: {
          queryBy: 'content'
        },
        placeholder: 'Explore the Ignition SDK Universe',
        resultsFooterComponent: ({ state }) => {
          return (
            <p>
              <a
                href="https://docsearch.algolia.com/apply"
                target="_blank"
                onClick={(event) => {
                  console.log(event);
                }}
              >
                {`${state.context.nbHits} hits found!`}
              </a>
            </p>
          );
        }
      });
    };
  }, []);

  return null;
};

export default Docsearch_Searchbar;
