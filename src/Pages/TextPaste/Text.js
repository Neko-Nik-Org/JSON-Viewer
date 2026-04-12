import React from 'react';
import { Box } from '@mui/material';
import TextSettingsPannel from '../../Components/TextBased/TextSettingsPannel';
import InputTextArea from '../../Components/TextBased/InputTextArea';

const Text = ({ jsonData, setJsonData }) => (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
    <TextSettingsPannel jsonData={jsonData} setJsonData={setJsonData} />
    <InputTextArea      jsonData={jsonData} setJsonData={setJsonData} />
  </Box>
);

export default Text;
