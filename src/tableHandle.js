import { Checkbox, Input, Popover, Tabs } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, FileAddOutlined } from '@ant-design/icons';

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

function TableHandle({ keywordData = {}, dispatch }) {
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
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'WHERE',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '4',
      label: 'GROUP BY',
      children: 'Content of Tab Pane 1',
    },
    {
      key: '5',
      label: 'HAVING',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '6',
      label: 'ORDER BY',
      children: 'Content of Tab Pane 3',
    },
    {
      key: '7',
      label: 'LIMIT',
      children: 'Content of Tab Pane 3',
    },
  ];

  return (
    <div className="center_bottom">
      <Tabs size="small" defaultActiveKey="1" items={items} />
    </div>
  );
}

export default TableHandle;
