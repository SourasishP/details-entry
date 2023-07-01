import Login from './Login/Login';
import Register from './Login/Register';
import Details from './Files/Details';
import Home from './Files/Home';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App() {
  return (
    <Router>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/Login" element={<Login />} />
			<Route path="/Register" element={<Register />} />
			<Route path="/Details" element={<Details />} />
		</Routes>
	</Router>
  );
}

export default App;
