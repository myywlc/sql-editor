import { useReducer } from 'react';
import reducer from './reducer';
import TableList from './tableList';
import TableCard from './tableCard';
import './App.css';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import TableHandle from './tableHandle';


const code = `
SELECT
  cs_arbitrate_damage.mistake_no, 
  cs_arbitrate_damage."id", 
  cs_arbitrate_damage.pollute_no, 
  cs_appraise_statistics.appraisee_no, 
  cs_appraise_statistics.appraisee_name, 
  cs_appraise_statistics.appraisee_position_id
FROM
  cs_arbitrate_damage,
  cs_appraise_statistics
WHERE
  cs_arbitrate_damage.miss_weight = 111
 AND
  cs_arbitrate_damage.liquid_weight = 222

GROUP BY
  cs_arbitrate_damage.liguid_volume, 
  cs_arbitrate_damage.delete_status
HAVING
  cs_appraise_statistics.appraisee_no = 1
ORDER BY
  cs_arbitrate_damage.miss_number
LIMIT 0
OFFSET 0
`;

function App() {
  const [state, dispatch] = useReducer(reducer, {
    tableList: [],
    keywordData: {
      select: [],
    },
    sql: {},
  });

  return (
    <div className="app">
      <TableList dispatch={dispatch} />
      <div className="center">
        <TableCard tableList={state.tableList} dispatch={dispatch} />
        <TableHandle keywordData={state.keywordData} dispatch={dispatch} />
      </div>
      <div className="right">
        <AceEditor
          mode="mysql"
          theme="monokai"
          name="blah2"
          fontSize={18}
          showPrintMargin={false}
          showGutter={false}
          highlightActiveLine={false}
          width={'720px'}
          height={'200%'}
          readOnly={true}
          value={code}
          tabSize={4}
          style={{
            transform: 'scale(.5)',
            transformOrigin: '0 0 0',
          }}
        />
      </div>
    </div>
  );
}

export default App;
