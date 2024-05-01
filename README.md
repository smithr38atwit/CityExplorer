# CityExplorer - The City Exploration App

This project was undertaken by a team of three computer science undergraduate students with the goal of crafting a unique method for people to discover new points of interest in their local communities. CityExplorer is a consumer-social web application, optimized for mobile devices. The core functions of this application revolve around principles of cartography - the science or art of making maps. The application’s features are built in React atop a foundational layer of a Mapbox viewmodel - a 3rd party provider of geocoding and navigation APIs. The consumer’s main use for the application is sharing locations they’ve visited. Interoperability between different users and the map is accomplished through a FastAPI/SQLite backend, which allows for persistent data and asynchronous user interaction. These methods proved highly efficient in regards to both measured performance and software testing.

## Running the Application

#### Prerequisites

- nodejs (latest lts version)
- python 3.11
- Note: These instructions are intended for windows. Command may vary on mac/linux, but the process is still the same

#### Front End

1. Switch to front end directory: ```cd frontend```
2. If this is your first time running, install required dependencies: ```npm install```
3. Start the front end: ```npm start```
>To get the most out of CityExplorer, you will have to allow access to location services through your browser. You may also get a warning stating the site is insecure, in which case you can safely choose to proceed to the website

#### Back End

1. Switch to back end directory: ```cd backend```
2. If this is your first time running, set up the python environment:
   - Create virtual environment: ```pythom -m venv .venv```
   - Activate environment: ```.venv\Scripts\activate```
   - Select the virtual env as your python interpreter
   - Install dependencies: ```pip install -r requirements.txt```

>While it is recommended to make a virtual env, you can also install the dependencies in you global python env by skipping to the last part of step 2

3. Run main.py in backend to start the API and database

## Demo

### Creating an Account

![CE_account_creating](https://github.com/smithr38atwit/CityExplorer/assets/54961768/aa93b3f0-1c8f-44d3-9edb-521413ee08df)


### Adding a Pin
Pins can be added to log places you've visited. You can search a location by name or address, click a location on the map, or pin your current location to log exploration.

![CE_adding_pin](https://github.com/smithr38atwit/CityExplorer/assets/54961768/afc9edd6-1ef5-4d6e-a4e9-a5b13c97ee94)


### Adding a Friend
You can add friends to see what places your friends have explored and log exploration once you've visited those places.

![CE_adding_friend](https://github.com/smithr38atwit/CityExplorer/assets/54961768/10453072-f116-4877-86b1-88178e9b87d6)

