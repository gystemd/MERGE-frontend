import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import About from './components/about';
import Resources from './components/resources';
import Form from './components/form';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/about">About</Link>
    //         </li>
    //       </ul>
    //     </nav>
    //     <Routes>
    //       <Route path="/about" element={<About />} />
    //     </Routes>
    //   </div>
    // </Router>