import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

const Home = lazy(() => import('./containers/Home/Home'));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
