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
    case 'tableAliasChange': {
      const { tableName, value } = payload;
      const newFrom = [];
      state.keywordData.from.forEach(item => {
        if (item.name === tableName) {
          newFrom.push({ ...item, alias: value });
        } else {
          newFrom.push(item);
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          from: newFrom,
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
    case 'limitChange': {
      const { limitType, value } = payload;
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          limit: {
            ...state?.keywordData?.limit ?? {},
            [limitType]: value,
          },
        },
      };
    }

    case 'addWhereFieldEquality': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let where = JSON.parse(JSON.stringify(state.keywordData.where));
      let current = where;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key] = {
            id,
            leftValue: '',
            isLeftCustom: false,
            operator: '=',
            rightValue: '',
            isRightCustom: false,
            connectors: 'AND',
          };
        } else {
          current = current[key].child;
        }
      });
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          where,
        },
      };
    }

    case 'removeWhereItem': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let where = JSON.parse(JSON.stringify(state.keywordData.where));
      let current = where;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current.splice(key, 1);
        } else {
          current = current[key].child;
        }
      });
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          where,
        },
      };
    }

    case 'addWhereBracket': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let where = JSON.parse(JSON.stringify(state.keywordData.where));
      let current = where;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key] = {
            id,
            isBracket: true,
            child: [],
            connectors: 'AND',
          };
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          where,
        },
      };
    }

    case 'changeWhereAndOr': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let where = JSON.parse(JSON.stringify(state.keywordData.where));
      let current = where;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          const { connectors } = current[key];
          if (connectors === 'AND') {
            current[key].connectors = 'OR';
          } else {
            current[key].connectors = 'AND';
          }
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          where,
        },
      };
    }

    case 'changeWhereKeyValue': {
      const { id, fieldKey, value } = payload;
      const ids = id.split('-').map(it => Number(it));

      let where = JSON.parse(JSON.stringify(state.keywordData.where));
      let current = where;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key][fieldKey] = value;
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          where,
        },
      };
    }

    case 'up_or_down_where_field': {
      const { id, direction } = payload;
      const ids = id.split('-').map(it => Number(it));
      let prefixIds = '';
      ids.forEach((it, i) => {
        const lastIndex = ids.length - 1;
        if (lastIndex !== i) {
          prefixIds = (prefixIds ? prefixIds + '-' : '') + it;
        }
      });
      let where = JSON.parse(JSON.stringify(state.keywordData.where));
      let current = where;
      let toIndex;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          if (direction) {
            if (key === 0) return;
            toIndex = key - 1;
          } else {
            if (key === current.length - 1) return;
            toIndex = key + 1;
          }
          const toItem = current[toIndex];
          current[toIndex] = current[key];
          current[toIndex].id = (prefixIds ? prefixIds + '-' : '') + toIndex;
          current[key] = toItem;
          current[key].id = (prefixIds ? prefixIds + '-' : '') + key;
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          where,
        },
      };
    }

    case 'addHavingFieldEquality': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let having = JSON.parse(JSON.stringify(state.keywordData.having));
      let current = having;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key] = {
            id,
            leftValue: '',
            isLeftCustom: false,
            operator: '=',
            rightValue: '',
            isRightCustom: false,
            connectors: 'AND',
          };
        } else {
          current = current[key].child;
        }
      });
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          having,
        },
      };
    }

    case 'removeHavingItem': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let having = JSON.parse(JSON.stringify(state.keywordData.having));
      let current = having;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current.splice(key, 1);
        } else {
          current = current[key].child;
        }
      });
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          having,
        },
      };
    }

    case 'addHavingBracket': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let having = JSON.parse(JSON.stringify(state.keywordData.having));
      let current = having;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key] = {
            id,
            isBracket: true,
            child: [],
            connectors: 'AND',
          };
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          having,
        },
      };
    }

    case 'changeHavingAndOr': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));

      let having = JSON.parse(JSON.stringify(state.keywordData.having));
      let current = having;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          const { connectors } = current[key];
          if (connectors === 'AND') {
            current[key].connectors = 'OR';
          } else {
            current[key].connectors = 'AND';
          }
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          having,
        },
      };
    }

    case 'changeHavingKeyValue': {
      const { id, fieldKey, value } = payload;
      const ids = id.split('-').map(it => Number(it));

      let having = JSON.parse(JSON.stringify(state.keywordData.having));
      let current = having;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key][fieldKey] = value;
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          having,
        },
      };
    }

    case 'up_or_down_having_field': {
      const { id, direction } = payload;
      const ids = id.split('-').map(it => Number(it));
      let prefixIds = '';
      ids.forEach((it, i) => {
        const lastIndex = ids.length - 1;
        if (lastIndex !== i) {
          prefixIds = (prefixIds ? prefixIds + '-' : '') + it;
        }
      });
      let having = JSON.parse(JSON.stringify(state.keywordData.having));
      let current = having;
      let toIndex;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          if (direction) {
            if (key === 0) return;
            toIndex = key - 1;
          } else {
            if (key === current.length - 1) return;
            toIndex = key + 1;
          }
          const toItem = current[toIndex];
          current[toIndex] = current[key];
          current[toIndex].id = (prefixIds ? prefixIds + '-' : '') + toIndex;
          current[key] = toItem;
          current[key].id = (prefixIds ? prefixIds + '-' : '') + key;
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          having,
        },
      };
    }

    default: {
      throw new Error('Unexpected action');
    }
  }
};

export default reducer;
