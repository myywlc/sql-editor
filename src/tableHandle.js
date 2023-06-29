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
        <TextArea placeholder="请输入以,分隔" rows={6} defaultValue={value}
                  onPressEnter={(e) => handleList(e.target.value)} />
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

const PopoverSelectSec = ({ selectData, dispatch, target, isCustom, value, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (data) => {
    if (!target) {
      dispatch({
        type: 'add_edit_table_field',
        payload: {
          tableName: data.tableName,
          tableNameAlias: data.tableNameAlias,
          field: data.title,
          checked: true,
        },
      });
    } else {
      dispatch({
        type: 'add_edit_table_field',
        payload: {
          id: target,
          tableName: data.tableName,
          tableNameAlias: data.tableNameAlias,
          field: data.title,
          checked: true,
        },
      });
    }

    setOpen(false);
  };

  const handleCustom = (data) => {
    if (!target) {
      dispatch({
        type: 'add_edit_table_field',
        payload: { value: data, isCustom: true },
      });
    } else {
      dispatch({
        type: 'add_edit_table_field',
        payload: { id: target, value: data, isCustom: true },
      });
    }
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

function SelectHandle({ select, from, tableList, distinct, dispatch }) {
  const selectData = useMemo(() => {
    const data = [
      {
        'title': '*',
        'key': '0-0',
        'isLeaf': true,
        'tableName': '',
        'tableNameAlias': '',
      },
    ];
    from.forEach((item, index) => {
      const { name, alias } = item;
      const fItem = tableList.find(item => item.tableName === name);
      if (!fItem) return;
      data.push({
        title: fItem.tableName + (alias ? `(${alias})` : ''),
        key: `0-${index + 1}`,
        children: fItem.data.map((it, i) => ({
          title: it.name,
          key: `0-${index + 1}-${i}`,
          isLeaf: true,
          tableName: name,
          tableNameAlias: alias,
        })),
      });
    });
    return data;
  }, [from, tableList]);

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
            <PopoverSelectSec selectData={selectData} dispatch={dispatch} isCustom={false} value={''}>
              <a><FileAddOutlined /> <span style={{ color: '#0000006e' }}>添加</span></a>
            </PopoverSelectSec>
          ) : (
            select.map((it, i) => {
              return (
                <div key={i} className="selectHover">
                  {it.isCustom ? (
                    <PopoverSelectSec selectData={selectData} dispatch={dispatch} isCustom={true}
                                      target={i + ''} value={it.value}>
                      Expression: {it.value || <span style={{ color: '#c0c0c0' }}>{'<value>'}</span>}
                    </PopoverSelectSec>
                  ) : (
                    <PopoverSelectSec selectData={selectData} dispatch={dispatch} isCustom={false}
                                      target={i + ''}>
                      {(it.tableNameAlias || it.tableName) ? (it.tableNameAlias || it.tableName) + '.' : ''}{it.field ? it.field : ''}
                    </PopoverSelectSec>
                  )} {
                  !it.fieldAlias ? (
                    <Popover
                      content={(
                        <Input
                          placeholder="请输入别名"
                          bordered={false}
                          onChange={(e) => handleClickFieldAlias(it.tableName, it.field, e)}
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
                          onChange={(e) => handleClickFieldAlias(it.tableName, it.field, e)}
                          defaultValue={it.fieldAlias}
                        />
                      )}>
                      <span>({it.fieldAlias})</span>
                    </Popover>
                  )
                }
                  {(lastIndex === i) && (
                    <PopoverSelectSec selectData={selectData} dispatch={dispatch} isCustom={false} value={''}>
                      <a style={{ marginLeft: 6 }}><FileAddOutlined /></a>
                    </PopoverSelectSec>
                  )}
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

const PopoverSelectFrom = ({
                             addTable,
                             selectData,
                             target,
                             fieldKey,
                             dispatch,
                             isCustom,
                             value,
                             children,
                           }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const addTableCard = (table) => {
    fetch('http://localhost:3001/' + table.tableName).then(res => res.json()).then(res => {
      const data = [{ name: '*', comment: '*' }, ...res.data];
      dispatch({ type: 'add_table_from', payload: { tableName: table.tableName, data } });
    });
  };

  const handleSelect = (data) => {
    if (!fieldKey) {
      if (addTable) {
        addTable({ tableName: data.title });
      } else {
        addTableCard({ tableName: data.title });
        dispatch({
          type: 'addFromFieldEquality',
          payload: {
            id: target,
            name: data.title,
            alias: '',
            isCustom: false,
          },
        });
      }
    } else {
      dispatch({
        type: 'changeFromKeyValue',
        payload: {
          id: target,
          fieldKey,
          value: data.title,
        },
      });
      dispatch({
        type: 'changeFromKeyValue',
        payload: {
          id: target,
          fieldKey: 'isCustom',
          value: false,
        },
      });
    }
    setOpen(false);
  };

  const handleCustom = (data) => {
    if (!fieldKey) {
      dispatch({
        type: 'addFromFieldEquality',
        payload: {
          id: target,
          name: data,
          alias: '',
          isCustom: true,
        },
      });
    } else {
      dispatch({
        type: 'changeFromKeyValue',
        payload: {
          id: target,
          fieldKey,
          value: data,
        },
      });
      dispatch({
        type: 'changeFromKeyValue',
        payload: {
          id: target,
          fieldKey: 'isCustom',
          value: true,
        },
      });
    }
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
        label: `Expression/Subquery`,
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

const PopoverRelationshipFrom = ({ target, dispatch, children }) => {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');


  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (value) => {
    if (value === 'Custom' && !custom) {
      message.warning('请输入custom!');
      return;
    }
    dispatch({
      type: 'changeFromKeyValue',
      payload: {
        id: target,
        fieldKey: 'operator',
        value: value === 'Custom' ? custom : value,
      },
    });
    setOpen(false);
  };

  const operatorList = [
    'INNER JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'CROSS JOIN',
    'FULL OUTER JOIN',
    ',',
    'Custom',
  ];

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <div style={{ width: 200, height: 300, overflow: 'auto' }}>
          <List
            size="small"
            dataSource={operatorList}
            renderItem={(item) => <List.Item
              onClick={() => handleSelect(item)}><a>{item}</a>{item === 'Custom' && (
              <Input style={{ marginLeft: 6 }} size="small" value={custom}
                     onChange={e => setCustom(e.target.value)} />
            )}</List.Item>}
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

const PopoverCondition = ({ dispatch, target, value, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleList = (data) => {
    dispatch({
      type: 'changeFromKeyValue',
      payload: {
        id: target,
        fieldKey: 'condition',
        value: data,
      },
    });

    setOpen(false);
  };

  return (
    <Popover
      destroyTooltipOnHide
      content={(
        <TextArea style={{ width: 300 }} placeholder="请输入condition" rows={6} defaultValue={value}
                  onPressEnter={(e) => handleList(e.target.value)} />
      )}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Popover>
  );
};

function FromHandle({ addTable, from, allTableList, dispatch }) {
  const selectData = useMemo(() => {
    const data = [];
    allTableList.forEach((item, index) => {
      const { tableName } = item;
      data.push({
        title: tableName,
        key: `0-${index}`,
      });
    });
    return data;
  }, [from, allTableList]);

  const handleRemoveItem = (id, isTable, tableName) => {
    dispatch({
      type: 'removeFromItem',
      payload: { id, isTable, tableName },
    });
  };

  const handleAddBracket = (id) => {
    dispatch({
      type: 'addFromBracket',
      payload: { id },
    });
  };

  const handleClickTableAlias = (id, e) => {
    dispatch({
      type: 'changeFromKeyValue',
      payload: {
        id,
        fieldKey: 'alias',
        value: e.target.value,
      },
    });
  };

  const handleClickTableOperator = (id, value) => {
    dispatch({
      type: 'changeFromKeyValue',
      payload: {
        id,
        fieldKey: 'operator',
        value,
      },
    });
  };

  const renderTree = (data, k = '') => {
    const lastIndex = data.length - 1;
    const length = k.split('-').map(it => Number(it)).length;

    return (
      <>
        {
          data.map((it, i) => {
            return (
              <div key={i}>
                {i !== 0 && (
                  <div className="selectHover">
                    <PopoverRelationshipFrom target={it.id} dispatch={dispatch}>
                      <a>{it.operator}</a>
                    </PopoverRelationshipFrom>
                    {
                      !['CROSS JOIN', ','].includes(it.operator) && (
                        <PopoverCondition target={it.id} dispatch={dispatch} value={it.condition}>
                          {it.condition ?
                            <span style={{ marginLeft: 6 }}>[{it.condition}]</span> : (
                              <span style={{
                                color: '#c0c0c0',
                                cursor: 'pointer',
                                marginLeft: 6,
                              }}>{'<Add Condition>'}</span>
                            )}
                        </PopoverCondition>
                      )
                    }
                    <a
                      className="selectHoverA"
                      style={{
                        color: '#fff',
                        backgroundColor: '#b2b2b2',
                        fontSize: 12,
                        padding: '0 5px',
                        marginLeft: 12,
                      }}
                      onClick={() => handleClickTableOperator(it.id, ',')}
                    >
                      X
                    </a>
                  </div>
                )}

                {
                  it.isBracket ? (
                    <div className="selectHover">
                      <div style={{ marginLeft: 6 * length }}>
                        {it.child.length > 0 ? (
                          <>
                            <div>(</div>
                            <div style={{ marginLeft: 6 }}>{renderTree(it.child, it.id)}</div>
                            <div>) {
                              lastIndex === i && (
                                <>
                                  <PopoverSelectFrom
                                    selectData={selectData}
                                    dispatch={dispatch}
                                    target={`${k ? (k + '-') : ''}${i + 1}`}
                                    isCustom={false}
                                  >
                                    <a style={{ marginLeft: 6, marginRight: 6 }}><FileAddOutlined /></a>
                                  </PopoverSelectFrom>
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
                                onClick={() => handleRemoveItem(it.id, !it.isCustom && !it.isBracket, it.name)}
                              >
                                X
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>(</div>
                            <PopoverSelectFrom
                              selectData={selectData}
                              dispatch={dispatch}
                              target={`${it.id + '-'}${0}`}
                              isCustom={false}
                            >
                              <a style={{ marginLeft: 6, marginRight: 6 }}><FileAddOutlined /></a>
                            </PopoverSelectFrom>
                            <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                                  onClick={() => handleAddBracket(`${it.id + '-'}${0}`)}>()</span>
                            <div>) {
                              lastIndex === i && (
                                <>
                                  <PopoverSelectFrom
                                    selectData={selectData}
                                    dispatch={dispatch}
                                    target={`${k ? (k + '-') : ''}${i + 1}`}
                                    isCustom={false}
                                  >
                                    <a style={{ marginLeft: 6, marginRight: 6 }}><FileAddOutlined /></a>
                                  </PopoverSelectFrom>
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
                                onClick={() => handleRemoveItem(it.id, !it.isCustom && !it.isBracket, it.name)}
                              >
                                X
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="selectHover">
                      <PopoverSelectFrom
                        selectData={selectData}
                        dispatch={dispatch}
                        target={it.id}
                        fieldKey={'name'}
                        isCustom={it.isCustom}
                        value={it.name}
                      >
                    <span className={'fontOverflow'}
                          style={{
                            marginRight: 6,
                            cursor: 'pointer',
                          }}>{it.isCustom && 'Expression: '}{it.name}</span>
                      </PopoverSelectFrom>
                      {
                        !it.alias ? (
                          <Popover
                            content={(
                              <Input
                                placeholder="请输入别名"
                                bordered={false}
                                onChange={(e) => handleClickTableAlias(it.id, e)}
                              />
                            )}>
                            <span style={{ color: '#c0c0c0', cursor: 'pointer' }}>{'<alias>'}</span>
                          </Popover>
                        ) : (
                          <Popover
                            content={(
                              <Input
                                placeholder="请输入别名"
                                bordered={false}
                                onChange={(e) => handleClickTableAlias(it.id, e)}
                                defaultValue={it.alias}
                              />
                            )}>
                            <span style={{ cursor: 'pointer' }}>({it.alias})</span>
                          </Popover>
                        )
                      }
                      {
                        lastIndex === i && (
                          <>
                            <PopoverSelectFrom
                              selectData={selectData}
                              dispatch={dispatch}
                              target={`${k ? (k + '-') : ''}${i + 1}`}
                              isCustom={false}
                            >
                              <a style={{ marginLeft: 6, marginRight: 6 }}><FileAddOutlined /></a>
                            </PopoverSelectFrom>
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
                        onClick={() => handleRemoveItem(`${k ? (k + '-') : ''}${i}`, !it.isCustom && !it.isBracket, it.name)}
                      >
                        X
                      </a>
                    </div>
                  )
                }
              </div>
            );
          })
        }
      </>
    );
  };

  return (
    <div style={{ maxHeight: 318, overflowY: 'auto' }}>
      {
        (from.length === 0) ? (
          <a>
            <PopoverSelectFrom
              addTable={addTable}
              selectData={selectData}
              dispatch={dispatch}
              isCustom={false}
              target={'0'}
              value={''}
            >
              <FileAddOutlined style={{ marginRight: 6 }} />
            </PopoverSelectFrom>
            <span style={{ color: '#1577ff', marginRight: 6, cursor: 'pointer' }}
                  onClick={() => handleAddBracket('0')}>()</span>
            <span style={{ color: '#0000006e' }}>添加</span>
          </a>
        ) : (
          renderTree(from)
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
      if (!fItem) return;
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

const PopoverSelectGroupBy = ({ selectData, dispatch, value = '', isCustom, index, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (data) => {
    if (index) {
      dispatch({
        type: 'change_groupBy',
        payload: {
          index: Number(index),
          tableName: data.tableName,
          tableAlias: data.tableAlias,
          field: data.title,
          isCustom: false,
        },
      });
    } else {
      dispatch({
        type: 'add_groupBy',
        payload: {
          tableName: data.tableName,
          tableAlias: data.tableAlias,
          field: data.title,
          isCustom: false,
        },
      });
    }
    setOpen(false);
  };

  const handleCustom = (data) => {
    if (index) {
      dispatch({
        type: 'change_groupBy',
        payload: {
          index: Number(index),
          value: data,
          isCustom: true,
        },
      });
    } else {
      dispatch({
        type: 'add_groupBy',
        payload: {
          value: data,
          isCustom: true,
        },
      });
    }

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

function GroupByHandle({ groupBy, from, tableList, dispatch }) {
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

  const lastIndex = groupBy.length - 1;
  return (
    <div style={{ maxHeight: 318, overflowY: 'auto' }}>
      {
        (groupBy.length === 0) ? (
          <a>
            <PopoverSelectGroupBy selectData={selectData} dispatch={dispatch} isCustom={false}>
              <FileAddOutlined style={{ marginRight: 6 }} />
            </PopoverSelectGroupBy>
            <span style={{ color: '#0000006e' }}>添加</span>
          </a>
        ) : (
          groupBy.map((it, i) => {
            if (it.isCustom) {
              return (
                <div key={i} className="selectHover">
                  <PopoverSelectGroupBy selectData={selectData} dispatch={dispatch} isCustom={true}
                                        value={it.value} index={i + ''}>
                    Expression: <a>{`${it.value}`}</a>
                  </PopoverSelectGroupBy>
                  {(lastIndex === i) && (
                    <a style={{ marginLeft: 6 }}>
                      <PopoverSelectGroupBy selectData={selectData} dispatch={dispatch} isCustom={false}>
                        <FileAddOutlined style={{ marginRight: 6 }} />
                      </PopoverSelectGroupBy>
                    </a>
                  )}
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
                      type: 'remove_groupBy',
                      payload: {
                        index: i,
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
                          type: 'up_or_down_groupBy',
                          payload: {
                            fromIndex: i,
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
                          type: 'up_or_down_groupBy',
                          payload: {
                            fromIndex: i,
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
            } else {
              return (
                <div key={i} className="selectHover">
                  <PopoverSelectGroupBy selectData={selectData} dispatch={dispatch} isCustom={false}
                                        index={i + ''}>
                    <a>{`${it.tableAlias || it.tableName}.${it.field}`}</a>
                  </PopoverSelectGroupBy>
                  {(lastIndex === i) && (
                    <a style={{ marginLeft: 6 }}>
                      <PopoverSelectGroupBy selectData={selectData} dispatch={dispatch} isCustom={false}>
                        <FileAddOutlined style={{ marginRight: 6 }} />
                      </PopoverSelectGroupBy>
                    </a>
                  )}
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
                      type: 'remove_groupBy',
                      payload: {
                        index: i,
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
                          type: 'up_or_down_groupBy',
                          payload: {
                            fromIndex: i,
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
                          type: 'up_or_down_groupBy',
                          payload: {
                            fromIndex: i,
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
            }
          })
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
        <TextArea placeholder="请输入以,分隔" rows={6} defaultValue={value}
                  onPressEnter={(e) => handleList(e.target.value)} />
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

const PopoverSelectOrderBy = ({ selectData, dispatch, value = '', isCustom, index, order, children }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleSelect = (data) => {
    if (index) {
      dispatch({
        type: 'change_orderBy',
        payload: {
          index: Number(index),
          tableName: data.tableName,
          tableAlias: data.tableAlias,
          field: data.title,
          order,
          isCustom: false,
        },
      });
    } else {
      dispatch({
        type: 'add_orderBy',
        payload: {
          tableName: data.tableName,
          tableAlias: data.tableAlias,
          field: data.title,
          order: '',
          isCustom: false,
        },
      });
    }
    setOpen(false);
  };

  const handleCustom = (data) => {
    if (index) {
      dispatch({
        type: 'change_orderBy',
        payload: {
          index: Number(index),
          value: data,
          order,
          isCustom: true,
        },
      });
    } else {
      dispatch({
        type: 'add_orderBy',
        payload: {
          value: data,
          order: '',
          isCustom: true,
        },
      });
    }

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

function OrderByHandle({ orderBy, from, tableList, dispatch }) {
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

  const handleChangeOrder = (data, index) => {
    const { order } = data;
    const newOrder = !order ? 'Ascending' : order === 'Ascending' ? 'Descending' : '';
    dispatch({
      type: 'change_orderBy',
      payload: {
        ...data,
        index: Number(index),
        order: newOrder,
      },
    });
  };

  const lastIndex = orderBy.length - 1;
  return (
    <div style={{ maxHeight: 318, overflowY: 'auto' }}>
      {
        (orderBy.length === 0) ? (
          <a>
            <PopoverSelectOrderBy selectData={selectData} dispatch={dispatch} isCustom={false}>
              <FileAddOutlined style={{ marginRight: 6 }} />
            </PopoverSelectOrderBy>
            <span style={{ color: '#0000006e' }}>添加</span>
          </a>
        ) : (
          orderBy.map((it, i) => {
            if (it.isCustom) {
              return (
                <div key={i} className="selectHover">
                  <PopoverSelectOrderBy selectData={selectData} dispatch={dispatch} isCustom={true}
                                        value={it.value} index={i + ''} order={it.order}>
                    Expression: <a>{`${it.value}`}</a>
                  </PopoverSelectOrderBy>
                  <a onClick={() => handleChangeOrder(it, i)}>{it.order ?
                    <span style={{ marginLeft: 6 }}>{it.order}</span> :
                    <span style={{ color: '#c0c0c0', marginLeft: 6 }}>{'<order>'}</span>}</a>
                  {(lastIndex === i) && (
                    <a style={{ marginLeft: 6 }}>
                      <PopoverSelectOrderBy selectData={selectData} dispatch={dispatch} isCustom={false}>
                        <FileAddOutlined style={{ marginRight: 6 }} />
                      </PopoverSelectOrderBy>
                    </a>
                  )}
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
                      type: 'remove_orderBy',
                      payload: {
                        index: i,
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
                          type: 'up_or_down_orderBy',
                          payload: {
                            fromIndex: i,
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
                          type: 'up_or_down_orderBy',
                          payload: {
                            fromIndex: i,
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
            } else {
              return (
                <div key={i} className="selectHover">
                  <PopoverSelectOrderBy selectData={selectData} dispatch={dispatch} isCustom={false}
                                        index={i + ''} order={it.order}>
                    <a>{`${it.tableAlias || it.tableName}.${it.field}`}</a>
                  </PopoverSelectOrderBy>
                  <a onClick={() => handleChangeOrder(it, i)}>{it.order ?
                    <span style={{ marginLeft: 6 }}>{it.order}</span> :
                    <span style={{ color: '#c0c0c0', marginLeft: 6 }}>{'<order>'}</span>}</a>
                  {(lastIndex === i) && (
                    <a style={{ marginLeft: 6 }}>
                      <PopoverSelectOrderBy selectData={selectData} dispatch={dispatch} isCustom={false}>
                        <FileAddOutlined style={{ marginRight: 6 }} />
                      </PopoverSelectOrderBy>
                    </a>
                  )}
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
                      type: 'remove_orderBy',
                      payload: {
                        index: i,
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
                          type: 'up_or_down_orderBy',
                          payload: {
                            fromIndex: i,
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
                          type: 'up_or_down_orderBy',
                          payload: {
                            fromIndex: i,
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
            }
          })
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
              onChange={(e) => handleChangeLimit('limit', e)}
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
              onChange={(e) => handleChangeLimit('offset', e)}
              defaultValue={limit?.offset ?? ''}
            />
          )}>
          <span>Offset: {limit?.offset ?? ''}</span>
        </Popover>
      </div>
    </>
  );
}

function TableHandle({ addTable, keywordData = {}, tableList = [], allTableList, dispatch }) {
  const items = [
    {
      key: '1',
      label: 'SELECT',
      children: (
        <SelectHandle select={keywordData.select} distinct={keywordData.distinct} from={keywordData.from}
                      tableList={tableList} dispatch={dispatch} />
      ),
    },
    {
      key: '2',
      label: 'FROM',
      children: <FromHandle addTable={addTable} from={keywordData.from} allTableList={allTableList}
                            dispatch={dispatch} />,
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
      children: <GroupByHandle groupBy={keywordData.groupBy} from={keywordData.from} tableList={tableList}
                               dispatch={dispatch} />,
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
      children: <OrderByHandle orderBy={keywordData.orderBy} from={keywordData.from} tableList={tableList}
                               dispatch={dispatch} />,
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
