import { Checkbox, Input, InputNumber, List, Popover, Tabs, Tree } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, FileAddOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';

const { TextArea } = Input;
const { DirectoryTree } = Tree;

const Identifier = ({ handleSelect, selectData }) => {
  const onSelect = (keys, info) => {
    handleSelect(info.selectedNodes[0]);
  };

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      autoExpandParent
      onSelect={onSelect}
      treeData={selectData}
    />
  );
};

const Custom = ({ isCustom, value, handleCustom }) => {
  return (
    <TextArea rows={10} defaultValue={isCustom ? value : ''}
              onPressEnter={(e) => handleCustom(e.target.value)} />
  );
};

const PopoverSelect = ({ selectData, dispatch, target, fieldKey, isCustom, value, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (data) => {
    dispatch({
      type: 'changeWhereKeyValue',
      payload: {
        id: target,
        fieldKey,
        value: `${data.tableAlias || data.tableName}.${data.title}`,
      },
    });
    dispatch({
      type: 'changeWhereKeyValue',
      payload: {
        id: target,
        fieldKey: fieldKey === 'leftValue' ? 'isLeftCustom' : 'isRightCustom',
        value: false,
      },
    });
    setOpen(false);
  };

  const handleCustom = (data) => {
    dispatch({
      type: 'changeWhereKeyValue',
      payload: {
        id: target,
        fieldKey,
        value: data,
      },
    });
    dispatch({
      type: 'changeWhereKeyValue',
      payload: {
        id: target,
        fieldKey: fieldKey === 'leftValue' ? 'isLeftCustom' : 'isRightCustom',
        value: true,
      },
    });
    setOpen(false);
  };

  const renderContent = () => {
    const items = [
      {
        key: '1',
        label: `Identifier`,
        children: <Identifier selectData={selectData} handleSelect={handleSelect} />,
      },
      {
        key: '2',
        label: `Custom`,
        children: <Custom isCustom={isCustom} value={value} handleCustom={handleCustom} />,
      },
    ];

    return (
      <div style={{ width: 240, height: 300, overflow: 'auto' }}>
        <Tabs size="small" centered defaultActiveKey={isCustom ? '2' : '1'} items={items} />
      </div>
    );
  };


  return (
    <Popover
      destroyTooltipOnHide
      content={renderContent}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const PopoverBetween = ({ dispatch, target, value, children }) => {
  const [open, setOpen] = useState(false);
  const [begin, setBegin] = useState('');
  const [end, setEnd] = useState('');
  const [initBegin = '', initEnd = ''] = value.split(' AND ');

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!open) {
      dispatch({
        type: 'changeWhereKeyValue',
        payload: {
          id: target,
          fieldKey: 'rightValue',
          value: `${begin} AND ${end}`,
        },
      });
    }
  }, [open, begin, end]);

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <div style={{ width: 240, height: 150 }}>
          <h6 style={{ margin: 6 }}>begin:</h6>
          <Input placeholder="请输入begin" defaultValue={initBegin} onChange={(e) => setBegin(e.target.value)} />
          <h6 style={{ margin: 6 }}>end:</h6>
          <Input placeholder="请输入end" defaultValue={initEnd} onChange={(e) => setEnd(e.target.value)} />
        </div>
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const PopoverList = ({ dispatch, target, value, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleList = (data) => {
    dispatch({
      type: 'changeWhereKeyValue',
      payload: {
        id: target,
        fieldKey: 'rightValue',
        value: data,
      },
    });

    setOpen(false);
  };

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <TextArea placeholder="请输入以,分隔" rows={6} defaultValue={value} onPressEnter={(e) => handleList(e.target.value)} />
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const PopoverOperator = ({ target, dispatch, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (value) => {
    if (value === 'is between') {
      dispatch({
        type: 'changeWhereKeyValue',
        payload: {
          id: target,
          fieldKey: 'rightValue',
          value: ' AND ',
        },
      });
    }
    dispatch({
      type: 'changeWhereKeyValue',
      payload: {
        id: target,
        fieldKey: 'operator',
        value,
      },
    });
    setOpen(false);
  };

  const operatorList = [
    '=',
    '<>',
    '<',
    '<=',
    '>',
    '>=',
    'is like',
    'is not like',
    'contains',
    'does not contain',
    'begins with',
    'does not begin with',
    'ends with',
    'does not end with',
    'is null',
    'is not null',
    'is empty',
    'is not empty',
    'is between',
    'is not between',
    'is in list',
    'is not in list',
    '[Custom]',
  ];

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <div style={{ width: 200, height: 300, overflow: 'auto' }}>
          <List
            size="small"
            dataSource={operatorList}
            renderItem={(item) => <List.Item onClick={() => handleSelect(item)}><a>{item}</a></List.Item>}
          />
        </div>
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

function SelectHandle({ select, distinct, dispatch }) {
  const handleClickFieldAlias = (tableName, field, e) => {
    dispatch({
      type: 'fieldAliasChange',
      payload: {
        tableName,
        field,
        value: e.target.value,
      },
    });
  };

  const lastIndex = select.length - 1;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ maxHeight: 318, overflowY: 'auto' }}>
        {
          (select.length === 0) ? (
            <a><FileAddOutlined /> <span style={{ color: '#0000006e' }}>添加字段</span></a>
          ) : (
            select.map((it, i) => {
              return (
                <div key={i} className="selectHover">
                  {`${it.tableNameAlias || it.tableName}.${it.field}`} {
                  !it.fieldAlias ? (
                    <Popover
                      content={(
                        <Input
                          placeholder="请输入别名"
                          bordered={false}
                          onPressEnter={(e) => handleClickFieldAlias(it.tableName, it.field, e)}
                        />
                      )}>
                      <span style={{ color: '#c0c0c0' }}>{'<alias>'}</span>
                    </Popover>
                  ) : (
                    <Popover
                      content={(
                        <Input
                          placeholder="请输入别名"
                          bordered={false}
                          onPressEnter={(e) => handleClickFieldAlias(it.tableName, it.field, e)}
                          defaultValue={it.fieldAlias}
                        />
                      )}>
                      <span>({it.fieldAlias})</span>
                    </Popover>
                  )
                }
                  {(lastIndex === i) && <a style={{ marginLeft: 6 }}><FileAddOutlined /></a>}
                  <a
                    className="selectHoverA"
                    style={{
                      color: '#fff',
                      backgroundColor: '#b2b2b2',
                      fontSize: 12,
                      padding: '0 5px',
                      marginLeft: 6,
                    }}
                    onClick={() => dispatch({
                      type: 'add_or_remove_table_field',
                      payload: {
                        tableName: it.tableName,
                        field: it.field,
                        checked: false,
                      },
                    })}
                  >
                    X
                  </a>
                  {
                    i !== 0 && (
                      <a
                        className="selectHoverA"
                        style={{ marginLeft: 6 }}
                        onClick={() => dispatch({
                          type: 'up_or_down_table_field',
                          payload: {
                            tableName: it.tableName,
                            field: it.field,
                            direction: true,
                          },
                        })}
                      >
                        <ArrowUpOutlined />
                      </a>
                    )
                  }
                  {
                    i !== lastIndex && (
                      <a
                        className="selectHoverA"
                        style={{ marginLeft: 6 }}
                        onClick={() => dispatch({
                          type: 'up_or_down_table_field',
                          payload: {
                            tableName: it.tableName,
                            field: it.field,
                            direction: false,
                          },
                        })}
                      >
                        <ArrowDownOutlined />
                      </a>
                    )
                  }
                </div>
              );
            })
          )
        }
      </div>

      <div style={{ position: 'absolute', top: 320 }}>
        <Checkbox
          onChange={(e) => dispatch({
            type: 'distinct_change',
            payload: { distinct: e.target.checked },
          })}
          checked={distinct}
        >
          DISTINCT
        </Checkbox>
      </div>
    </div>
  );
}

function FromHandle({ from, dispatch }) {
  const handleClickTableAlias = (tableName, e) => {
    dispatch({
      type: 'tableAliasChange',
      payload: {
        tableName,
        value: e.target.value,
      },
    });
  };

  const lastIndex = from.length - 1;
  return (
    <div style={{ maxHeight: 318, overflowY: 'auto' }}>
      {
        (from.length === 0) ? (
          <a><FileAddOutlined /> <span style={{ color: '#0000006e' }}>添加表</span></a>
        ) : (
          from.map((it, i) => {
            return (
              <div key={i} className="selectHover">
                {`${it.name}`} {
                !it.alias ? (
                  <Popover
                    content={(
                      <Input
                        placeholder="请输入别名"
                        bordered={false}
                        onPressEnter={(e) => handleClickTableAlias(it.name, e)}
                      />
                    )}>
                    <span style={{ color: '#c0c0c0' }}>{'<alias>'}</span>
                  </Popover>
                ) : (
                  <Popover
                    content={(
                      <Input
                        placeholder="请输入别名"
                        bordered={false}
                        onPressEnter={(e) => handleClickTableAlias(it.name, e)}
                        defaultValue={it.alias}
                      />
                    )}>
                    <span>({it.alias})</span>
                  </Popover>
                )
              }
                {(lastIndex === i) && <a style={{ marginLeft: 6 }}><FileAddOutlined /></a>}
                <a
                  className="selectHoverA"
                  style={{
                    color: '#fff',
                    backgroundColor: '#b2b2b2',
                    fontSize: 12,
                    padding: '0 5px',
                    marginLeft: 6,
                  }}
                  onClick={() => dispatch({
                    type: 'remove_table',
                    payload: {
                      tableName: it.name,
                    },
                  })}
                >
                  X
                </a>
              </div>
            );
          })
        )
      }
    </div>
  );
}

function WhereHandle({ where, from, tableList, dispatch }) {

  const selectData = useMemo(() => {
    const data = [];
    from.forEach((item, index) => {
      const { name, alias } = item;
      const fItem = tableList.find(item => item.tableName === name);
      data.push({
        title: fItem.tableName + (alias ? `(${alias})` : ''),
        key: `0-${index}`,
        children: fItem.data.filter(it => it.name !== '*').map((it, i) => ({
          title: it.name,
          key: `0-${index}-${i}`,
          isLeaf: true,
          tableName: name,
          tableAlias: alias,
        })),
      });
    });
    return data;
  }, [from, tableList]);

  const handleAddFieldEquality = (id) => {
    dispatch({
      type: 'addWhereFieldEquality',
      payload: { id },
    });
  };

  const handleRemoveItem = (id) => {
    dispatch({
      type: 'removeWhereItem',
      payload: { id },
    });
  };

  const handleAddBracket = (id) => {
    dispatch({
      type: 'addWhereBracket',
      payload: { id },
    });
  };

  const handleClickAndOr = (id) => {
    dispatch({
      type: 'changeWhereAndOr',
      payload: { id },
    });
  };

  const renderTree = (data, k = '') => {
    const lastIndex = data.length - 1;
    const length = k.split('-').map(it => Number(it)).length;

    return (
      <>
        {
          data.map((it, i) => {
            if (it.isBracket) {
              return (
                <div key={i} className="selectHover">
                  <div style={{ marginLeft: 6 * length }}>
                    {it.child.length > 0 ? (
                      <>
                        <div>(</div>
                        <div style={{ marginLeft: 6 }}>{renderTree(it.child, it.id)}</div>
                        <div>) {
                          lastIndex === i && (
                            <>
                              <a style={{ marginLeft: 6, marginRight: 6 }}
                                 onClick={() => handleAddFieldEquality(`${k ? (k + '-') : ''}${i + 1}`)}><FileAddOutlined /></a>
                              <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                                    onClick={() => handleAddBracket(`${k ? (k + '-') : ''}${i + 1}`)}>()</span>
                            </>
                          )
                        }
                          <a
                            className="selectHoverA"
                            style={{
                              color: '#fff',
                              backgroundColor: '#b2b2b2',
                              fontSize: 12,
                              padding: '0 5px',
                              marginLeft: 6,
                            }}
                            onClick={() => handleRemoveItem(it.id)}
                          >
                            X
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_where_field',
                              payload: {
                                id: it.id,
                                direction: true,
                              },
                            })}
                          >
                            <ArrowUpOutlined />
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_where_field',
                              payload: {
                                id: it.id,
                                direction: false,
                              },
                            })}
                          >
                            <ArrowDownOutlined />
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>(</div>
                        <a style={{ marginLeft: 6, marginRight: 6 }}
                           onClick={() => handleAddFieldEquality(`${it.id + '-'}${0}`)}><FileAddOutlined /></a>
                        <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                              onClick={() => handleAddBracket(`${it.id + '-'}${0}`)}>()</span>
                        <div>) {
                          lastIndex === i && (
                            <>
                              <a style={{ marginLeft: 6, marginRight: 6 }}
                                 onClick={() => handleAddFieldEquality(`${k ? (k + '-') : ''}${i + 1}`)}><FileAddOutlined /></a>
                              <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                                    onClick={() => handleAddBracket(`${k ? (k + '-') : ''}${i + 1}`)}>()</span>
                            </>
                          )
                        }
                          <a
                            className="selectHoverA"
                            style={{
                              color: '#fff',
                              backgroundColor: '#b2b2b2',
                              fontSize: 12,
                              padding: '0 5px',
                              marginLeft: 6,
                            }}
                            onClick={() => handleRemoveItem(it.id)}
                          >
                            X
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_where_field',
                              payload: {
                                id: it.id,
                                direction: true,
                              },
                            })}
                          >
                            <ArrowUpOutlined />
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_where_field',
                              payload: {
                                id: it.id,
                                direction: false,
                              },
                            })}
                          >
                            <ArrowDownOutlined />
                          </a></div>
                        {
                          lastIndex !== i && (
                            <span
                              style={{
                                color: '#1577ff',
                                cursor: 'pointer',
                                margin: '0 6px',
                              }}
                              onClick={() => handleClickAndOr(`${k ? (k + '-') : ''}${i}`)}
                            >
                              {it.connectors}
                            </span>
                          )
                        }
                      </>
                    )}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={i} className="selectHover">
                  <PopoverSelect selectData={selectData} dispatch={dispatch} target={it.id}
                                 fieldKey={'leftValue'} isCustom={it.isLeftCustom} value={it.leftValue}>
                    {
                      it.leftValue && <span className={'fontOverflow'}>{it.leftValue}</span> ||
                      <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                    }
                  </PopoverSelect>
                  <PopoverOperator dispatch={dispatch} target={it.id}>
                    <span
                      style={{ color: '#1577ff', cursor: 'pointer', margin: '0 6px' }}>{it.operator}</span>
                  </PopoverOperator>
                  {
                    [
                      '=',
                      '<>',
                      '<',
                      '<=',
                      '>',
                      '>=',
                      'is like',
                      'is not like',
                      'contains',
                      'does not contain',
                      'begins with',
                      'does not begin with',
                      'ends with',
                      'does not end with',
                    ].includes(it.operator) && (
                      <PopoverSelect selectData={selectData} dispatch={dispatch} target={it.id}
                                     fieldKey={'rightValue'} isCustom={it.isRightCustom}
                                     value={it.rightValue}>
                        {
                          it.rightValue && <span className={'fontOverflow'}>{it.rightValue}</span> ||
                          <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                        }
                      </PopoverSelect>
                    )
                  }
                  {
                    ['is null', 'is not null', 'is empty', 'is not empty', '[Custom]'].includes(it.operator) && null
                  }
                  {
                    ['is between', 'is not between'].includes(it.operator) && (
                      <PopoverBetween dispatch={dispatch} target={it.id} value={it.rightValue}>
                        {
                          it.rightValue && <span className={'fontOverflow'}>{it.rightValue}</span> ||
                          <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                        }
                      </PopoverBetween>
                    )
                  }
                  {
                    ['is in list', 'is not in list'].includes(it.operator) && (
                      <PopoverList dispatch={dispatch} target={it.id} value={it.rightValue}>
                        {
                          it.rightValue && <span className={'fontOverflow'}>{it.rightValue}</span> ||
                          <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                        }
                      </PopoverList>
                    )
                  }
                  {
                    lastIndex !== i && (
                      <span
                        style={{
                          color: '#1577ff',
                          cursor: 'pointer',
                          margin: '0 6px',
                        }}
                        onClick={() => handleClickAndOr(`${k ? (k + '-') : ''}${i}`)}
                      >
                        {it.connectors}
                      </span>
                    )
                  }
                  {
                    lastIndex === i && (
                      <>
                        <a style={{ marginLeft: 6, marginRight: 6 }}
                           onClick={() => handleAddFieldEquality(`${k ? (k + '-') : ''}${i + 1}`)}><FileAddOutlined /></a>
                        <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                              onClick={() => handleAddBracket(`${k ? (k + '-') : ''}${i + 1}`)}>()</span>
                      </>
                    )
                  }
                  <a
                    className="selectHoverA"
                    style={{
                      color: '#fff',
                      backgroundColor: '#b2b2b2',
                      fontSize: 12,
                      padding: '0 5px',
                      marginLeft: 6,
                    }}
                    onClick={() => handleRemoveItem(`${k ? (k + '-') : ''}${i}`)}
                  >
                    X
                  </a>
                  <a
                    className="selectHoverA"
                    style={{ marginLeft: 6 }}
                    onClick={() => dispatch({
                      type: 'up_or_down_where_field',
                      payload: {
                        id: it.id,
                        direction: true,
                      },
                    })}
                  >
                    <ArrowUpOutlined />
                  </a>
                  <a
                    className="selectHoverA"
                    style={{ marginLeft: 6 }}
                    onClick={() => dispatch({
                      type: 'up_or_down_where_field',
                      payload: {
                        id: it.id,
                        direction: false,
                      },
                    })}
                  >
                    <ArrowDownOutlined />
                  </a>
                </div>
              );
            }
          })
        }
      </>
    );
  };

  return (
    <div style={{ maxHeight: 318, overflowY: 'auto' }}>
      {
        (where.length === 0) ? (
          <a>
            <FileAddOutlined style={{ marginRight: 6 }} onClick={() => handleAddFieldEquality('0')} />
            <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                  onClick={() => handleAddBracket('0')}>()</span>
            <span style={{ color: '#0000006e' }}>添加</span>
          </a>
        ) : (
          renderTree(where)
        )
      }
    </div>
  );
}

const PopoverSelectHaving = ({ selectData, dispatch, target, fieldKey, isCustom, value, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (data) => {
    dispatch({
      type: 'changeHavingKeyValue',
      payload: {
        id: target,
        fieldKey,
        value: `${data.tableAlias || data.tableName}.${data.title}`,
      },
    });
    dispatch({
      type: 'changeHavingKeyValue',
      payload: {
        id: target,
        fieldKey: fieldKey === 'leftValue' ? 'isLeftCustom' : 'isRightCustom',
        value: false,
      },
    });
    setOpen(false);
  };

  const handleCustom = (data) => {
    dispatch({
      type: 'changeHavingKeyValue',
      payload: {
        id: target,
        fieldKey,
        value: data,
      },
    });
    dispatch({
      type: 'changeHavingKeyValue',
      payload: {
        id: target,
        fieldKey: fieldKey === 'leftValue' ? 'isLeftCustom' : 'isRightCustom',
        value: true,
      },
    });
    setOpen(false);
  };

  const renderContent = () => {
    const items = [
      {
        key: '1',
        label: `Identifier`,
        children: <Identifier selectData={selectData} handleSelect={handleSelect} />,
      },
      {
        key: '2',
        label: `Custom`,
        children: <Custom isCustom={isCustom} value={value} handleCustom={handleCustom} />,
      },
    ];

    return (
      <div style={{ width: 240, height: 300, overflow: 'auto' }}>
        <Tabs size="small" centered defaultActiveKey={isCustom ? '2' : '1'} items={items} />
      </div>
    );
  };


  return (
    <Popover
      destroyTooltipOnHide
      content={renderContent}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const PopoverBetweenHaving = ({ dispatch, target, value, children }) => {
  const [open, setOpen] = useState(false);
  const [begin, setBegin] = useState('');
  const [end, setEnd] = useState('');
  const [initBegin = '', initEnd = ''] = value.split(' AND ');

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!open) {
      dispatch({
        type: 'changeHavingKeyValue',
        payload: {
          id: target,
          fieldKey: 'rightValue',
          value: `${begin} AND ${end}`,
        },
      });
    }
  }, [open, begin, end]);

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <div style={{ width: 240, height: 150 }}>
          <h6 style={{ margin: 6 }}>begin:</h6>
          <Input placeholder="请输入begin" defaultValue={initBegin} onChange={(e) => setBegin(e.target.value)} />
          <h6 style={{ margin: 6 }}>end:</h6>
          <Input placeholder="请输入end" defaultValue={initEnd} onChange={(e) => setEnd(e.target.value)} />
        </div>
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const PopoverListHaving = ({ dispatch, target, value, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleList = (data) => {
    dispatch({
      type: 'changeHavingKeyValue',
      payload: {
        id: target,
        fieldKey: 'rightValue',
        value: data,
      },
    });

    setOpen(false);
  };

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <TextArea placeholder="请输入以,分隔" rows={6} defaultValue={value} onPressEnter={(e) => handleList(e.target.value)} />
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

const PopoverOperatorHaving = ({ target, dispatch, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (value) => {
    if (value === 'is between') {
      dispatch({
        type: 'changeHavingKeyValue',
        payload: {
          id: target,
          fieldKey: 'rightValue',
          value: ' AND ',
        },
      });
    }
    dispatch({
      type: 'changeHavingKeyValue',
      payload: {
        id: target,
        fieldKey: 'operator',
        value,
      },
    });
    setOpen(false);
  };

  const operatorList = [
    '=',
    '<>',
    '<',
    '<=',
    '>',
    '>=',
    'is like',
    'is not like',
    'contains',
    'does not contain',
    'begins with',
    'does not begin with',
    'ends with',
    'does not end with',
    'is null',
    'is not null',
    'is empty',
    'is not empty',
    'is between',
    'is not between',
    'is in list',
    'is not in list',
    '[Custom]',
  ];

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <div style={{ width: 200, height: 300, overflow: 'auto' }}>
          <List
            size="small"
            dataSource={operatorList}
            renderItem={(item) => <List.Item onClick={() => handleSelect(item)}><a>{item}</a></List.Item>}
          />
        </div>
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

function HavingHandle({ having, from, tableList, dispatch }) {

  const selectData = useMemo(() => {
    const data = [];
    from.forEach((item, index) => {
      const { name, alias } = item;
      const fItem = tableList.find(item => item.tableName === name);
      data.push({
        title: fItem.tableName + (alias ? `(${alias})` : ''),
        key: `0-${index}`,
        children: fItem.data.filter(it => it.name !== '*').map((it, i) => ({
          title: it.name,
          key: `0-${index}-${i}`,
          isLeaf: true,
          tableName: name,
          tableAlias: alias,
        })),
      });
    });
    return data;
  }, [from, tableList]);

  const handleAddFieldEquality = (id) => {
    dispatch({
      type: 'addHavingFieldEquality',
      payload: { id },
    });
  };

  const handleRemoveItem = (id) => {
    dispatch({
      type: 'removeHavingItem',
      payload: { id },
    });
  };

  const handleAddBracket = (id) => {
    dispatch({
      type: 'addHavingBracket',
      payload: { id },
    });
  };

  const handleClickAndOr = (id) => {
    dispatch({
      type: 'changeHavingAndOr',
      payload: { id },
    });
  };

  const renderTree = (data, k = '') => {
    const lastIndex = data.length - 1;
    const length = k.split('-').map(it => Number(it)).length;

    return (
      <>
        {
          data.map((it, i) => {
            if (it.isBracket) {
              return (
                <div key={i} className="selectHover">
                  <div style={{ marginLeft: 6 * length }}>
                    {it.child.length > 0 ? (
                      <>
                        <div>(</div>
                        <div style={{ marginLeft: 6 }}>{renderTree(it.child, it.id)}</div>
                        <div>) {
                          lastIndex === i && (
                            <>
                              <a style={{ marginLeft: 6, marginRight: 6 }}
                                 onClick={() => handleAddFieldEquality(`${k ? (k + '-') : ''}${i + 1}`)}><FileAddOutlined /></a>
                              <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                                    onClick={() => handleAddBracket(`${k ? (k + '-') : ''}${i + 1}`)}>()</span>
                            </>
                          )
                        }
                          <a
                            className="selectHoverA"
                            style={{
                              color: '#fff',
                              backgroundColor: '#b2b2b2',
                              fontSize: 12,
                              padding: '0 5px',
                              marginLeft: 6,
                            }}
                            onClick={() => handleRemoveItem(it.id)}
                          >
                            X
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_having_field',
                              payload: {
                                id: it.id,
                                direction: true,
                              },
                            })}
                          >
                            <ArrowUpOutlined />
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_having_field',
                              payload: {
                                id: it.id,
                                direction: false,
                              },
                            })}
                          >
                            <ArrowDownOutlined />
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>(</div>
                        <a style={{ marginLeft: 6, marginRight: 6 }}
                           onClick={() => handleAddFieldEquality(`${it.id + '-'}${0}`)}><FileAddOutlined /></a>
                        <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                              onClick={() => handleAddBracket(`${it.id + '-'}${0}`)}>()</span>
                        <div>) {
                          lastIndex === i && (
                            <>
                              <a style={{ marginLeft: 6, marginRight: 6 }}
                                 onClick={() => handleAddFieldEquality(`${k ? (k + '-') : ''}${i + 1}`)}><FileAddOutlined /></a>
                              <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                                    onClick={() => handleAddBracket(`${k ? (k + '-') : ''}${i + 1}`)}>()</span>
                            </>
                          )
                        }
                          <a
                            className="selectHoverA"
                            style={{
                              color: '#fff',
                              backgroundColor: '#b2b2b2',
                              fontSize: 12,
                              padding: '0 5px',
                              marginLeft: 6,
                            }}
                            onClick={() => handleRemoveItem(it.id)}
                          >
                            X
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_having_field',
                              payload: {
                                id: it.id,
                                direction: true,
                              },
                            })}
                          >
                            <ArrowUpOutlined />
                          </a>
                          <a
                            className="selectHoverA"
                            style={{ marginLeft: 6 }}
                            onClick={() => dispatch({
                              type: 'up_or_down_having_field',
                              payload: {
                                id: it.id,
                                direction: false,
                              },
                            })}
                          >
                            <ArrowDownOutlined />
                          </a></div>
                        {
                          lastIndex !== i && (
                            <span
                              style={{
                                color: '#1577ff',
                                cursor: 'pointer',
                                margin: '0 6px',
                              }}
                              onClick={() => handleClickAndOr(`${k ? (k + '-') : ''}${i}`)}
                            >
                              {it.connectors}
                            </span>
                          )
                        }
                      </>
                    )}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={i} className="selectHover">
                  <PopoverSelectHaving selectData={selectData} dispatch={dispatch} target={it.id}
                                 fieldKey={'leftValue'} isCustom={it.isLeftCustom} value={it.leftValue}>
                    {
                      it.leftValue && <span className={'fontOverflow'}>{it.leftValue}</span> ||
                      <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                    }
                  </PopoverSelectHaving>
                  <PopoverOperatorHaving dispatch={dispatch} target={it.id}>
                    <span
                      style={{ color: '#1577ff', cursor: 'pointer', margin: '0 6px' }}>{it.operator}</span>
                  </PopoverOperatorHaving>
                  {
                    [
                      '=',
                      '<>',
                      '<',
                      '<=',
                      '>',
                      '>=',
                      'is like',
                      'is not like',
                      'contains',
                      'does not contain',
                      'begins with',
                      'does not begin with',
                      'ends with',
                      'does not end with',
                    ].includes(it.operator) && (
                      <PopoverSelectHaving selectData={selectData} dispatch={dispatch} target={it.id}
                                     fieldKey={'rightValue'} isCustom={it.isRightCustom}
                                     value={it.rightValue}>
                        {
                          it.rightValue && <span className={'fontOverflow'}>{it.rightValue}</span> ||
                          <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                        }
                      </PopoverSelectHaving>
                    )
                  }
                  {
                    ['is null', 'is not null', 'is empty', 'is not empty', '[Custom]'].includes(it.operator) && null
                  }
                  {
                    ['is between', 'is not between'].includes(it.operator) && (
                      <PopoverBetweenHaving dispatch={dispatch} target={it.id} value={it.rightValue}>
                        {
                          it.rightValue && <span className={'fontOverflow'}>{it.rightValue}</span> ||
                          <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                        }
                      </PopoverBetweenHaving>
                    )
                  }
                  {
                    ['is in list', 'is not in list'].includes(it.operator) && (
                      <PopoverListHaving dispatch={dispatch} target={it.id} value={it.rightValue}>
                        {
                          it.rightValue && <span className={'fontOverflow'}>{it.rightValue}</span> ||
                          <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<value>'}</span>
                        }
                      </PopoverListHaving>
                    )
                  }
                  {
                    lastIndex !== i && (
                      <span
                        style={{
                          color: '#1577ff',
                          cursor: 'pointer',
                          margin: '0 6px',
                        }}
                        onClick={() => handleClickAndOr(`${k ? (k + '-') : ''}${i}`)}
                      >
                        {it.connectors}
                      </span>
                    )
                  }
                  {
                    lastIndex === i && (
                      <>
                        <a style={{ marginLeft: 6, marginRight: 6 }}
                           onClick={() => handleAddFieldEquality(`${k ? (k + '-') : ''}${i + 1}`)}><FileAddOutlined /></a>
                        <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                              onClick={() => handleAddBracket(`${k ? (k + '-') : ''}${i + 1}`)}>()</span>
                      </>
                    )
                  }
                  <a
                    className="selectHoverA"
                    style={{
                      color: '#fff',
                      backgroundColor: '#b2b2b2',
                      fontSize: 12,
                      padding: '0 5px',
                      marginLeft: 6,
                    }}
                    onClick={() => handleRemoveItem(`${k ? (k + '-') : ''}${i}`)}
                  >
                    X
                  </a>
                  <a
                    className="selectHoverA"
                    style={{ marginLeft: 6 }}
                    onClick={() => dispatch({
                      type: 'up_or_down_having_field',
                      payload: {
                        id: it.id,
                        direction: true,
                      },
                    })}
                  >
                    <ArrowUpOutlined />
                  </a>
                  <a
                    className="selectHoverA"
                    style={{ marginLeft: 6 }}
                    onClick={() => dispatch({
                      type: 'up_or_down_having_field',
                      payload: {
                        id: it.id,
                        direction: false,
                      },
                    })}
                  >
                    <ArrowDownOutlined />
                  </a>
                </div>
              );
            }
          })
        }
      </>
    );
  };

  return (
    <div style={{ maxHeight: 318, overflowY: 'auto' }}>
      {
        (having.length === 0) ? (
          <a>
            <FileAddOutlined style={{ marginRight: 6 }} onClick={() => handleAddFieldEquality('0')} />
            <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                  onClick={() => handleAddBracket('0')}>()</span>
            <span style={{ color: '#0000006e' }}>添加</span>
          </a>
        ) : (
          renderTree(having)
        )
      }
    </div>
  );
}

function LimitHandle({ limit, dispatch }) {
  const handleChangeLimit = (limitType, e) => {
    dispatch({
      type: 'limitChange',
      payload: {
        limitType,
        value: e.target.value,
      },
    });
  };

  return (
    <>
      <div>
        <Popover
          content={(
            <InputNumber
              min={0}
              placeholder="请输入"
              bordered={false}
              onPressEnter={(e) => handleChangeLimit('limit', e)}
              defaultValue={limit?.limit ?? ''}
            />
          )}>
          <span>Limit: {limit?.limit ?? ''}</span>
        </Popover>
      </div>
      <div>
        <Popover
          content={(
            <InputNumber
              min={0}
              placeholder="请输入"
              bordered={false}
              onPressEnter={(e) => handleChangeLimit('offset', e)}
              defaultValue={limit?.offset ?? ''}
            />
          )}>
          <span>Offset: {limit?.offset ?? ''}</span>
        </Popover>
      </div>
    </>
  );
}

function TableHandle({ keywordData = {}, tableList = [], dispatch }) {
  const items = [
    {
      key: '1',
      label: 'SELECT',
      children: (
        <SelectHandle select={keywordData.select} distinct={keywordData.distinct} dispatch={dispatch} />
      ),
    },
    {
      key: '2',
      label: 'FROM',
      children: <FromHandle from={keywordData.from} dispatch={dispatch} />,
    },
    {
      key: '3',
      label: 'WHERE',
      children: <WhereHandle where={keywordData.where} from={keywordData.from} tableList={tableList}
                             dispatch={dispatch} />,
    },
    {
      key: '4',
      label: 'GROUP BY',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '5',
      label: 'HAVING',
      children: <HavingHandle having={keywordData.having} from={keywordData.from} tableList={tableList}
                             dispatch={dispatch} />,
    },
    {
      key: '6',
      label: 'ORDER BY',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '7',
      label: 'LIMIT',
      children: <LimitHandle limit={keywordData.limit} dispatch={dispatch} />,
    },
  ];

  return (
    <div className="center_bottom">
      <Tabs size="small" defaultActiveKey="1" items={items} />
    </div>
  );
}

export default TableHandle;
