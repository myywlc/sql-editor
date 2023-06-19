import { Card, Checkbox, List, Space } from 'antd';

function TableCard({ tableList = [], dispatch }) {
  return (
    <div className="center_top">
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
            >
              <List
                size="small"
                itemLayout="horizontal"
                dataSource={item.data}
                renderItem={(it) => (
                  <List.Item style={{ padding: '6px 0' }}>
                    <Checkbox
                      onClick={() => dispatch({
                        type: 'add_table_field',
                        payload: { tableName: item.tableName, field: it.name },
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
