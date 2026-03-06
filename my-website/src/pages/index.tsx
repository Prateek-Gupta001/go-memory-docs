import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      {/* Scanline overlay */}
      <div className={styles.scanline} aria-hidden="true" />

      <div className={clsx('container', styles.heroInner)}>
        {/* Status badge */}
        <div className={styles.heroBadge} aria-hidden="true">
          <span className={styles.heroBadgeDot} />
          Cortex v1.0 · Online
        </div>

        {/* Title — text unchanged, styled via CSS */}
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </Heading>

        {/* Glowing divider line */}
        <div className={styles.heroDivider} aria-hidden="true" />

        {/* Tagline — text unchanged */}
        <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
          {siteConfig.tagline}
        </p>

        {/* CTA */}
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--secondary button--lg', styles.ctaButton)}
            to="/go-memory-docs/docs">
            Go over to the docs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}