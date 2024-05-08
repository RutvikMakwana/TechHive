import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useSelector } from 'react-redux';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import ServerError from '../components/ServerError';
import Meta from '../components/Meta';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(4); // Default limit
  const { search } = useSelector(state => state.search);

  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip: (currentPage - 1) * limit,
    search
  });

  useEffect(() => {
    if (data) {
      setTotal(data.total);
      setTotalPage(Math.ceil(data.total / limit));
    }
  }, [currentPage, data, limit, search]);

  const pageHandler = pageNum => {
    if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  // Function to shuffle array in place
  const shuffleArray = array => {
    const shuffledArray = [...array]; // Create a new array to avoid mutation
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  
  return (
    <>
      <Meta />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Container>
          {!search && <ProductCarousel />}
          <h1 className="mt-4 mb-3">Latest Products</h1>
          <Row>
            {shuffleArray(data.products).map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {totalPage > 1 && !search && (
            <Paginate
              currentPage={currentPage}
              totalPage={totalPage}
              pageHandler={pageHandler}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default HomePage;
