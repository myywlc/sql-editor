import { useEffect, useRef, useState } from 'react';
import { List } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { useDrag } from 'ahooks';

function ListItem({ addTable, item }) {
  const dragRef = useRef(null);
  useDrag(item, dragRef);

  return (
    <List.Item ref={dragRef} style={{ backgroundColor: '#fff' }}>
      <List.Item.Meta
        avatar={<TableOutlined style={{ fontSize: 24, margin: '6px 0 0 6px' }} rotate={90} />}
        title={<a onClick={() => addTable(item)} style={{ fontWeight: 500 }}>{item.tableName}</a>}
        description={<span style={{ fontSize: 12 }}>{item?.comment ?? ''}</span>}
      />
    </List.Item>
  );
}

function TableList({ addTable }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/list').then(res => res.json()).then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="left">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <ListItem item={item} addTable={addTable} />
        )}
      />
    </div>
  );
}

export default TableList;
