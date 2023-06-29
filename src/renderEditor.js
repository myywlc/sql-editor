import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

function RenderEditor({ keywordData }) {
  const selectStringFn = (select, distinct) => {
    let selectString;
    if (select && select.length === 0) {
      selectString = `
SELECT${distinct ? ' DISTINCT' : ''}
  *
`;
    } else {
      selectString = `
SELECT${distinct ? ' DISTINCT' : ''}`;
      selectString = [selectString, ...select.map((it, i) => (it.isCustom ? it.value + (it.fieldAlias ? ` AS "${it.fieldAlias}"` : '') : ((it.tableNameAlias ? `"${it.tableNameAlias}"` : it.tableName) ? (it.tableNameAlias ? `"${it.tableNameAlias}"` : it.tableName) + '.' : '') + it.field + (it.fieldAlias ? ` AS "${it.fieldAlias}"` : '')) + ((select.length - 1) !== i ? ',' : ''))].join('\n  ');
    }
    return selectString;
  };

  const fromStringFn = (from) => {
    let fromString = '';
    const operatorValue = (operator, name, condition, kg) => {
      const on = condition ? `
${kg}ON
${kg}${condition}` : '';

      if ([
        'INNER JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'FULL OUTER JOIN',
      ].includes(operator)) {
        switch (operator) {
          case 'INNER JOIN':
            return `${kg}INNER JOIN
${kg}${name}` + on;
          case 'LEFT JOIN':
            return `${kg}LEFT JOIN
${kg}${name}` + on;
          case 'RIGHT JOIN':
            return `${kg}RIGHT JOIN
${kg}${name}` + on;
          case 'FULL OUTER JOIN':
            return `${kg}FULL OUTER JOIN
${kg}${name}` + on;
          default:
        }
      } else if (['CROSS JOIN', ','].includes(operator)) {
        switch (operator) {
          case 'CROSS JOIN':
            return `${kg}CROSS JOIN
${kg}${name}`;
          case ',':
            return `${kg},
${kg}${name}`;
          default:
        }
      } else {
        return `${kg}${operator}
${kg}${name}` + on;
      }
    };

    if (from.length > 0) {
      fromString = `
FROM
`;
      const string = (data, str) => {
        data.forEach((item, index) => {
          const ids = item.id.split('-').map(it => Number(it));
          const kg = ids.map(it => '  ').join('');
          if (item.isBracket) {
            str = str + operatorValue(item.operator, `\n${kg}(
${string(item.child, '')}
${kg})\n`, item.condition, kg);
          } else {
            str = str + `${index !== 0 ? operatorValue(item.operator, item.name, item.condition, kg) : kg + item.name}\n`;
          }
        });
        return str;
      };

      fromString = string(from, fromString);
    }


    return fromString;
  };

  const operatorAndRightValue = (operator, rightValue) => {
    if ([
      '=',
      '<>',
      '<',
      '<=',
      '>',
      '>=',
    ].includes(operator)) {
      return `${operator} ${rightValue}`;
    } else if ([
      'is like',
      'is not like',
      'contains',
      'does not contain',
      'begins with',
      'does not begin with',
      'ends with',
      'does not end with',
    ].includes(operator)) {
      switch (operator) {
        case 'is like':
          return `LIKE ${rightValue}`;
        case 'is not like':
          return `NOT LIKE ${rightValue}`;
        case 'contains':
          return `LIKE '%${rightValue}%'`;
        case 'does not contain':
          return `NOT LIKE '%${rightValue}%'`;
        case 'begins with':
          return `LIKE '${rightValue}%'`;
        case 'does not begin with':
          return `NOT LIKE '${rightValue}%'`;
        case 'ends with':
          return `LIKE '%${rightValue}'`;
        case 'does not end with':
          return `NOT LIKE '%${rightValue}'`;
        default:
      }
    } else if (['is null', 'is not null', 'is empty', 'is not empty', '[Custom]'].includes(operator)) {
      switch (operator) {
        case 'is null':
          return `IS NULL`;
        case 'is not null':
          return `IS NOT NULL`;
        case 'is empty':
          return ` = ""`;
        case 'is not empty':
          return `<> ""`;
        case '[Custom]':
          return ``;
        default:
      }
    } else if (['is between', 'is not between'].includes(operator)) {
      switch (operator) {
        case 'is between':
          return `BETWEEN ${rightValue}`;
        case 'is not between':
          return `NOT BETWEEN ${rightValue}`;
        default:
      }
    } else if (['is in list', 'is not in list'].includes(operator)) {
      switch (operator) {
        case 'is in list':
          return `IN (${rightValue})`;
        case 'is not in list':
          return `NOT IN (${rightValue})`;
        default:
      }
    }
  };

  const whereStringFn = (where) => {
    let whereString = '';
    if (where.length > 0) {
      whereString = `
WHERE
`;
      const string = (data, str) => {
        data.forEach((item, index) => {
          const lastIndex = data.length - 1;
          const ids = item.id.split('-').map(it => Number(it));
          if (item.isBracket) {
            str = str + `\n${ids.map(() => '  ').join('')}(
${string(item.child, '')}
${ids.map(() => '  ').join('')}) ${lastIndex === index ? '' : item.connectors}\n`;
          } else {
            str = str + `${ids.map(it => '  ').join('')}${item.leftValue} ${operatorAndRightValue(item.operator, item.rightValue)} ${lastIndex === index ? '' : item.connectors}\n`;
          }
        });

        return str;
      };

      whereString = string(where, whereString);
    }
    return whereString;
  };

  const groupByStringFn = (groupBy) => {
    let groupByString = '';
    if (groupBy && groupBy.length > 0) {
      groupByString = `
GROUP BY`;
      groupByString = [groupByString, ...groupBy.map((it, i) => (it.isCustom ? it.value : ((it.tableAlias ? `"${it.tableAlias}"` : it.tableName) + '.' + it.field)) + ((groupBy.length - 1) !== i ? ',' : ''))].join('\n  ');
    }
    return groupByString;
  };

  const havingStringFn = (having) => {
    let havingString = '';
    if (having.length > 0) {
      havingString = `
HAVING
`;
      const string = (data, str) => {
        data.forEach((item, index) => {
          const lastIndex = data.length - 1;
          const ids = item.id.split('-').map(it => Number(it));
          if (item.isBracket) {
            str = str + `\n${ids.map(() => '  ').join('')}(
${string(item.child, '')}
${ids.map(() => '  ').join('')}) ${lastIndex === index ? '' : item.connectors}\n`;
          } else {
            str = str + `${ids.map(it => '  ').join('')}${item.leftValue} ${operatorAndRightValue(item.operator, item.rightValue)} ${lastIndex === index ? '' : item.connectors}\n`;
          }
        });

        return str;
      };

      havingString = string(having, havingString);
    }
    return havingString;
  };

  const orderByStringFn = (orderBy) => {
    let orderByString = '';
    if (orderBy && orderBy.length > 0) {
      orderByString = `
ORDER BY`;
      orderByString = [orderByString, ...orderBy.map((it, i) => (it.isCustom ? it.value : ((it.tableAlias ? `"${it.tableAlias}"` : it.tableName) + '.' + it.field)) + `${it.order ? it.order === 'Ascending' ? ' ASC' : ' DESC' : ''}` + ((orderBy.length - 1) !== i ? ',' : ''))].join('\n  ');
    }
    return orderByString;
  };

  const limitStringFn = (limit) => {
    let limitString = '';
    if (limit.limit) {
      limitString += `
LIMIT ${limit.limit}`;
    }
    if (limit.limit && limit.offset) {
      limitString += `
OFFSET ${limit.offset}`;
    }
    return limitString;
  };

  const parseSql = (keywordData) => {
    const { select, from, where, groupBy, having, orderBy, limit, distinct } = keywordData;

    const selectString = selectStringFn(select, distinct);
    const fromString = fromStringFn(from);
    const whereString = whereStringFn(where);
    const groupByString = groupByStringFn(groupBy);
    const havingString = havingStringFn(having);
    const orderByString = orderByStringFn(orderBy);
    const limitString = limitStringFn(limit);

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
      {/*<div className="unUserSelect" />*/}
    </div>
  );
}

export default RenderEditor;
