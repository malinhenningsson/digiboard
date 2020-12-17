import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss';
import { Container } from 'react-bootstrap';
import Room from './screens/Room';
import Lobby from './screens/Lobby';
import NotFound from './screens/NotFound';


function App() {
  return (
	  <Router>
		<Container fluid>
			<Routes>
				<Route path="/">
					<Lobby />
				</Route>
				<Route path="/channel/:channelId">
					<Room />
				</Route>
				<Route path="*" element={ <NotFound /> } />
			</Routes>
		</Container>
	  </Router>
  );
}

export default App;
