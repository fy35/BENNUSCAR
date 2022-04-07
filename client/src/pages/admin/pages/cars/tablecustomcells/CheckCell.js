import React from 'react';

//table comps
import { Table, Checkbox } from 'rsuite';

const { Cell } = Table;

const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => {
  //check input

  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div style={{ lineHeight: '46px' }}>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some((item) => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  );
};

export default CheckCell;
