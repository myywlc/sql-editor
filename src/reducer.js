const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'init': {
      return payload;
    }
    case 'init_table': {
      return {
        ...state,
        allTableList: payload,
      };
    }
    case 'add_table': {
      const id = state.keywordData.from.length;
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
            {
              id: `${id}`,
              name: payload.tableName,
              alias: '',
              isCustom: false,
              operator: id === 0 ? null : ',',
              condition: '',
            },
          ],
        },
      };
    }

    case 'add_table_from': {
      // const find = state.tableList.find(it => it.tableName === payload.tableName);
      // if (find) return;
      return {
        ...state,
        tableList: [
          ...state?.tableList ?? [],
          payload,
        ],
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

    case 'add_edit_table_field': {
      const { tableName, tableNameAlias, field, checked, isCustom = false, id, value } = payload;
      let newTableList = [];
      let newSelect;

      if (!id) {
        if (!isCustom) {
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

          if (checked) {
            newSelect = [...state.keywordData.select, {
              tableName,
              field,
              tableNameAlias,
              fieldAlias: '',
            }];
          } else {
            newSelect = state.keywordData.select.filter(it => !(it.tableName === tableName && it.field === field));
          }
        } else {
          newTableList = [...state.tableList];
          newSelect = [...state.keywordData.select, { isCustom, value }];
        }
      } else {
        const oldData = state.keywordData.select[id];
        const { isCustom: oldIsCustom = false, tableName: oldTableName, field: oldField } = oldData;
        const find = state.keywordData.select.filter(it => it.tableName === oldTableName && it.field === oldField);
        if (isCustom === oldIsCustom) {
          if (!isCustom) {
            if (find.length === 1) {
              state.tableList.forEach(item => {
                if (item.tableName === oldTableName) {
                  const data = [];
                  item.data.forEach(it => {
                    if (it.name === oldField) {
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

              newSelect = state.keywordData.select.map((item, index) => {
                if (index === id) {
                  return { tableName, field, tableNameAlias, fieldAlias: '' };
                } else {
                  return item;
                }
              });
            }
          } else {
            newTableList = [...state.tableList];
            newSelect = state.keywordData.select.map((item, index) => {
              if (index === id) {
                return { isCustom, value };
              } else {
                return item;
              }
            });
          }
        } else {
          if (!isCustom) {
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

            newSelect = state.keywordData.select.map((item, index) => {
              if (index === id) {
                return { tableName, field, tableNameAlias, fieldAlias: '' };
              } else {
                return item;
              }
            });
          } else {
            if (find.length === 1) {
              state.tableList.forEach(item => {
                if (item.tableName === oldTableName) {
                  const data = [];
                  item.data.forEach(it => {
                    if (it.name === oldField) {
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

              newSelect = state.keywordData.select.map((item, index) => {
                if (index === id) {
                  return { isCustom, value };
                } else {
                  return item;
                }
              });
            }
          }
        }
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

    case 'addFromFieldEquality': {
      const { id, name, alias, isCustom } = payload;
      const ids = id.split('-').map(it => Number(it));
      const lastId = ids[ids.length - 1];

      let data;
      if (isCustom) {
        data = {
          id,
          name,
          alias,
          isCustom: true,
          operator: lastId === 0 ? null : ',',
          condition: '',
        };
      } else {
        data = {
          id,
          name,
          alias,
          isCustom: false,
          operator: lastId === 0 ? null : ',',
          condition: '',
        };
      }

      let from = JSON.parse(JSON.stringify(state.keywordData.from));
      let current = from;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key] = data;
        } else {
          current = current[key].child;
        }
      });
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          from,
        },
      };
    }
    case 'removeFromItem': {
      const { id, isTable, tableName } = payload;
      const ids = id.split('-').map(it => Number(it));
      let newTableList = [];

      if (ids.length === 1 && isTable) {
        newTableList = state.tableList.filter(it => it.tableName !== tableName);
      } else {
        newTableList = [...state.tableList];
      }
      let from = JSON.parse(JSON.stringify(state.keywordData.from));
      let current = from;
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
        tableList: newTableList,
        keywordData: {
          ...state?.keywordData ?? {},
          from,
        },
      };
    }
    case 'addFromBracket': {
      const { id } = payload;
      const ids = id.split('-').map(it => Number(it));
      const lastId = ids[ids.length - 1];

      let from = JSON.parse(JSON.stringify(state.keywordData.from));
      let current = from;
      ids.forEach((key, index) => {
        const isLast = index === ids.length - 1;
        if (isLast) {
          current[key] = {
            id,
            isBracket: true,
            child: [],
            operator: lastId === 0 ? null : ',',
            condition: '',
          };
        } else {
          current = current[key].child;
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          from,
        },
      };
    }
    case 'changeFromKeyValue': {
      const { id, fieldKey, value } = payload;
      const ids = id.split('-').map(it => Number(it));

      let from = JSON.parse(JSON.stringify(state.keywordData.from));
      let current = from;
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
          from,
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

    case 'add_groupBy': {
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          groupBy: [
            ...state?.keywordData?.groupBy ?? [],
            { ...payload },
          ],
        },
      };
    }
    case 'remove_groupBy': {
      const { index } = payload;
      const newGroupBy = state.keywordData.groupBy.filter((it, i) => i !== index);

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          groupBy: newGroupBy,
        },
      };
    }

    case 'change_groupBy': {
      const { index, ...rest } = payload;
      const newGroupBy = state.keywordData.groupBy.map((it, i) => {
        if (index === i) {
          return { ...rest };
        }
        return it;
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          groupBy: newGroupBy,
        },
      };
    }

    case 'up_or_down_groupBy': {
      const { fromIndex, direction } = payload;
      let toIndex;
      if (direction) {
        if (fromIndex === 0) return state;
        toIndex = fromIndex - 1;
      } else {
        if (fromIndex === state.keywordData.groupBy.length - 1) return state;
        toIndex = fromIndex + 1;
      }
      const newGroupBy = [];
      state.keywordData.groupBy.forEach((item, index) => {
        if (index === fromIndex) {
          newGroupBy[toIndex] = item;
        } else if (index === toIndex) {
          newGroupBy[fromIndex] = item;
        } else {
          newGroupBy.push(item);
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          groupBy: newGroupBy,
        },
      };
    }

    case 'add_orderBy': {
      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          orderBy: [
            ...state?.keywordData?.orderBy ?? [],
            { ...payload },
          ],
        },
      };
    }
    case 'remove_orderBy': {
      const { index } = payload;
      const newOrderBy = state.keywordData.orderBy.filter((it, i) => i !== index);

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          orderBy: newOrderBy,
        },
      };
    }

    case 'change_orderBy': {
      const { index, ...rest } = payload;
      const newOrderBy = state.keywordData.orderBy.map((it, i) => {
        if (index === i) {
          return { ...rest };
        }
        return it;
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          orderBy: newOrderBy,
        },
      };
    }

    case 'up_or_down_orderBy': {
      const { fromIndex, direction } = payload;
      let toIndex;
      if (direction) {
        if (fromIndex === 0) return state;
        toIndex = fromIndex - 1;
      } else {
        if (fromIndex === state.keywordData.orderBy.length - 1) return state;
        toIndex = fromIndex + 1;
      }
      const newOrderBy = [];
      state.keywordData.orderBy.forEach((item, index) => {
        if (index === fromIndex) {
          newOrderBy[toIndex] = item;
        } else if (index === toIndex) {
          newOrderBy[fromIndex] = item;
        } else {
          newOrderBy.push(item);
        }
      });

      return {
        ...state,
        keywordData: {
          ...state?.keywordData ?? {},
          orderBy: newOrderBy,
        },
      };
    }

    default: {
      throw new Error('Unexpected action');
    }
  }
};

export default reducer;
