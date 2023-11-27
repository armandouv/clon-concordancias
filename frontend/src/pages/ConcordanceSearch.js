import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { VStack, Heading, Input, Button, Text, useToast } from '@chakra-ui/react';
import { API } from '../App';

const ConcordanceSearch = () => {
  const { corpusId } = useParams();
  const [searchText, setSearchText] = useState('');
  const [concordances, setConcordances] = useState([]);
  const toast = useToast();

  const handleSearch = async () => {
    try {
      // Realizar la llamada a la API para obtener concordancias
      const response = await fetch(API + `/getConcordancesText?corpus_id=${corpusId}&match=${searchText}`);
      if (!response.ok) {
        throw new Error('Error en la búsqueda de concordancias');
      }

      const data = await response.json();
      setConcordances(data); // Actualizar el estado con las concordancias
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Hubo un error al buscar concordancias.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack align="start" spacing={4}>
      <Heading mb={4}>Buscar Concordancias</Heading>
      <Input
        type="text"
        placeholder="Ingrese el texto a buscar"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Button colorScheme="teal" onClick={handleSearch}>
        Buscar
      </Button>

      {/* Mostrar los resultados de las concordancias */}
      {concordances.length > 0 && (
        <VStack align="start" spacing={2}>
          <Heading size="md" mt={4}>Resultados de Concordancias:</Heading>
          {concordances.map((concordance, index) => (
            <Text key={index} color={index % 2 === 0 ? 'blue.500' : 'green.500'}>
              {concordance}
            </Text>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default ConcordanceSearch;
