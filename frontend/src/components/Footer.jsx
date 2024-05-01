import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Container fluid className='bg-dark text-white'>
      <Row>
        <Col className='text-center py-3'>
          <p className='mb-0'>TechHive &copy; {currentYear}</p>
          <small>Empowering Innovation</small>
        </Col>
      </Row>
    </Container>
  );
};

export default Footer;

