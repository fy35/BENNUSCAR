import React from 'react';
import { Link } from 'react-router-dom';

//table comps
import { Table, Popover, Whisper } from 'rsuite';

const { Cell } = Table;

const NameCell = ({ rowData, dataKey, ...props }) => {
  //popover to user info when hover fullname

  const speaker = (
    <Popover title="Description">
      <p>
        <b>Name:</b> {`${rowData.fullname}`}{' '}
      </p>
      <p>
        <b>Email:</b> {rowData.email}{' '}
      </p>
      <p>
        <b>Company:</b> {rowData.companyName}{' '}
      </p>
      <p>
        <b>Sentence:</b> {rowData.sentence}{' '}
      </p>
    </Popover>
  );

  return (
    <Cell {...props}>
      <Whisper placement="top" speaker={speaker}>
        <Link to="#">{rowData[dataKey].toLocaleString()}</Link>
      </Whisper>
    </Cell>
  );
};

export default NameCell;
