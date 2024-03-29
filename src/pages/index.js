import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { Helmet } from 'react-helmet';

import styles from '.';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Helmet>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/typesense-docsearch-css@0.3.0" />
        </Helmet>       
        <h0 className="hero__title">{siteConfig.title}</h0>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/category/getting-started">
            Getting Started Guide
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
   
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
              
      <HomepageHeader />

      <main>

        
        <HomepageFeatures />
     
      </main>
    </Layout>
  );
}
