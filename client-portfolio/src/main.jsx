import React from 'react'; // Importing React library to create components
import ReactDOM from 'react-dom/client'; // Importing ReactDOM to render the component tree
import App from './App.jsx'; // Importing the App component from the App.jsx file

// Rendering the App component into the 'root' div in the HTML document
ReactDOM.createRoot(document.getElementById('root')).render(
  <App /> // The App component is being rendered inside the root element
);

