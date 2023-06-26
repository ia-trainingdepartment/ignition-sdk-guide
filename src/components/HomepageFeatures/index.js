import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'SDK Guide',
    Svg: require('@site/static/img/SDK-Guide-Icon.svg').default,
    description: (
      <>
        Learn how to use the <a href="docs/intro">Ignition Software Development Kit</a> to build your own modules.
      </>
    ),
  },
 // {
  //  title: 'Inductive University Course',
  //  Svg: require('@site/static/img/Logo-IU-IconOnly.svg').default,
  //  description: (
  //    <>
  //      Take our <a href="https://inductiveuniversity.com/">Inductive University course</a> to learn about the parts that make up a <code>.modl</code> file and get started with a simple first project.
  //    </>
  //  ),
 // },
  {
    title: 'Module Examples',
    Svg: require('@site/static/img/Module-Examples-Icon.svg').default,
    description: (
      <>
         Browse <a href="https://github.com/inductiveautomation/ignition-sdk-examples">Ignition SDK example projects</a> including Perspective and Vision components, an OPC UA device, and more.
      </>
    ),
  },
  {
    title: 'Ignition Module Development Community',
    Svg: require('@site/static/img/SDK-Guide-Icon.svg').default,
    description: (
      <>
         Join <a href="https://github.com/IgnitionModuleDevelopmentCommunity">the open source community</a> for Ignition module development.
      </>
    ),
  },
  {
    title: 'Module Development Forum',
    Svg: require('@site/static/img/Module-Development-Forum-Icon.svg').default,
    description: (
      <>
         Connect with other community developers <a href="https://forum.inductiveautomation.com/c/module-development/7">on the Ignition Module Development Forum.</a>  
      </>
    ),
  },
  {
    title: 'Java API Docs',
    Svg: require('@site/static/img/Java-API-Docs-Icon.svg').default,
    description: (
      <>
        Reference the <a href="https://github.com/inductiveautomation/ignition-sdk-examples/wiki/Javadocs-&-Notable-API-Changes">Ignition Javadocs</a> and review notable API changes.
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
