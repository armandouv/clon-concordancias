import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VStack, Box, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { API } from '../App';
import { Link as RouterLink } from 'react-router-dom';

const CorpusList = () => {
  const [corpusList, setCorpusList] = useState([]);

  useEffect(() => {
    // Lógica para obtener la lista de corpus (puedes usar fetch, axios, etc.)
    // Aquí puedes llamar a la API de Flask para obtener la lista de corpus
    // y actualizar el estado con setCorpusList
    const fetchCorpusList = async () => {
      try {
        const response = await fetch(API + '/getCorpus');  // Reemplaza con la ruta correcta de tu API
        const data = await response.json();
        setCorpusList(data);
      } catch (error) {
        console.error('Error fetching corpus list:', error);
      }
    };

    fetchCorpusList();
  }, []);

  return (
    <Box m={12}>
      <VStack align="start" spacing={4}>
        <Heading mb={4}>Lista de Corpus</Heading>
        {corpusList.map((corpus) => (
          <Box key={corpus.id} p={4} borderWidth="1px" borderRadius="md">
            <Link as={RouterLink} to={`/corpus_files/${corpus.id}`}>
              <Text fontSize="lg">{corpus.nombre}</Text>
            </Link>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default CorpusList;
