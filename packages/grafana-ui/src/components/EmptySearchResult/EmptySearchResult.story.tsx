import React from 'react';

import { withCenteredStory } from '@grafana/ui/src/utils/storybook/withCenteredStory';

import { EmptySearchResult } from './EmptySearchResult';
import mdx from './EmptySearchResult.mdx';

export default {
  title: 'Visualizations/EmptySearchResult',
  component: EmptySearchResult,
  decorators: [withCenteredStory],
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const Basic = () => {
  return <EmptySearchResult>Could not find anything matching your query</EmptySearchResult>;
};
