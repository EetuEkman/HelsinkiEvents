import React, { useState, useEffect } from 'react';
import { hot } from "react-hot-loader/root";
import Language from './models/Language';
import Languages from './models/Languages';
import Event from "./models/Event";
import Events from './models/Events';
import Search from './Search/Search';
import EventList from './EventList/EventList';
import Navigation from './Navigation/Navigation';
import EventDetails from './EventDetails/EventDetails';
import Image from './models/Image';
import Place from './models/Place';
import QueryParameters from './models/QueryParameters';
import fetchImages, { assertImages, getNeededImageIds } from "./FetchImages";
import fetchPlaces, { assertPlaces, getNeededPlaceIds } from "./FetchPlaces";
import fetchEvents, { assertEvents } from './FetchEvents';

const languagesPlaceholder: Languages = {
  data: [
    {
      id: "none",
      name: {
        fi: "ei valittu",
        en: "none selected",
        se: "ingen vald"
      }
    }
  ]
}

const eventsPlaceholder: Events = {
  meta: {
    count: 0,
    previous: undefined,
    next: undefined
  },
  data: []
}

const LANGUAGE_URL = "https://api.hel.fi/linkedevents/v1/language/";

const LOCAL_STORAGE_PLACES = "Helsinki-events/places-v1";
const LOCAL_STORAGE_IMAGES = "Helsinki-events/images-v1";
const LOCAL_STORAGE_EVENTS = "Helsinki-events/events-v1";
const LOCAL_STORAGE_SEARCH = "Helsinki-events/search-v1";
const SESSION_STORAGE_INDEX = "Helsinki-events/event-index-v1";

async function fetchLanguages(): Promise<Object> {
  let response = await fetch(LANGUAGE_URL);

  let languages = await response.json();

  return languages;
}

function assertLanguages(fetchedLanguages: Object): Languages {
  let languages = { ...fetchedLanguages } as Languages;

  return languages;
}

function unshiftDefaultLanguage(oldLanguages: Languages): Languages {
  let newLanguages = { ...oldLanguages };

  let defaultLanguage: Language = {
    id: "none",
    name: {
      fi: "ei valittu",
      en: "none selected",
      se: "ingen vald"
    }
  };

  newLanguages.data.unshift(defaultLanguage);

  return newLanguages;
}


function App() {
  // Languages available for the search
  const [languages, setLanguages] = useState<Languages>(languagesPlaceholder)

  // Search results: event list, pagination
  const [events, setEvents] = useState<Events>(eventsPlaceholder);

  // Ongoing http requests etc. asynchronous happening
  const [isWorking, setIsWorking] = useState<boolean>(true);

  // Selected event, index of the events.data
  const [eventIndex, setEventIndex] = useState<number>(-1);

  // Place image objects
  const [placeImages, setPlaceImages] = useState<Image[]>([]);

  // Place object
  const [places, setPlaces] = useState<Place[]>([]);

  // Search options
  const [queryParameters, setQueryParameters] = useState<QueryParameters>({ text: "", isFree: false, start: "", end: "", language: "none" });

  // Ran on initial load
  const loadData = async () => {
    setIsWorking(isWorking => true)

    let storedImages = localStorage.getItem(LOCAL_STORAGE_IMAGES);

    if (storedImages) {
      let json = JSON.parse(storedImages);

      let images = assertImages(json);

      setPlaceImages(placeImages => images);
    }

    let storedPlaces = localStorage.getItem(LOCAL_STORAGE_PLACES);

    if (storedPlaces) {
      let json = JSON.parse(storedPlaces);

      let places = assertPlaces(json);

      setPlaces(p => places);
    }

    let storedEvents = localStorage.getItem(LOCAL_STORAGE_EVENTS);

    if (storedEvents) {
      let json = JSON.parse(storedEvents);

      let events = assertEvents(json);

      setEvents(e => events);
    }

    let storedSearch = localStorage.getItem(LOCAL_STORAGE_SEARCH);

    if (storedSearch) {
      let json = JSON.parse(storedSearch);

      let search = json as QueryParameters;

      setQueryParameters(qp => search);
    }

    let storedEventIndex = sessionStorage.getItem(SESSION_STORAGE_INDEX);

    if (storedEventIndex) {
      let eventIndex = Number.parseInt(storedEventIndex);

      setEventIndex(ei => eventIndex);
    }

    fetchLanguages()
      .then(fetchedLanguages => assertLanguages(fetchedLanguages))
      .then(assertedLanguages => unshiftDefaultLanguage(assertedLanguages))
      .then(unshiftedLanguages => setLanguages(languages => unshiftedLanguages))
      .then(() => setIsWorking(isWorking => false))
  }

  const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getEvents();
  }

  // Fetch and set the events
  const getEvents = async (url?: string) => {
    setIsWorking(isWorking => true);

    sessionStorage.setItem(LOCAL_STORAGE_SEARCH, JSON.stringify(queryParameters));

    fetchEvents(url, queryParameters)
      .then(fetchedEvents => assertEvents(fetchedEvents))
      .then(newEvents => { setEvents(events => newEvents); return newEvents })
      .then(newEvents => localStorage.setItem(LOCAL_STORAGE_EVENTS, JSON.stringify(newEvents)))
      .then(() => setIsWorking(isWorking => false));
  }

  const handleEventClick = (event: React.MouseEvent<HTMLLIElement>) => {
    let dataIndex = event.currentTarget.getAttribute("data-index");

    if (dataIndex === null || dataIndex === undefined) {
      return;
    }
    
    let index = Number.parseInt(dataIndex);

    if (index === NaN) {
      return;
    }

    setEventIndex(eventIndex => index);

    sessionStorage.setItem(SESSION_STORAGE_INDEX, index.toString());
  }

  const handleEventDetailsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEventIndex(eventIndex => -1);
  }

  const handleNavigationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    let direction = event.currentTarget.getAttribute("data-direction");

    if (direction === null || direction === undefined) {
      return;
    }

    switch (direction) {
      case "next":
        getEvents(events.meta.next)

        break;
      case "previous":
        getEvents(events.meta.previous)

        break;
    }
  }

  useEffect(() => {
    loadData()
  }, []);

  useEffect(() => {
    const updatePlaces = async () => {
      let neededIds = getNeededPlaceIds(events.data, places)

      fetchPlaces(neededIds).then(places => assertPlaces(places)).then(assertedPlaces => {
        let newPlaces = [...places, ...assertedPlaces];

        localStorage.setItem(LOCAL_STORAGE_PLACES, JSON.stringify(newPlaces));

        setPlaces(places => newPlaces);
      })

    }

    updatePlaces();
  }, [events]);

  useEffect(() => {
    const updateImages = async () => {
      let neededImageIds = getNeededImageIds(placeImages, places);

      fetchImages(neededImageIds)
        .then(images => assertImages(images))
        .then(images => {
          let newImages = [...placeImages, ...images];

          localStorage.setItem(LOCAL_STORAGE_IMAGES, JSON.stringify(newImages));

          setPlaceImages(placeImages => newImages);
        })
    }

    updateImages();
  }, [places]);

  return (
    <div className="wrapper">
      {
        eventIndex === -1
          ?
          <div id="events-container">
            <Search languages={languages} queryParameters={queryParameters} setQueryParameters={setQueryParameters} onClick={handleSearchClick}></Search>
            
            <EventList events={events.data} isWorking={isWorking} onClick={handleEventClick}></EventList>
            
            <Navigation meta={events.meta} isWorking={isWorking} onClick={handleNavigationClick}></Navigation>
          </div>
          :
          <EventDetails event={events.data[eventIndex]} places={places} placeImages={placeImages} onClick={handleEventDetailsClick}></EventDetails>
      }
    </div>
  )
}

export default hot(App);
