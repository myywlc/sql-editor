import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

function RenderEditor({ keywordData }) {
  const selectStringFn = (select,distinct) => {
    let selectString;
    if (select && select.length === 0) {
      selectString = `
SELECT${distinct ? ' DISTINCT' : ''}
  *
`;
    } else {
      selectString = `
SELECT${distinct ? ' DISTINCT' : ''}`;
      selectString = [selectString, ...select.map((it, i) => (it.tableNameAlias ? `"${it.tableNameAlias}"` : it.tableName) + '.' + it.field + (it.fieldAlias ? ` AS "${it.fieldAlias}"` : '') + ((select.length - 1) !== i ? ',' : ''))].join('\n  ');
    }
    return selectString;
  };

  const fromStringFn = (from) => {
    let fromString = '';
    if (from.length > 0) {
      fromString = `
FROM`;
      fromString = [fromString, ...from.map((it, i) => it.name + (it.alias ? ` AS "${it.alias}"` : '') + ((from.length - 1) !== i ? ',' : ''))].join('\n  ');
    }
    return fromString;
  };

  const parseSql = (keywordData) => {
    const { select, from, where, groupBy, having, orderBy, limit, distinct } = keywordData;
    let whereString = '', groupByString = '', havingString = '',
      orderByString = '', limitString = '';

    const selectString = selectStringFn(select, distinct);
    const fromString = fromStringFn(from);

    return selectString + fromString + whereString + groupByString + havingString + orderByString + limitString;
  };

  return (
    <div className="right">
      <AceEditor
        mode="mysql"
        theme="monokai"
        name="blah2"
        fontSize={14}
        showPrintMargin={false}
        showGutter={false}
        highlightActiveLine={false}
        highlightSelectedWord={false}
        width={'450px'}
        height={'125%'}
        readOnly={true}
        value={parseSql(keywordData)}
        tabSize={4}
        style={{
          transform: 'scale(.8)',
          transformOrigin: '0 0 0',
        }}
        setOptions={{
          // selectionStyle: 'text',
          // highlightActiveLine: false,
          // highlightSelectedWord: false,
        }}
      />
    </div>
  );
}

export default RenderEditor;
