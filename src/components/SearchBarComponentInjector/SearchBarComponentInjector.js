import React, { useEffect, useState } from 'react';
import { docsearchConfig } from './docsearch_config';
import styles from './index.module.css';

function SearchBarComponentInjector() {
  const [docSearchInjected, setDocSearchInjected] = useState(false);

  useEffect(() => {
    if (!docSearchInjected) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/typesense-docsearch.js@3.4';
      script.async = true;
      script.onload = () => {
        window.docsearch(docsearchConfig);
        setDocSearchInjected(true);
      };
      document.head.appendChild(script);
    }
  }, [docSearchInjected]);

  return (
    <div className={styles.centeredSearchBar}>
      <div id='searchbar' className={styles.searchbar}></div>
    </div>
  );
}

export default SearchBarComponentInjector;
