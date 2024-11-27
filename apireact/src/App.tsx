import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // npm install react-router-dom
import CompleteInfo from './pages/components/CompleteInfo';

function Home() {
  return (
    <div>
      <CompleteInfo />
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
