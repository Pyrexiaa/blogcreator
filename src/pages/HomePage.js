import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setJamaiApiKey, addRow } from "../api/api_calling";

const apiKey = process.env.REACT_APP_APIKEY;
const projectId = process.env.REACT_APP_PROJECTID;

export function HomePage() {
  useEffect(() => {
    // Set the API key and project ID when the component mounts
    setJamaiApiKey(apiKey, projectId);
  }, []);

  const [formData, setFormData] = useState({
    country: "",
    location: "",
    date: "",
    companion: "",
    highlights: "",
    profile: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      let newValue = value.toString();
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const fetchData = async (inputData) => {
    let explanation = "";
    let rowId = "";
    try {
      const data = await addRow("UserInformation", [inputData]);

      console.log("API response:", data);
      // Return ID of the table created for update later

      explanation = data.rows[0].columns.content.choices[0].message.content;
      rowId = data.rows[0].row_id;
      console.log("Row Id extracted: ", rowId);
    } catch (err) {
      console.error("Error fetching explanation:", err);
      explanation = "Failed to fetch explanation.";
    }
    return [explanation, rowId];
  };

  const fetchContent = async (inputData) => {
    const [content, rowId] = await fetchData(inputData);
    return [content, rowId];
  };

  const handleSubmit = async (e) => {
    console.log("Form Data: ", formData);
    e.preventDefault();

    const input_data = {
      country: formData.country || "",
      location: formData.location || "",
      date: formData.date || "",
      companion: formData.companion || "None",
      highlights: formData.highlights || "",
      userProfile: formData.profile || "",
    };

    try {
      // Await the result of fetchContent
      const [generatedContent, rowId] = await fetchContent(input_data);
      console.log("Row ID: ", rowId);

      // Pass the resolved content to another page
      navigate("/edit-blog", { state: { generatedContent, rowId } });
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 justify-center items-center w-full p-10">
      <form
        className="w-full bg-white p-8 rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-4">Create Blog</h1>

        {/* First Row: Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Second Row: Country and Location */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Third Row: Profile and Companion */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Profile
            </label>
            <input
              type="text"
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Companion
            </label>
            <input
              type="text"
              name="companion"
              value={formData.companion}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Last Row: Highlights */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Highlights
          </label>
          <textarea
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
