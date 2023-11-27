import React, { useState, useEffect } from 'react';
import { VStack, Heading, Box, Tag, TagLabel, Link as ChakraLink, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image } from '@chakra-ui/react';
import Parser from 'react-xml-parser';
import { useParams } from 'react-router-dom';
import { API } from '../App';

const ViewFile = () => {
  const { corpusId, fileId } = useParams();
  const [fileWithAttachments, setFileWithAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchFileWithAttachments = async () => {
      try {
        const response = await fetch(API + `/getFileWithAttachments?corpus_id=${corpusId}&file_id=${fileId}`);
        const data = await response.json();
        setFileWithAttachments(data);
      } catch (error) {
        console.error('Error fetching file with attachments:', error);
      }
    };

    fetchFileWithAttachments();
  }, [corpusId, fileId]);

  const closeModal = () => {
    setSelectedImage(null);
  };

  const getRandomColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const playAudio = (audioId, audioText) => {
    // Find the audio file in fileWithAttachments.attachments
    const audioFile = fileWithAttachments.attachments.find(attachment => attachment.name === `${audioId}.wav`);
  
    if (audioFile) {
      // Create a new audio element
      const audio = new Audio(`data:audio/wav;base64,${audioFile.file}`);
  
      // Set up event listeners (optional)
      audio.addEventListener('ended', () => {
        console.log('Audio playback ended');
      });
  
      // Play the audio
      audio.play();
  
      console.log(`Playing audio: ${audioId}.wav, Text: ${audioText}`);
    } else {
      console.error(`Audio file ${audioId}.wav not found`);
    }
  };

  const displayImage = (imageId, imageText) => {
    // Find the image file in fileWithAttachments.attachments
    const imageFile = fileWithAttachments.attachments.find(attachment => attachment.name === `${imageId}.jpg`);

    if (imageFile) {
      setSelectedImage(imageFile.file);
      console.log(`Displaying image: ${imageId}.jpg, Text: ${imageText}`);
    } else {
      console.error(`Image file ${imageId}.jpg not found`);
    }
  };

  const renderGenericTags = (tags, onClickAction) => {
    return (
      <div>
        {tags.map((tag, index) => (
          <Tag key={index} colorScheme={getRandomColor()} variant="solid" size="md" m={1}>
            <TagLabel>
              <ChakraLink onClick={() => onClickAction(tag.id, tag.text)}>
                {tag.text}
              </ChakraLink>
            </TagLabel>
          </Tag>
        ))}
      </div>
    );
  };

  const renderXMLTags = (content) => {
    const xmlParser = new Parser();
    const xmlDoc = xmlParser.parseFromString(content);

    const tagsWithId = xmlDoc.getElementsByTagName('*').map((node) => {
      return node.attributes && node.attributes.id ? { id: node.attributes.id, text: node.value } : null;
    }).filter((tag) => tag !== null);

    return renderGenericTags(tagsWithId, () => {
      console.log('Handle XML tag click:', 'Not implemented yet');
    });
  };

  const renderAudioTags = () => {
    const audioParser = new Parser();
    const audioDoc = audioParser.parseFromString(fileWithAttachments.file);

    const audioTagsWithId = audioDoc.getElementsByTagName('*').map((node) => {
      return node.attributes && node.attributes.id ? { id: node.attributes.id, text: node.value } : null;
    }).filter((tag) => tag !== null);

    return renderGenericTags(audioTagsWithId, playAudio);
  };

  const renderImageTags = () => {
    const imageParser = new Parser();
    const imageDoc = imageParser.parseFromString(fileWithAttachments.file);

    const imageTagsWithId = imageDoc.getElementsByTagName('*').map((node) => {
      return node.attributes && node.attributes.id ? { id: node.attributes.id, text: node.value } : null;
    }).filter((tag) => tag !== null);

    return renderGenericTags(imageTagsWithId, displayImage);
  };

  return (
    <Box m={12}>
      <VStack align="start" spacing={4}>
        <Heading mb={4}>{fileWithAttachments.name}</Heading>

        {/* Display content based on the file type */}
        {fileWithAttachments.type === 'xml' && renderXMLTags(fileWithAttachments.file)}

        {fileWithAttachments.type === 'audio' && renderAudioTags()}

        {fileWithAttachments.type === 'img' && renderImageTags()}

        {/* Modal for displaying images */}
        {selectedImage && (
          <Modal isOpen={!!selectedImage} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Imagen asociada</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Image src={`data:image/jpg;base64,${selectedImage}`} alt="Image Preview" />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Box>
  );
};

export default ViewFile;
