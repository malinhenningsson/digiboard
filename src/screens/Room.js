import React, { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Whiteboard from '../components/Whiteboard';
import Chat from '../components/Chat';

const Room = () => {
    const location = useLocation();

    return (
        <>
            <Row>
                <Col sm={12} md={9} lg={9}>
                    <Whiteboard username={location.state.username} />
                </Col>
                <Col sm={0} md={3} lg={3}>
                    <Chat username={location.state.username} />
                </Col>
            </Row>
        </>
    )
}

export default Room
