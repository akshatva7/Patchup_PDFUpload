import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const DropArea = () => {
  const [uploadMessage, setUploadMessage] = useState('');
  const [geminiData, setGeminiData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setErrorMessage('');
    setGeminiData(null);
    setUploadMessage('');

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        uploadFile(file);
      } else {
        setErrorMessage('Invalid file type. Please upload a PDF file.');
      }
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf'];
    return allowedTypes.includes(file.type);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    setUploadMessage('Uploading file...');
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const fetchurl = "https://patchuppdf-upload-backend.onrender.com/upload";
      const response = await fetch(fetchurl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Received data from backend:', data);

      if (response.ok) {
        setUploadMessage(data.uploadConfirmation || 'File uploaded successfully.');
        setGeminiData(data.geminiResponse || {});
      } else {
        setErrorMessage(data.message || 'Error uploading file.');
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      setErrorMessage('An unexpected error occurred during file upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderMainArtist = () => {
    if (!geminiData?.main_artist) return null;
    return (
      <Typography variant="h6" sx={{ mt: 4 }}>
        Main Artist: {geminiData.main_artist}
      </Typography>
    );
  };

  const renderInstrumentsAndBacklines = () => {
    if (!geminiData?.instruments_and_backlines?.length) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Instruments and Backline
        </Typography>
        {geminiData.instruments_and_backlines.map((sectionData, index) => (
          <Box key={index} sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {sectionData.section}
            </Typography>
            <ul>
              {sectionData.items.map((item, idx) => (
                <li key={idx}>
                  <Typography variant="body2">{item}</Typography>
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
    );
  };

  const renderPatchListTable = () => {
    if (!geminiData?.patch_list_table?.length) return null;

    const headers = Object.keys(geminiData.patch_list_table[0]);

    return (
      <Box sx={{ mt: 4, width: '100%' }}>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Patch List Table
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {geminiData.patch_list_table.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white',
                  }}
                >
                  {headers.map((header) => (
                    <TableCell key={header}>{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>
      <Box
        id="drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          width: '100%',
          height: '250px',
          border: '2px dashed',
          borderColor: '#4caf50',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4caf50',
          backgroundColor: '#f9fff9',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {isUploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
            }}
          >
            <CircularProgress color="primary" />
            <Typography sx={{ ml: 2 }}>Processing...</Typography>
          </Box>
        )}
        <Box>
          <CloudUploadIcon sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Drag & Drop PDF here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => document.getElementById('fileInput').click()}
            disabled={isUploading}
            sx={{
              borderRadius: '5px',
              padding: '10px 20px',
              fontSize: '16px',
            }}
          >
            Select PDF
          </Button>
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              setErrorMessage('');
              setGeminiData(null);
              setUploadMessage('');
              const file = e.target.files[0];
              if (file && validateFile(file)) {
                uploadFile(file);
              } else {
                setErrorMessage('Invalid file type. Please upload a PDF file.');
              }
            }}
          />
        </Box>
      </Box>

      {uploadMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {uploadMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {geminiData && (
        <>
          {renderMainArtist()}
          {renderInstrumentsAndBacklines()}
          {renderPatchListTable()}
        </>
      )}
    </Box>
  );
};

export default DropArea;
