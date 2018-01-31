import * as reducers from './assets';
import { assetActions } from '../../data/constants/actionTypes';
import { assetLoading } from '../../data/constants/loadingTypes';
import { getAssetAPIAttributeFromDatabaseAttribute } from '../../utils/getAssetsAttributes';
import { getDefaultFilterState } from '../../utils/getAssetsFilters';

let action;
let defaultState;
let state;

describe('Assets Reducers', () => {
  describe('assets reducer', () => {
    it('returns correct assets state for REQUEST_ASSETS_SUCCESS action', () => {
      defaultState = {};

      action = {
        type: assetActions.request.REQUEST_ASSETS_SUCCESS,
        response: {
          assets: [
            { id: 'asset1' },
            { id: 'asset2' },
            { id: 'asset3' },
          ],
        },
      };

      state = reducers.assets(defaultState, action);

      expect(state).toEqual(action.response.assets);
    });
    it('returns correct assets state for REQUEST_ASSETS_FAILURE action', () => {
      defaultState = [
        { id: 'asset4' },
      ];

      action = {
        type: assetActions.request.REQUEST_ASSETS_FAILURE,
        previousState: {
          assets: [
            { id: 'asset1' },
            { id: 'asset2' },
            { id: 'asset3' },
          ],
        },
      };

      state = reducers.assets(defaultState, action);

      expect(state).toEqual(action.previousState);
    });
    it('returns correct assets state for TOGGLE_LOCK_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1', loadingFields: [] },
          { id: 'asset2', loadingFields: [assetLoading.LOCK] },
          { id: 'asset3', loadingFields: [] },
        ],
      };

      // deep copy over the old state and change data appropriately to reflect new state
      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [];
      newState[1].locked = true;

      action = {
        asset: { id: 'asset2' },
        type: assetActions.lock.TOGGLE_LOCK_ASSET_SUCCESS,
      };

      state = reducers.assets(defaultState.assets, action);

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for TOGGLING_LOCK_ASSET_FAILURE action', () => {
      defaultState = {
        assets: [
          { id: 'asset1', loadingFields: [] },
          { id: 'asset2', loadingFields: [assetLoading.LOCK] },
          { id: 'asset3', loadingFields: [] },
        ],
      };

      action = {
        assetId: 'asset2',
        type: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE,
      };

      // deep copy over the old state and change data appropriately to reflect new state
      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [];

      state = reducers.assets(defaultState.assets, action);

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for TOGGLING_LOCK_ASSET_SUCCESS action', () => {
      defaultState = {
        assets: [
          { id: 'asset1' },
          { id: 'asset2' },
          { id: 'asset3' },
        ],
      };

      action = {
        asset: {
          id: 'asset2',
        },
        type: assetActions.lock.TOGGLING_LOCK_ASSET_SUCCESS,
      };

      const newState = defaultState.assets.map(asset => ({ ...asset }));
      newState[1].loadingFields = [assetLoading.LOCK];

      state = reducers.assets(defaultState.assets, action);

      expect(state).toEqual(newState);
    });
    it('returns correct assets state for DELETE_ASSET_FAILURE action', () => {
      defaultState = [];

      action = {
        type: assetActions.delete.DELETE_ASSET_FAILURE,
      };

      state = reducers.assets(defaultState, action);

      expect(state).toEqual([]);
    });
  });
  describe('metadata reducer', () => {
    describe('filter reducer', () => {
      beforeEach(() => {
        defaultState = reducers.filtersInitial;
      });

      it('returns correct assetTypes state on REQUEST_ASSETS_SUCCESS action', () => {
        const assetFilters = {
          Images: true,
        };

        action = {
          response: {
            assetTypes: Object.keys(assetFilters),
          },
          type: assetActions.request.REQUEST_ASSETS_SUCCESS,
        };

        state = reducers.filters(defaultState, action);

        expect(state).toEqual({
          ...defaultState,
          assetTypes: { ...defaultState.assetTypes, ...assetFilters },
        });
      });
      it('returns correct assetTypes state on FILTER_UPDATE_FAILURE action', () => {
        const newAssetFilters = {
          Documents: true,
        };

        let newState = {
          assetTypes: {
            ...defaultState.assetTypes,
            ...newAssetFilters,
          },
        };
        newState = { ...defaultState, ...newState };

        action = {
          previousState: {
            ...newState,
          },
          type: assetActions.filter.FILTER_UPDATE_FAILURE,
        };

        state = reducers.filters(defaultState, action);

        expect(state).toEqual({
          ...newState,
        });
      });
      it('returns correct assetTypes state on CLEAR_FILTERS_FAILURE action', () => {
        const newAssetFilters = {
          Documents: true,
        };

        let newState = {
          assetTypes: {
            ...defaultState.assetTypes,
            ...newAssetFilters,
          },
        };
        newState = { ...defaultState, ...newState };

        action = {
          previousState: {
            ...newState,
          },
          type: assetActions.clear.CLEAR_FILTERS_FAILURE,
        };

        state = reducers.filters(defaultState, action);

        expect(state).toEqual({
          ...newState,
        });
      });
    });
    describe('pagination reducer', () => {
      beforeEach(() => {
        defaultState = reducers.paginationInitial;
      });
      it('returns correct pagination state on REQUEST_ASSETS_SUCCESS action', () => {
        action = {
          response: {
            start: 99,
            end: 101,
            page: 100,
            pageSize: 1,
            totalCount: 100,
          },
          type: assetActions.request.REQUEST_ASSETS_SUCCESS,
        };

        state = reducers.pagination(defaultState, action);

        expect(state).toEqual({
          ...action.response,
        });
      });
      it('returns correct pagination state on PAGE_UPDATE_FAILURE action', () => {
        action = {
          previousState: {
            start: 99,
            end: 101,
            page: 100,
            pageSize: 1,
            totalCount: 100,
          },
          type: assetActions.paginate.PAGE_UPDATE_FAILURE,
        };

        state = reducers.pagination(defaultState, action);

        expect(state).toEqual({
          ...action.previousState,
        });
      });
      it('returns correct pagination state on RESET_PAGE action', () => {
        action = {
          type: assetActions.paginate.RESET_PAGE,
        };

        state = reducers.pagination(defaultState, action);

        expect(state).toEqual({
          ...defaultState,
          page: -1,
        });
      });
    });
    describe('sort reducer', () => {
      it('returns correct sort and direction state on REQUEST_ASSETS_SUCCESS action', () => {
        defaultState = reducers.sortInitial;

        action = {
          response: {
            sort: 'contentType',
            direction: 'asc',
          },
          type: assetActions.request.REQUEST_ASSETS_SUCCESS,
        };

        state = reducers.sort(defaultState, action);

        expect(state).toEqual({
          ...action.response,
          sort: getAssetAPIAttributeFromDatabaseAttribute(action.response.sort),
        });
      });
      it('returns correct previous sort and direction state on SORT_UPDATE_FAILURE action', () => {
        defaultState = reducers.sortInitial;

        action = {
          previousState: {
            sort: 'content_type',
            direction: 'asc',
          },
          type: assetActions.sort.SORT_UPDATE_FAILURE,
        };

        state = reducers.sort(defaultState, action);

        expect(state).toEqual({
          ...action.previousState,
        });
      });
    });
    describe('status reducer', () => {
      defaultState = {
        metadata: {
          pagination: {},
          filters: {},
          sort: {},
        },
      };

      // the status reducer treats all the following actions identically, so loop over them
      const sameBehaviorReducersGroup1 = [
        assetActions.request.REQUEST_ASSETS_SUCCESS,
        assetActions.request.REQUEST_ASSETS_FAILURE,
        assetActions.delete.DELETE_ASSET_SUCCESS,
        assetActions.delete.DELETE_ASSET_FAILURE,
      ];

      sameBehaviorReducersGroup1.forEach((reducer) => {
        it(`returns correct status state on ${reducer.split('.')[1]} action`, () => {
          action = {
            type: reducer,
            response: 'Status!',
          };

          state = reducers.status(defaultState, action);

          expect(state).toEqual(action);
        });
      });

      // the status reducer treats all the following actions identically, so loop over them
      const sameBehaviorReducersGroup2 = [
        assetActions.request.REQUESTING_ASSETS,
        assetActions.filter.FILTER_UPDATE_FAILURE,
        assetActions.sort.SORT_UPDATE_FAILURE,
        assetActions.paginate.PAGE_UPDATE_FAILURE,
      ];

      sameBehaviorReducersGroup2.forEach((reducer) => {
        it(`returns correct status state on ${reducer.split('.')[1]} action`, () => {
          action = {
            type: reducer,
          };

          state = reducers.status(defaultState, action);

          expect(state).toEqual(action);
        });
      });

      it('returns correct status state on CLEAR_ASSETS_STATUS action', () => {
        state = reducers.status(defaultState, {
          type: assetActions.clear.CLEAR_ASSETS_STATUS,
        });

        expect(state).toEqual({});
      });
      it('returns correct status state on TOGGLING_LOCK_ASSET_FALURE action', () => {
        action = {
          asset: 'asset',
          response: 'Failure!',
          type: assetActions.lock.TOGGLING_LOCK_ASSET_FAILURE,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
      it('returns correct status state on UPLOAD_ASSET_SUCCESS action without state.loadedCount', () => {
        action = {
          response: 'Success!',
          type: assetActions.upload.UPLOAD_ASSET_SUCCESS,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
      it('returns correct status state on UPLOAD_ASSET_SUCCESS action with state.loadedCount', () => {
        action = {
          response: 'Success!',
          type: assetActions.upload.UPLOAD_ASSET_SUCCESS,
        };

        state = reducers.status({ ...defaultState }, action);

        expect(state).toEqual(action);
      });
      it('returns correct status state on UPLOAD_ASSET_FAILURE action', () => {
        action = {
          asset: 'asset.txt',
          response: 'Failure!',
          type: assetActions.upload.UPLOAD_ASSET_FAILURE,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
      it('returns correct status state on UPLOAD_EXCEED_MAX_COUNT_ERROR action', () => {
        action = {
          maxFileCount: 1,
          type: assetActions.upload.UPLOAD_EXCEED_MAX_COUNT_ERROR,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
      it('returns correct status state on UPLOAD_EXCEED_MAX_SIZE_ERROR action', () => {
        action = {
          maxFileSizeMB: 1,
          type: assetActions.upload.UPLOAD_EXCEED_MAX_SIZE_ERROR,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
      it('returns correct status state on UPLOADING_ASSETS action', () => {
        action = {
          count: 1,
          type: assetActions.upload.UPLOADING_ASSETS,
        };

        state = reducers.status(defaultState, action);

        expect(state).toEqual(action);
      });
    });
  });
  describe('request reducer', () => {
    beforeEach(() => {
      defaultState = reducers.requestInitial;
    });
    it('returns correct state on UPDATE_REQUEST action', () => {
      const newFilterState = getDefaultFilterState();
      newFilterState.Images = true;

      action = {
        newRequest: {
          sort: 'edX',
          direction: 'desc',
          page: 5,
          assetTypes: newFilterState,
        },
        type: assetActions.request.UPDATE_REQUEST,
      };

      state = reducers.request(defaultState, action);

      expect(state).toEqual({
        ...defaultState,
        ...action.newRequest,
      });
    });
  });
});
