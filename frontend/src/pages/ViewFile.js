import React, { useState, useEffect } from 'react';
import { VStack, Heading, Box, Text, Link as ChakraLink, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image } from '@chakra-ui/react';
import Parser from 'react-xml-parser';
import { useParams } from 'react-router-dom';
import { API } from '../App';

let idx = 0;

const CustomTag = ({ color, fontSize, text, onClickAction }) => (
  <div style={{ color, fontSize, padding: '4px', margin: '2px', border: '1px solid', borderRadius: '4px', display: "inline-block" }}>
    <ChakraLink onClick={onClickAction}>{text}</ChakraLink>
  </div>
);

const ViewFile = () => {
  const { corpusId, fileId } = useParams();
  const [fileWithAttachments, setFileWithAttachments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchFileWithAttachments = async () => {
    try {
      const response = await fetch(API + `/getFileWithAttachments?corpus_id=${corpusId}&file_id=${fileId}`);
      const data = await response.json();
      setFileWithAttachments(data);
    } catch (error) {
      console.error('Error fetching file with attachments:', error);
    }
  };

  useEffect(() => {
    fetchFileWithAttachments();
  }, [corpusId, fileId]);

  const tagColors = {}; // Map to store colors for each tag type

  const getRandomColor = (tagType) => {
    if (!tagColors[tagType]) {
      const colors = ['red', 'orange', 'green', 'teal', 'blue', 'purple'];
      tagColors[tagType] = colors[idx++ % colors.length];
    }
    return tagColors[tagType];
  };

  const playAudio = (audioId, audioText) => {
    const audioFile = fileWithAttachments.attachments.find(attachment => attachment.name === `${audioId}.wav`);

    if (audioFile) {
      const audio = new Audio(`data:audio/wav;base64,${audioFile.file}`);
      audio.play();

      console.log(`Playing audio: ${audioId}.wav, Text: ${audioText}`);
    } else {
      console.error(`Audio file ${audioId}.wav not found`);
    }
  };

  const displayImage = (imageId, imageText) => {
    const imageFile = fileWithAttachments.attachments.find(attachment => attachment.name === `${imageId}.jpg`);

    if (imageFile) {
      setSelectedImage(imageFile.file);
      console.log(`Displaying image: ${imageId}.jpg, Text: ${imageText}`);
    } else {
      console.error(`Image file ${imageId}.jpg not found`);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const renderTags = (tags, onClickAction, parentColor = null, depth = 0) => {
    return (
      <div>
        {tags.map((tag, index) => {
          const tagColor = getRandomColor(tag.name);
          const fontSize = parentColor ? 'lg' : 'md';
          console.log(tag.value);
  
          return (
            <React.Fragment key={index}>
              <CustomTag
                color={tagColor}
                fontSize={fontSize}
                text={tag.value}
                onClickAction={() => onClickAction(tag.attributes.id, tag.value)}
              />
  
              {/* Recursively render nested tags */}
              {tag.children && tag.children.length > 0 && (
                <div style={{ marginLeft: '10px' }}>
                  {renderTags(tag.children, onClickAction, tagColor, depth + 1)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  

  const renderXMLTags = (content) => {
    const xmlParser = new Parser();
    const xmlDoc = xmlParser.parseFromString(content);
  
    const renderTags = (tags, onClickAction, parentColor = null, depth = 0) => {
      return (
        <VStack align="start" spacing={2} ml={4 * depth}>
          {tags.map((tag, index) => {
            const tagColor = getRandomColor(tag.name);
            const fontSize = parentColor ? 'lg' : 'md';
  
            return (
              <Box key={index} bg={tagColor} p={2} borderRadius="md">
                <Text fontWeight="bold">{`<${tag.name}>`}</Text>
                {tag.value && <Text>{tag.value}</Text>}
                {/* Recursively render nested tags */}
                {tag.children && tag.children.length > 0 && (
                  <VStack align="start" spacing={2} ml={4}>
                    {renderTags(tag.children, onClickAction, tagColor, depth + 1)}
                  </VStack>
                )}
              </Box>
            );
          })}
        </VStack>
      );
    };
  
    return renderTags(xmlDoc.children, () => {
      console.log('Handle XML tag click:', 'Not implemented yet');
    });
  };

  const renderAudioTags = () => {
    const audioParser = new Parser();
    const audioDoc = audioParser.parseFromString(fileWithAttachments.file);
    return renderTags(audioDoc.children, playAudio);
  };

  const renderImageTags = () => {
    const imageParser = new Parser();
    const imageDoc = imageParser.parseFromString(fileWithAttachments.file);
    return renderTags(imageDoc.children, displayImage);
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
