import React from 'react';
//table comps
import { Table } from 'rsuite';

const { Cell } = Table;

const ImageCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Cell {...props} style={{ padding: 0 }}>
      <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-white sm:mx-auto sm:h-[40px] sm:w-[40px] ">
        <img
          src={rowData.carImage ? `../uploads/cars/${rowData.carImage}` : '/assets/null.png'}
          alt=""
        />
      </div>
    </Cell>
  );
};

export default ImageCell;
