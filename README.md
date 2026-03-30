# Barcelona Explore 🗺️

A dynamic web application designed to help users discover commercial activities and points of interest in Barcelona using real-time geographic data. This project serves as a personal sandbox to refine **Frontend Design** and **API Integration** skills.

> **Status:** 🚧 Work in Progress (Active Development)

---

## 🎯 Project Overview
The goal of this project is to bridge the gap between UI/UX design and functional asynchronous programming. By integrating the **Leaflet.js** mapping library with the **Overpass API (OpenStreetMap)**, I am practicing how to handle real-world data, manage asynchronous states, and create a seamless user experience.

---

## 🛠️ Technical Skills & Tools
* **Language:** JavaScript (ES6+).
* **Asynchronous Logic:** Advanced use of `Async/Await`, `Promises`, and the `Fetch API`.
* **Geospatial Integration:** Implementation of **Leaflet.js** for interactive map rendering and custom control positioning.
* **API Management:** Querying the **Overpass API** using specialized QL (Query Language) and URL encoding.
* **Frontend Architecture:** Responsive layout, custom CSS positioning (`z-index` management), and UI components.
* **Error Handling:** Implementing `try/catch` blocks to manage network failures and API timeouts (HTTP 504).

---

## 🚀 Current Progress
The application currently handles the following features:
* **Map Initialization:** A Leaflet map centered on Barcelona with customized zoom control positioning (moved to `bottomleft` to avoid navbar overlap).
* **Dynamic Search Pipeline:** A search bar that captures user input to query specific categories (e.g., *restaurant*, *bar*, *cafe*).
* **Data Fetching:** A robust asynchronous function that encodes Overpass QL queries and fetches up to 100 results based on specific geographic coordinates.
* **Response Handling:** Successful conversion of API Promises into usable JSON objects.

---

## 📅 Roadmap (Next Steps)
In the coming days, I will be focusing on these key improvements:
* **Marker Rendering:** Iterating through the JSON `elements` array to place interactive markers on the map for each result.
* **Layer Management:** Implementing `L.layerGroup` to clear old markers before a new search is performed, ensuring a clean UI.
* **Category Shortcuts:** Connecting the "Example" UI buttons to trigger instant API calls for popular categories.
* **Enhanced UX:** Adding a "Loading Spinner" to notify users during data fetching and improving the `bindPopup` info for each location.
* **Advanced Error Handling:** Gracefully managing "Gateway Timeouts" (504) from the Overpass server to prevent application crashes and notify the user.

---

## 🖥️ How to Run
1. Clone the repository.
2. Open `index.html` in your browser (using **Live Server** is recommended).
3. Type a category in English (e.g., `restaurant`, `bar`, `pharmacy`) in the search bar and check the console to see the live data feed!

---

## If you are reading this, feel free to share any reviews!

### Author
* **Roberto Ingrao** 
