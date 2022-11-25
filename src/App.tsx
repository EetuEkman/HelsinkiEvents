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
  const [languages, setLanguages] = useState<Languages>(languagesPlaceholder)
  const [events, setEvents] = useState<Events>(eventsPlaceholder);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [eventIndex, setEventIndex] = useState<number>(-1);

  // A "cache" for place images
  const [placeImages, setPlaceImages] = useState<Image[]>([]);

  // A "cache" for places
  const [places, setPlaces] = useState<Place[]>([]);

  const [queryParameters, setQueryParameters] = useState<QueryParameters>({ isFree: false, start: "", end: "", language: "none" });

  const loadData = async () => {
    setIsWorking(isWorking => true)

    fetchLanguages()
      .then(fetchedLanguages => assertLanguages(fetchedLanguages))
      .then(assertedLanguages => unshiftDefaultLanguage(assertedLanguages))
      .then(unshiftedLanguages => setLanguages(languages => unshiftedLanguages))
      .then(() => setIsWorking(isWorking => false))
  }

  const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getEvents();
  }

  const getEvents = async (url?: string) => {
    setIsWorking(isWorking => true);

    fetchEvents(url, queryParameters)
      .then(fetchedEvents => assertEvents(fetchedEvents))
      .then(newEvents => setEvents(events => newEvents))
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
