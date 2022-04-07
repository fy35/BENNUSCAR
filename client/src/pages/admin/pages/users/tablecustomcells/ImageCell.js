import React from 'react';
//table comps
import { Table } from 'rsuite';

const { Cell } = Table;

const ImageCell = ({ rowData, dataKey, ...props }) => {
  console.log(rowData[dataKey]);
  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div className="w-[40px] h-[40px] bg-white rounded-full mt-[2px] overflow-hidden inline-block ">
        <img
          src={
            rowData[dataKey] !== undefined
              ? `../uploads/profiles/${rowData[dataKey]}`
              : '../assets/null-person.jpg'
          }
          width="40"
          alt=""
        />
      </div>
    </Cell>
  );
};

export default ImageCell;
