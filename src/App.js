import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import "./App.css"; // ✅ Import CSS

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    document.title = "22BCS10793"; 
  }, []);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  const handleSubmit = async () => {
    setError(null);
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format. Must contain a 'data' array.");
      }
      const response = await axios.post("http://localhost:3000/bfhl", parsedInput);
      setResponseData(response.data);
    } catch (err) {
      setError(err.message);
      setResponseData(null);
    }
  };

  const filteredResponse = responseData
    ? Object.fromEntries(
        Object.entries(responseData).filter(([key]) =>
          selectedOptions.some((option) => option.value === key)
        )
      )
    : {};

  return (
    <div className="container">
      <h2>JSON Input</h2>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON like { "data": ["A", "C", "z"] }'
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}

      {responseData && (
        <div className="select-container">
          <h3>Select Filters:</h3>
          <Select
            options={options}
            isMulti
            onChange={setSelectedOptions}
            placeholder="Select response fields"
          />
          <div className="filtered-response">
  <h3>Filtered Response</h3>
  <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
</div>

        </div>
      )}
    </div>
  );
};

export default App;
