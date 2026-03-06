import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/python.svg').default,
    description: (
      <>
        Go Memory is super easy to install and self host. Use our Python SDK to provide memory to your existing workflows!
      </>
    ),
  },
  {
    title: 'Lightning Fast Retrieval Speeds',
    Svg: require('@site/static/img/speed.svg').default,
    description: (
      <>
      Go Memory's read pipeline is lightining fast and provides sub-100ms retrieval speeds. 
      </>
    ),
  },
  {
    title: 'Continual Learning',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Go Memory takes in latest/newer context and prunes/updates existing memory based on that. 
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
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
