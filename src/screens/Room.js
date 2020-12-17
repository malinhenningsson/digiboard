import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Whiteboard from '../components/Whiteboard';
import Chat from '../components/Chat';

const Room = () => {
    return (
        <>
            <Row>
                <Col sm={12} md={9} lg={9}>
                    <Whiteboard />
                </Col>
                <Col sm={0} md={3} lg={3}>
                    <Chat />
                </Col>
            </Row>
        </>
    )
}

export default Room
