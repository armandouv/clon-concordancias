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

// Unicamente tres "paginas": Listado de corpus, Listado de archivos del corpus seleccionado
// y Vista del archivo.
// Se asume que el archivo tiene cierto "tipo" de vista, sin importar su contenido.
// Por ejemplo, tenemos un archivo XML, pero puede tener tres tipos de vista: XML, audio o img.
// En el caso de XML, unicamente se colorean los distintos tags. Para los otros casos,
// si el usuario hace click en el tag, se reproducira el audio o se mostrara la imagen asociada.
// Esto es util para corpus multimedia, como una entrevista o comics.

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
