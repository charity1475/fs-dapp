// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import moment from 'moment';
import { StatBoxList } from 'library/StatBoxList';
import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { GraphWrapper } from 'library/Graphs/Wrappers';
import { useApi } from 'contexts/Api';
import { useSubscan } from 'contexts/Subscan';
import { SubscanButton } from 'library/SubscanButton';
import { PageTitle } from 'library/PageTitle';
import { formatRewardsForGraphs } from 'library/Graphs/Utils';
import { planckBnToUnit, humanNumber } from 'Utils';
import { ActiveAccount } from './ActiveAccount';
import TotalNominatorsStatBox from './Stats/TotalNominations';
import { ActiveNominatorsStatBox } from './Stats/ActiveNominators';
import ActiveEraStatBox from './Stats/ActiveEra';
import Announcements from './Announcements';
import BalanceGraph from './BalanceGraph';
import Payouts from './Payouts';
import Reserve from './Reserve';
import Returns from './Returns';

export const Overview = () => {
  const { network } = useApi();
  const { units } = network;
  const { payouts, poolClaims } = useSubscan();

  const { lastReward } = formatRewardsForGraphs(14, units, payouts, poolClaims);

  const PAYOUTS_HEIGHT = 372;
  const STATS_HEIGHT = 118;
  const BALANCE_HEIGHT = PAYOUTS_HEIGHT + STATS_HEIGHT + 18;

  return (
    <>
      <PageTitle title="Overview" />
      <StatBoxList>
        <TotalNominatorsStatBox />
        <ActiveNominatorsStatBox />
        <ActiveEraStatBox />
      </StatBoxList>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowSecondaryWrapper hOrder={0} vOrder={0}>
          <GraphWrapper style={{ minHeight: BALANCE_HEIGHT }} flex>
            <ActiveAccount />
            <BalanceGraph />
            <Reserve />
          </GraphWrapper>
        </RowSecondaryWrapper>
        <RowPrimaryWrapper hOrder={1} vOrder={1}>
          <Returns height={STATS_HEIGHT} />
          <GraphWrapper style={{ minHeight: PAYOUTS_HEIGHT }} flex>
            <SubscanButton />
            <div className="head">
              <h4>Recent Payouts</h4>
              <h2>
                {lastReward === null
                  ? 0
                  : humanNumber(
                      planckBnToUnit(new BN(lastReward.amount), units)
                    )}
                &nbsp;{network.unit}
                &nbsp;
                <span className="fiat">
                  {lastReward === null
                    ? ''
                    : moment.unix(lastReward.block_timestamp).fromNow()}
                </span>
              </h2>
            </div>
            <Payouts />
          </GraphWrapper>
        </RowPrimaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <Announcements />
      </PageRowWrapper>
    </>
  );
};

export default Overview;
