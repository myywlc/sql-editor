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
          ...state?.keywordData ?? [],
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
      return {
        ...state,
        tableList: newTableList,
        keywordData: {
          ...state?.keywordData ?? [],
          from: newFrom,
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
      console.log(checked, 'checked');
      if (checked) {
        newSelect = [...state.keywordData.select, { tableName, field, tableNameAlias: '', fieldAlias: '',}]
      } else {
        newSelect = state.keywordData.select.filter(it => !(it.tableName === tableName && it.field === field));
      }

      return {
        ...state,
        tableList: newTableList,
        keywordData: {
          ...state?.keywordData ?? [],
          select: newSelect,
        },
      };
    }
    default: {
      throw new Error('Unexpected action');
    }
  }
};

export default reducer;
