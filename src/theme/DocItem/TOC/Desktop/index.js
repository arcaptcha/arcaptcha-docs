import React from 'react';
import DocItemTOCDesktop from '@theme-original/DocItem/TOC/Desktop';
import AgentBox from '@site/src/components/AgentBox';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocItemTOCDesktopWrapper(props) {
  const doc = useDoc();
  return (
    <div className={clsx(styles.desktopTOCContainer, 'thin-scrollbar')}>
      <DocItemTOCDesktop {...props} />
      <AgentBox doc={doc} />
    </div>
  );
}

