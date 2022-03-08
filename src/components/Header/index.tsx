import Link from 'next/link';
import Image from 'next/image';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={`${commonStyles.container} ${styles.header}`}>
      <Link href="/">
        <a className={styles.link}>
          <Image src="/logo.svg" alt="logo" width="239" height="27" />
        </a>
      </Link>
    </header>
  );
}
