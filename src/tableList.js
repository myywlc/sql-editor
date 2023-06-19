import { useEffect, useState } from 'react';
import { List } from 'antd';
import { TableOutlined } from '@ant-design/icons';

function TableList({ dispatch }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/list').then(res => res.json()).then(res => {
      setData(res.data);
    });
  }, []);

  const handleClickAddTable = (table) => {
    fetch('http://localhost:3001/' + table.tableName).then(res => res.json()).then(res => {
      dispatch({ type: 'add_table', payload: { tableName: table.tableName, data: res.data } });
    });
  };

  return (
    <div className="left">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<TableOutlined style={{ fontSize: 24, margin: '6px 0 0 6px' }} rotate={90} />}
              title={<a onClick={() => handleClickAddTable(item)}
                        style={{ fontWeight: 500 }}>{item.tableName}</a>}
              description={<span style={{ fontSize: 12 }}>{item?.comment ?? ''}</span>}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default TableList;
