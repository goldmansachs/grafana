import React, { FC, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Page } from 'app/core/components/Page/Page';

import { GrafanaRouteComponentProps } from '../../core/navigation/types';
import { getNavModel } from '../../core/selectors/navModel';
import { StoreState } from '../../types';

import { LibraryPanelsSearch } from './components/LibraryPanelsSearch/LibraryPanelsSearch';
import { OpenLibraryPanelModal } from './components/OpenLibraryPanelModal/OpenLibraryPanelModal';
import { LibraryElementDTO } from './types';

const mapStateToProps = (state: StoreState) => ({
  navModel: getNavModel(state.navIndex, 'library-panels'),
});

const connector = connect(mapStateToProps, undefined);

interface OwnProps extends GrafanaRouteComponentProps {}

type Props = OwnProps & ConnectedProps<typeof connector>;

export const LibraryPanelsPage: FC<Props> = ({ navModel }) => {
  const [selected, setSelected] = useState<LibraryElementDTO | undefined>(undefined);

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <LibraryPanelsSearch onClick={setSelected} showSecondaryActions showSort showPanelFilter showFolderFilter />
        {selected ? <OpenLibraryPanelModal onDismiss={() => setSelected(undefined)} libraryPanel={selected} /> : null}
      </Page.Contents>
    </Page>
  );
};

export default connect(mapStateToProps)(LibraryPanelsPage);
