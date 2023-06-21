const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'init': {
      return payload;
    }
    case 'add_table': {
      return {
        ...state,
        tableList: [
          ...state?.tableList ?? [],
          payload,
        ],
        keywordData: {
          ...state?.keywordData ?? {},
          from: [
            ...state?.keywordData?.from ?? [],
            { name: payload.tableName, alias: '' },
          ],
        },
      };
    }
    case 'remove_table': {
      const { tableName } = payload;
      const newTableList = state.tableList.filter(it => it.tableName !== tableName);
      const newFrom = state.keywordData.from.filter(it => it.name !== tableName);

      const newSelect = state.keywordData.select.filter(it => !(it.tableName === tableName));

      return {
        ...state,
        tableList: newTableList,
        keywordData: {
          ...state?.keywordData ?? {},
          from: newFrom,
          select: newSelect,
        },
      };
    }
    case 'add_or_remove_table_field': {
      const { tableName, field, checked } = payload;
      const newTableList = [];
      state.tableList.forEach(item => {
        if (item.tableName === tableName) {
          const data = [];
          item.data.forEach(it => {
            if (it.name === field) {
              const checked = it?.checked ?? false;
              data.push({ ...it, checked: !checked });
            } else {
              data.push(it);
            }
          });
          newTableList.push({ ...item, data });
        } else {
          newTableList.push(item);
        }
      });

      let newSelect;
      if (checked) {
        newSelect = [...state.keywordData.select, { tableName, field, tableNameAlias: '', fieldAlias: '' }];
      } else {
        newSelect = state.keywordData.select.filter(it => !(it.tableName === tableName && it.field === field));
      }

      return {
        ...state,
        tableList: newTableList,
        keywordData: {
          ...state?.keywordData ?? {},
          select: newSelect,
        },
      };
    }
    case 'fieldAliasChange': {
      const { tableName, field, value } = payload;
      const newSelect = [];
      state.keywordData.select.forEach(item => {
        if (item.tableName === tableName && item.field === field) {
          newSelect.push({ ...item, fieldAlias: value });
        } else {
          newSelect.push(item);
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          select: newSelect,
        },
      };
    }
    case 'up_or_down_table_field': {
      const { tableName, field, direction } = payload;
      const fromIndex = state.keywordData.select.findIndex(it => it.tableName === tableName && it.field === field);
      let toIndex;
      if (direction) {
        if (fromIndex === 0) return state;
        toIndex = fromIndex - 1;
      } else {
        if (fromIndex === state.keywordData.select.length - 1) return state;
        toIndex = fromIndex + 1;
      }
      const newSelect = [];
      state.keywordData.select.forEach((item, index) => {
        if (index === fromIndex) {
          newSelect[toIndex] = item;
        } else if (index === toIndex) {
          newSelect[fromIndex] = item;
        } else {
          newSelect.push(item);
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          select: newSelect,
        },
      };
    }
    case 'distinct_change': {
      const { distinct } = payload;
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          distinct,
        },
      };
    }

    default: {
      throw new Error('Unexpected action');
    }
  }
};

export default reducer;
