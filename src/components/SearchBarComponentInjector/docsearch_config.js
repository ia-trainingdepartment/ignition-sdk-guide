export const docsearchConfig = {
	container: '#searchbar',
	typesenseCollectionName: 'ia_um', // Should match the collection name you mention in the docsearch scraper config.js
	typesenseServerConfig: {
	  nodes: [{
		host: 'localhost', // For Typesense Cloud use xxx.a1.typesense.net
		port: '8108',      // For Typesense Cloud use 443
		protocol: 'http'   // For Typesense Cloud use https
	  }],
	  apiKey: 'C3D6X494OpD36rN1i50NMUOn3nmxslbDs4DV9eQVzfexL6hK', // Use API Key with only Search permissions
	},
	typesenseSearchParameters: { // Optional.
  
	  queryBy: 'content'
	  // filter_by: 'version_tag:=0.21.0' // Useful when you have versioned docs
	},
	placeholder:"Explore the Ignition SDK Universe",
	  // resultsFooterComponent({ state }) {
	  // 	return {
	  // 		// The HTML `tag`
	  // 		type: 'p',
	  // 		ref: undefined,
	  // 		constructor: undefined,
	  // 		key: state.query,
	  // 		// Its props
	  // 		props: {
	  // 			href: 'https://docsearch.algolia.com/apply',
	  // 			target: '_blank',
	  // 			onClick: (event) => {
	  // 			console.log(event);
	  // 			},
	  // 			// Raw text rendered in the HTML element
	  // 			children: `${state.context.nbHits} hits found!`,
	  // 		},
	  // 		__v: null,
	  // 	};
	  // },

};
