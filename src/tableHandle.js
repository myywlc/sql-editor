import { Tabs } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';

function RenderHandle({ active, data }) {
  return (
    <div>
      {
        (active === 'select' && data.length === 0) && (
          <a><FileAddOutlined /> <span style={{ color: '#0000006e' }}>添加字段</span></a>)
      }
    </div>
  );
}

function TableHandle({ keywordData = {}, dispatch }) {
  const items = [
    {
      key: '1',
      label: 'SELECT',
      children: <RenderHandle active="select" data={keywordData.select} />,
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
