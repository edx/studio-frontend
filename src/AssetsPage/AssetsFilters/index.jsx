import React from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'paragon/src/CheckBox';
import { connect } from 'react-redux';

import { filterUpdate } from '../../data/actions/assets';
import styles from './styles.scss';

const ASSET_TYPES = [
  {
    key: 'Images',
    displayName: 'Images',
  },
  {
    key: 'Documents',
    displayName: 'Documents',
  },
  {
    key: 'OTHER',
    displayName: 'Other',
  },
];

const AssetsFilters = ({ assetsParameters, updateFilter }) => (
  <ul className={styles['filter-set']}>
    {ASSET_TYPES.map(type => (
      <li key={type.key}>
        <CheckBox
          name={type.key}
          label={type.displayName}
          checked={assetsParameters[type.key]}
          onChange={checked => updateFilter(type.key, checked)}
        />
      </li>
    ))}
  </ul>
);

AssetsFilters.propTypes = {
  assetsParameters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.object]),
  ).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

const WrappedAssetsFilters = connect(
  state => ({
    assetsParameters: state.assetsParameters,
  }), dispatch => ({
    updateFilter: (filterKey, filterValue) => dispatch(filterUpdate(filterKey, filterValue)),
  }),
)(AssetsFilters);

export default WrappedAssetsFilters;
