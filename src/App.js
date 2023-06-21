import { useReducer } from 'react';
import reducer from './reducer';
import TableList from './tableList';
import TableCard from './tableCard';
import RenderEditor from './renderEditor';
import TableHandle from './tableHandle';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, {
    tableList: [],
    keywordData: {
      select: [],
      from: [],
      where: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: [],
      distinct: false,
    },
    sql: '',
  });

  const addTable = (table) => {
    const find = state.tableList.find(it => it.tableName === table.tableName);
    if (find) return;
    fetch('http://localhost:3001/' + table.tableName).then(res => res.json()).then(res => {
      const data = [{ name: '*', comment: '*' }, ...res.data];
      dispatch({ type: 'add_table', payload: { tableName: table.tableName, data } });
    });
  };

  return (
    <div className="app">
      <TableList addTable={addTable} />
      <div className="center">
        <TableCard tableList={state.tableList} dispatch={dispatch} addTable={addTable} />
        <TableHandle keywordData={state.keywordData} dispatch={dispatch} />
      </div>
      <RenderEditor keywordData={state.keywordData} />
    </div>
  );
}

export default App;
