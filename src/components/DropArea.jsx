// src/components/DropArea.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const DropArea = () => {
  const [uploadMessage, setUploadMessage] = useState('');
  const [geminiData, setGeminiData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy'; // Visual feedback
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setErrorMessage(''); // Reset any previous error messages
    setGeminiData(null); // Reset previous Gemini data
    setUploadMessage(''); // Reset previous upload messages

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0]; // Assuming single file drop, but can be extended for multiple files
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

      const response = await fetch('http://localhost:5000/upload', { // Ensure the URL and port match your server configuration
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Received data from backend:', data); // Debugging: Check the received data

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

  const renderGeminiTable = () => {
    if (!geminiData) return null;
    console.log('Rendering Data:', geminiData); // Debugging: Check geminiData

    // Determine if geminiData is an object with sections or an array
    if (typeof geminiData === 'object' && !Array.isArray(geminiData)) {
      // geminiData is an object with sections
      const sectionKeys = Object.keys(geminiData);
      if (sectionKeys.length === 0) return null;

      return sectionKeys.map((section) => {
        const items = geminiData[section];
        if (!Array.isArray(items) || items.length === 0) return null;

        // Extract table headers from the first item's keys
        const headers = Object.keys(items[0]);

        return (
          <Box key={section} sx={{ mt: 4, width: '100%' }}>
            <Typography variant="h4" align="center" color="primary" sx={{ mb: 2 }}>
              {section}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          backgroundColor: '#4caf50', // Green color as per CSS
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
                  {items.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white',
                      }}
                    >
                      {headers.map((header) => (
                        <TableCell key={header}>{item[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      });
    } else if (Array.isArray(geminiData)) {
      // geminiData is an array
      if (geminiData.length === 0) return null;

      // Extract table headers from the first item's keys
      const headers = Object.keys(geminiData[0]);

      return (
        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h6" align="center" color="primary" sx={{ mb: 2 }}>
            Patchlist
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        backgroundColor: '#4caf50', // Green color as per CSS
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
                {geminiData.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white',
                    }}
                  >
                    {headers.map((header) => (
                      <TableCell key={header}>{item[header]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      );
    } else {
      // Unexpected geminiData structure
      return (
        <Alert severity="warning" sx={{ mt: 4 }}>
          Unexpected Gemini data format.
        </Alert>
      );
    }
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>
      {/* Drop Area */}
      <Box
        id="drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          width: '100%',
          height: '250px',
          border: '2px dashed',
          borderColor: '#4caf50', // Green color as per CSS
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4caf50', // Green text
          backgroundColor: '#f9fff9', // Light background
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
              bgcolor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent overlay
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

      {/* Upload Confirmation Message */}
      {uploadMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {uploadMessage}
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Gemini Response Table */}
      {geminiData && renderGeminiTable()}
    </Box>
  );
};

export default DropArea;
