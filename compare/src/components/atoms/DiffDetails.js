import React from 'react';
import styled from 'styled-components';
import { colors, fonts } from '../../styles';

const Row = styled.div`
  padding: 5px 0;
`;

const Label = styled.span`
  font-family: ${fonts.latoRegular};
  color: ${colors.secondaryText};
  font-size: 14px;
  padding-right: 8px;
`;

const Value = styled.span`
  font-family ${fonts.latoBold};
  color: ${colors.primaryText};
  font-size: 14px;
  padding-right: 20px;
`;

export default class DiffDetails extends React.Component {
  render() {
    let { diff, settings } = this.props;
    if (!diff) {
      return null;
    }

    return (
      <Row hidden={!settings.textInfo}>
        <Label>diff%: </Label>
        <Value>{diff.misMatchPercentage}</Value>
        <Label>diff-x: </Label>
        <Value>{diff.dimensionDifference.width}</Value>
        <Label>diff-y: </Label>
        <Value>{diff.dimensionDifference.height}</Value>
      </Row>
    );
  }
}
