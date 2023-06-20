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
    },
    sql: '',
  });

  return (
    <div className="app">
      <TableList tableList={state.tableList} dispatch={dispatch} />
      <div className="center">
        <TableCard tableList={state.tableList} dispatch={dispatch} />
        <TableHandle keywordData={state.keywordData} dispatch={dispatch} />
      </div>
      <RenderEditor keywordData={state.keywordData} />
    </div>
  );
}

export default App;
