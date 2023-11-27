import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { VStack, Box, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import { API } from '../App';
import { Link as RouterLink } from 'react-router-dom';

const FileList = () => {
    const { corpusId } = useParams();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchFileList = async () => {
            try {
                const response = await fetch(API + `/getCorpusFiles?corpus_id=${corpusId}`);  // Reemplaza con la ruta correcta de tu API
                const data = await response.json();
                setFileList(data);
            } catch (error) {
                console.error('Error fetching files list:', error);
            }
        };

        fetchFileList();
    }, []);

    return (
        <Box m={12}>
            <VStack align="start" spacing={4}>
                <Heading mb={4}>Lista de Archivos</Heading>
                {fileList.map((file) => (
                    <Box key={file.id} p={4} borderWidth="1px" borderRadius="md">
                        <Link as={RouterLink} to={`/file/${corpusId}/${file.id}`}>
                            <Text fontSize="lg">{file.nombre}</Text>
                            <Text fontSize="sm">Tipo: {file.type}</Text>
                        </Link>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default FileList;
