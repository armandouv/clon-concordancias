import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
import CorpusList from './pages/CorpusList';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FileList from './pages/FileList';
import ViewFile from './pages/ViewFile';

export const API = "http://127.0.0.1:5000";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CorpusList />} />
          <Route path="/corpus_files/:corpusId" element={<FileList />} />
          <Route path="/file/:corpusId/:fileId" element={<ViewFile />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
/*
function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CorpusList />} />

          <Route path="/concordance-search/:corpusId" element={<ConcordanceSearch />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
*/
export default App;
