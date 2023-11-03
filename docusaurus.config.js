// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Ignition SDK Programmer's Guide!",
  tagline: 'Develop Ignition Modules using the Ignition Module SDK',
  url: 'https://www.sdk-docs.inductiveautomation.com/',
  baseUrl: '/',
  noIndex: true,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ia-trainingdepartment', // Usually your GitHub org/user name.
  projectName: 'ignition-sdk-guide', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //  'https://github.com/ia-trainingdepartment/ignition-sdk-guide',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ia-trainingdepartment/ignition-sdk-guide',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  //plugins: [ 
  //  [
  //    '@docusaurus/plugin-content-docs', 
  //    {
  //      id: 'ignition',
  //      path: 'test',
  //      routeBasePath: 'docs',
  //      sidebarPath: require.resolve('./sidebars.js'),
//
//      }
//
//    ]
//
 // ],
 themes: ['docusaurus-theme-search-typesense'],
 themeConfig: {
  typesense: {
    // Replace this with the name of your index/collection.
    // It should match the "index_name" entry in the scraper's "config.json" file.
    typesenseCollectionName: 'ia_um',

    typesenseServerConfig: {
      nodes: [
        {
          host: 'search.sdk-docs.inductiveautomation.com',
          port: 443,
          protocol: 'https',
        },
      ],
      apiKey: '3YKZtX5xSnPBGX97IsYGB34ClSp6rtqE',
    },

    // Optional: Typesense search parameters: https://typesense.org/docs/0.24.0/api/search.html#search-parameters
    typesenseSearchParameters: {
      queryBy:'content',
      // filter_by: 'version:=8.1' // Useful when you have versioned docs

    },
    placeholder:"Explore the Ignition SDK Universe",
    
    // Optional
    contextualSearch: true,
  },
   navbar: {
    style: 'primary',
    title: "Ignition SDK Programmer's Guide",
    logo: {
      alt: 'Ignition Logo',
      src: 'img/Logo-Ignition-Check.svg',
    },
    items: [
      //
      {
        type: 'doc',
        docId: 'intro',
        position: 'left',
        label: 'Documentation',
      },
      // {
      //   type: 'docsVersionDropdown',
      //   position: 'left',
      //   dropdownItemsAfter: [{to: '/versions', label: 'All versions'}],
      //   dropdownActiveClassDisabled: true,
      // },
      {
        href: 'https://github.com/inductiveautomation/ignition-sdk-examples',
        label: 'Example Modules',
        position: 'left',
      },
//           {
//            href: 'https://forum.inductiveautomation.com/',
//            label: 'Forums',
//            position: 'left'
//          },
      {
        href: 'https://github.com/inductiveautomation/ignition-sdk-examples/wiki/Javadocs-&-Notable-API-Changes',
        label: 'Javadocs',
        position: 'left'
      }, 
//          {
//            href: 'https://support.inductiveautomation.com/hc/en-us',
//            label: 'Support',
//            position: 'right'
//          },         
//          {
//            href: 'https://inductiveuniversity.com/', 
//            label: 'Inductive University', 
//            position: 'right'
//          },
      {
        href: 'https://github.com/ia-trainingdepartment/ignition-sdk-guide',
        label: 'GitHub',
        position: 'right',
      },
    ],
  },
  // announcementBar: {
  //   id: 'support_us',
  //   content:
  //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
  //   backgroundColor: '#fafbfc',
  //   textColor: '#091E42',
  //   isCloseable: false,
  // },
},


//   themeConfig:
//     /** @type {import('@docusaurus/preset-classic').ThemeConfig} */

//     ({
//       colorMode: {
//         defaultMode: 'light',
//         disableSwitch: true,
//       },
//       navbar: {
//         style: 'primary',
//         title: "Ignition SDK Programmer's Guide",
//         logo: {
//           alt: 'My Site Logo',
//           src: 'img/Logo-Ignition-Check.svg',
//         },
//         items: [
//           {
//             type: 'doc',
//             docId: 'intro',
//             position: 'left',
//             label: 'Documentation',
//           },
//           // {to: '/blog', label: 'How-to Articles', position: 'left'},
//           {
//             href: 'https://github.com/inductiveautomation/ignition-sdk-examples',
//             label: 'Example Modules',
//             position: 'left',
//           },
// //           {
// //            href: 'https://forum.inductiveautomation.com/',
// //            label: 'Forums',
// //            position: 'left'
// //          },
//           {
//             href: 'https://github.com/inductiveautomation/ignition-sdk-examples/wiki/Javadocs-&-Notable-API-Changes',
//             label: 'Javadocs',
//             position: 'left'
//           }, 
// //          {
// //            href: 'https://support.inductiveautomation.com/hc/en-us',
// //            label: 'Support',
// //            position: 'right'
// //          },         
// //          {
// //            href: 'https://inductiveuniversity.com/', 
// //            label: 'Inductive University', 
// //            position: 'right'
// //          },
//           {
//             href: 'https://github.com/ia-trainingdepartment/ignition-sdk-guide',
//             label: 'GitHub',
//             position: 'right',
//           },
//         ],
//       },
//       footer: {
//         style: 'dark',
//         links: [
//           {
//             title: 'Docs',
//             items: [
//               {
//                 label: 'SDK Guide',
//                 to: '/docs/intro',
//               },
//               {
//                 label: 'User Manual',
//                 href: 'https://docs.inductiveautomation.com/display/DOC81',
//               },
//             ],
//           },
//           {
//             title: 'Community',
//             items: [
//               {
//                 label: 'Stack Overflow',
//                 href: 'https://stackoverflow.com/questions/tagged/ignition',
//               },
//               {
//                 label: 'Forums',
//                 href: 'https://forum.inductiveautomation.com/',
//               },
//               {
//                 label: 'Twitter',
//                 href: 'https://twitter.com/InductiveAuto',
//               },
//             ],
//           },
//           {
//             title: 'More',
//             items: [
//               {
//                 label: 'Blog',
//                 to: '/blog',
//               },
//               {
//                 label: 'GitHub',
//                 href: 'https://github.com/ia-trainingdepartment/ignition-sdk-guide',
//               },
//             ],
//           },
//         ],
//         copyright: `Copyright © ${new Date().getFullYear()} Inductive Automation, Inc. Built with Docusaurus.`,
//       },
//       prism: {
//         theme: lightCodeTheme,
//         darkTheme: darkCodeTheme,
//       },
//     }),
};

module.exports = config;
