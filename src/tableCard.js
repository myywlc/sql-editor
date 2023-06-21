import { Card, Checkbox, List, Space } from 'antd';
import { useRef } from 'react';
import { useDrop } from 'ahooks';

function TableCard({ tableList = [], addTable, dispatch }) {
  const dropRef = useRef(null);

  useDrop(dropRef, {
    onDom: addTable,
  });

  return (
    <div className="center_top" ref={dropRef}>
      <Space direction="horizontal" size={16} align={'center'} style={{ padding: '20px 20px' }}>
        {
          tableList.map((item, i) => (
            <Card
              key={i}
              size={'small'}
              title={item.tableName}
              headStyle={{ backgroundColor: '#69aff8', color: '#fff' }}
              bodyStyle={{ overflowY: 'auto', height: 260 }}
              hoverable
              style={{
                width: 260,
                height: 300,
              }}
              extra={(
                <a
                  style={{ color: '#fff' }}
                  onClick={() => dispatch({
                    type: 'remove_table',
                    payload: { tableName: item.tableName },
                  })}
                >
                  X
                </a>
              )}
            >
              <List
                size="small"
                itemLayout="horizontal"
                dataSource={item.data}
                renderItem={(it) => (
                  <List.Item style={{ padding: '6px 0' }}>
                    <Checkbox
                      onChange={(e) => dispatch({
                        type: 'add_or_remove_table_field',
                        payload: { tableName: item.tableName, field: it.name, checked: e.target.checked },
                      })}
                      checked={it?.checked ?? false}
                    >
                      {it.name}
                    </Checkbox>
                  </List.Item>
                )}
              />
            </Card>
          ))
        }
      </Space>
    </div>
  );
}

export default TableCard;
