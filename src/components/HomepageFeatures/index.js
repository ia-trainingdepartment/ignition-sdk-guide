import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'SDK Guide',
    Svg: require('@site/static/img/Logo-IA-Gear.svg').default,
    description: (
      <>
        Learn how to use the <a href="docs/intro">Ignition Software Development Kit</a> to build your own modules.
      </>
    ),
  },
  {
    title: 'Inductive University Course',
    Svg: require('@site/static/img/Logo-IU.svg').default,
    description: (
      <>
        Take our <a href="https://inductiveuniversity.com/">Inductive University course</a> to learn about the parts that make up a <code>.modl</code> file and get started with a simple first project.
      </>
    ),
  },
  {
    title: 'Module Examples',
    Svg: require('@site/static/img/hex5.svg').default,
    description: (
      <>
         Browse <a href="https://github.com/inductiveautomation/ignition-sdk-examples">Ignition SDK example projects</a> on GitHub. 
      </>
    ),
  },
  {
    title: 'Ignition Exchange',
    Svg: require('@site/static/img/Logo-IgnitionExchange-Center.svg').default,
    description: (
      <>
         Discover, share, and download <a href="https://www.inductiveautomation.com/exchange/">community-made Ignition resources</a> in collaboration with your organization or the Ignition community. 
      </>
    ),
  },
  {
    title: 'Module Development Forum',
    Svg: require('@site/static/img/Logo-InductiveConversations-IconOnly.svg').default,
    description: (
      <>
         Connect with other community developers <a href="https://forum.inductiveautomation.com/c/module-development/7">on the Ignition Module Development Forum.</a>  
      </>
    ),
  },
  {
    title: 'Java API Docs',
    Svg: require('@site/static/img/java.svg').default,
    description: (
      <>
        Reference <a href="https://github.com/inductiveautomation/ignition-sdk-examples/wiki/Javadocs-&-Notable-API-Changes">Ignition Javadocs</a> and notable API changes.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
