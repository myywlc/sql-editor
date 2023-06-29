import { useEffect, useRef } from 'react';
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

function TableList({ allTableList, addTable, dispatch }) {
  useEffect(() => {
    fetch('http://localhost:3001/list').then(res => res.json()).then(res => {
      dispatch({
        type: 'init_table',
        payload: res.data,
      });
    });
  }, []);

  return (
    <div className="left">
      <List
        itemLayout="horizontal"
        dataSource={allTableList}
        renderItem={(item) => (
          <ListItem item={item} addTable={addTable} />
        )}
      />
    </div>
  );
}

export default TableList;
