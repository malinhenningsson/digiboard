import './App.scss';
import { Container } from 'react-bootstrap';
import Room from './screens/Room';
import Lobby from './screens/Lobby';


function App() {
  return (
    <Container fluid>
      <Lobby />
      <Room />
    </Container>
  );
}

export default App;
