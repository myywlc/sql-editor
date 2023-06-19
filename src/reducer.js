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
      };
    }
    case 'add_table_field': {
      const { tableName, field } = payload;

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
      return {
        ...state,
        tableList: newTableList,
      };
    }
    default:
      throw new Error('Unexpected action');
  }
};

export default reducer;
