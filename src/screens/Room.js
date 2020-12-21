import React, { useEffect, useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import Whiteboard from '../components/Whiteboard';
import Chat from '../components/Chat';
import { usePubnub } from '../contexts/PubNubContext';

const Room = () => {
    const location = useLocation();
    const { channelId } = useParams();
    const { publishToChannel } = usePubnub();

    useEffect(() => {
        publishToChannel(channelId, location.state.username + ' is in the room')
    }, [])

    return (
        <>
            <Row>
                <Col sm={12} md={9} lg={9}>
                    <Whiteboard username={location.state && location.state.username ? location.state.username : "Anonymous"} />
                </Col>
                <Col sm={0} md={3} lg={3}>
                    <Chat username={location.state && location.state.username ? location.state.username : "Anonymous"} />
                </Col>
            </Row>
        </>
    )
}

export default Room
