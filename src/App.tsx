import React, { useState, useEffect } from 'react';
import { hot } from "react-hot-loader/root";

import Languages from './models/Languages';
import Events from './models/Events';
import Image from './models/Image';
import Place from './models/Place';
import KeywordSet from './models/KeywordSet';
import Keyword from './models/Keyword';
import QueryParameters, { OrderBy } from './models/QueryParameters';

import Search from './Search/Search';
import EventList from './EventList/EventList';
import Navigation from './Navigation/Navigation';
import EventDetails from './EventDetails/EventDetails';

import fetchImages, { assertImages, getNeededImageIds } from "./FetchImages";
import fetchPlaces, { assertPlaces, getNeededPlaceIds } from "./FetchPlaces";
import fetchEvents, { assertEvents } from './FetchEvents';
import fetchLanguages from './FetchLanguages';
import fetchKeywordsFromKeywordSet, { fetchKeywordSet, keywordSetNames } from './FetchKeywords';

import LanguageSelect from './LanguageSelect/LanguageSelect';


const LANGUAGES_PLACEHOLDER: Languages = {
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

const EVENTS_PLACEHOLDER: Events = {
  meta: {
    count: 0,
    previous: undefined,
    next: undefined
  },
  data: []
}

const DEFAULT_QUERY_PARAMETERS = {
  text: "",
  isFree: false,
  start: "",
  end: "",
  language: "none",
  orderBy: OrderBy.lastModifiedTime,
  orderByDescending: true,
  topics: [],
  audiences: []
}

export const LOCAL_STORAGE_KEYS = {
  places: "Helsinki-events/places-v1",
  images: "Helsinki-events/images-v1",
  events: "Helsinki-events/events-v1",
  search: "Helsinki-events/search-v1",
  eventIndex: "Helsinki-events/event_index-v1",
  topics: "Helsinki-events/topics-v1",
  audiences: "Helsinki-events/audiences-v1",
  appLanguage: "Helsinki-events/app_language-v1",
  keywordSets: {
    topics: "Helsinki-events/keyword_sets/topics-v1",
    audiences: "Helsinki-events/keyword_sets/audiences-v1"
  }
}

export enum AvailableLanguages {
  finnish = "Finnish",
  english = "English"
}

export const AppLanguageContext = React.createContext<string>(AvailableLanguages.finnish);

function App() {
  // Available languages fetched from the endpoint, used in filtering fetched events.
  const [languages, setLanguages] = useState<Languages>(LANGUAGES_PLACEHOLDER);

  // Used to store events: event list, pagination
  const [events, setEvents] = useState<Events>(EVENTS_PLACEHOLDER);

  // Used to track ongoing http requests etc. asynchronous happening.
  const [isWorking, setIsWorking] = useState<boolean>(true);

  // Used to track user's selected event, index for the events.data.
  const [eventIndex, setEventIndex] = useState<number>(-1);

  // Used to store place image objects to avoid fetching.
  const [placeImages, setPlaceImages] = useState<Image[]>([]);

  // Stores place objects to avoid fetching.
  const [places, setPlaces] = useState<Place[]>([]);

  // Used to filter fetched events.
  const [queryParameters, setQueryParameters] = useState<QueryParameters>(DEFAULT_QUERY_PARAMETERS);

  // Holds the keywords found in the topics keyword set used to filter events.
  const [topics, setTopics] = useState<Keyword[]>([]);

  const [audiences, setAudiences] = useState<Keyword[]>([]);

  // Used to track the app language, defaulting to finnish;
  const [appLanguage, setAppLanguage] = useState<string>(AvailableLanguages.finnish);

  // Ran on initial load.
  // Loads and sets data to and from the session or local storage.
  // Also fetch and set languages and keywords used in the event filtering.
  const loadData = async () => {
    setIsWorking(isWorking => true)

    let storedImages = localStorage.getItem(LOCAL_STORAGE_KEYS.images);

    if (storedImages) {
      let json = JSON.parse(storedImages);

      let images = assertImages(json);

      setPlaceImages(placeImages => images);
    }

    let storedPlaces = localStorage.getItem(LOCAL_STORAGE_KEYS.places);

    if (storedPlaces) {
      let json = JSON.parse(storedPlaces);

      let places = assertPlaces(json);

      setPlaces(p => places);
    }

    let storedEvents = localStorage.getItem(LOCAL_STORAGE_KEYS.events);

    if (storedEvents) {
      let json = JSON.parse(storedEvents);

      let events = assertEvents(json);

      setEvents(e => events);
    }

    let storedSearch = sessionStorage.getItem(LOCAL_STORAGE_KEYS.search);

    if (storedSearch) {
      let json = JSON.parse(storedSearch);

      let search = json as QueryParameters;

      setQueryParameters(qp => search);
    }

    let storedEventIndex = sessionStorage.getItem(LOCAL_STORAGE_KEYS.eventIndex);

    if (storedEventIndex) {
      let eventIndex = Number.parseInt(storedEventIndex);

      setEventIndex(ei => eventIndex);
    }

    // Fetch topics keyword set.
    // Get stored topics from the local storage.
    // If stored topics do not exist, set fetched topics keyword set as stored keyword set.

    // Compare last modified dates in the keyword sets.

    // If the dates are equal, get the stored topics from the local storage.
    // If stored topics do not exist, fetch topics. Store fetched topics to the local storage and set to state.
    // If they do, parse topics and set to state.

    // If dates are not equal, fetch topics. Store fetched topics to the local storage and set to state.

    // Store fetched topics keyword set to local storage.

    let topicsKeywordSet = fetchKeywordSet(keywordSetNames.Topics);

    topicsKeywordSet.then(topicsKeywordSet => {
      let storedTopicsKeywordSetString = localStorage.getItem(LOCAL_STORAGE_KEYS.keywordSets.topics);

      if (!storedTopicsKeywordSetString) {
        storedTopicsKeywordSetString = JSON.stringify(topicsKeywordSet);
      }

      let storedTopicsKeywordSet = JSON.parse(storedTopicsKeywordSetString) as KeywordSet;


      if (topicsKeywordSet.last_modified_time === storedTopicsKeywordSet.last_modified_time) {
        let storedTopicsString = localStorage.getItem(LOCAL_STORAGE_KEYS.topics);

        if (!storedTopicsString) {
          let topics = fetchKeywordsFromKeywordSet(topicsKeywordSet);

          topics.then(topics => {
            localStorage.setItem(LOCAL_STORAGE_KEYS.topics, JSON.stringify(topics));

            setTopics(t => topics);
          })
        }
        else {
          let topics = JSON.parse(storedTopicsString) as Keyword[];

          setTopics(t => topics);
        }
      }
      else {
        let topics = fetchKeywordsFromKeywordSet(topicsKeywordSet);

        topics.then(topics => {
          localStorage.setItem(LOCAL_STORAGE_KEYS.topics, JSON.stringify(topics));

          setTopics(t => topics);
        })
      }

      localStorage.setItem(LOCAL_STORAGE_KEYS.keywordSets.topics, JSON.stringify(topicsKeywordSet));
    });

    // Same for audiences.

    let audiencesKeywordSet = fetchKeywordSet(keywordSetNames.Audiences);

    audiencesKeywordSet.then(audiencesKeywordSet => {
      let storedAudiencesKeywordSetString = localStorage.getItem(LOCAL_STORAGE_KEYS.keywordSets.audiences);

      if (!storedAudiencesKeywordSetString) {
        storedAudiencesKeywordSetString = JSON.stringify(audiencesKeywordSet);
      }

      let storedAudiencesKeywordSet = JSON.parse(storedAudiencesKeywordSetString) as KeywordSet;

      if (audiencesKeywordSet.last_modified_time === storedAudiencesKeywordSet.last_modified_time) {
        let storedAudiencesString = localStorage.getItem(LOCAL_STORAGE_KEYS.audiences);

        if (!storedAudiencesString) {
          let audiences = fetchKeywordsFromKeywordSet(audiencesKeywordSet);

          audiences.then(audiences => {
            localStorage.setItem(LOCAL_STORAGE_KEYS.audiences, JSON.stringify(audiences));

            setAudiences(a => audiences);
          })
        }
        else {
          let audiences = JSON.parse(storedAudiencesString) as Keyword[];

          setAudiences(a => audiences);
        }
      }
      else {
        let audiences = fetchKeywordsFromKeywordSet(audiencesKeywordSet);

        audiences.then(audiences => {
          localStorage.setItem(LOCAL_STORAGE_KEYS.audiences, JSON.stringify(audiences));

          setAudiences(a => audiences);
        })
      }

      localStorage.setItem(LOCAL_STORAGE_KEYS.keywordSets.audiences, JSON.stringify(audiencesKeywordSet));
    });

    const storedAppLanguage = localStorage.getItem(LOCAL_STORAGE_KEYS.appLanguage);

    if (storedAppLanguage) {
      setAppLanguage(al => storedAppLanguage);
    }

    fetchLanguages()
      .then(languages => setLanguages(l => languages))
      .then(() => setIsWorking(isWorking => false))
  }

  const handleSearchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getEvents();
  }

  // Fetch and set the events.
  const getEvents = async (url?: string) => {
    setIsWorking(isWorking => true);

    sessionStorage.setItem(LOCAL_STORAGE_KEYS.search, JSON.stringify(queryParameters));

    // Fetch events from the api. Query parameters are built from the queryParameters objects passed here.
    // Update the events state with fetched events. Also save the state to local storage.
    fetchEvents(url, queryParameters)
      .then(fetchedEvents => assertEvents(fetchedEvents))
      .then(newEvents => { setEvents(events => newEvents); return newEvents })
      .then(newEvents => localStorage.setItem(LOCAL_STORAGE_KEYS.events, JSON.stringify(newEvents)))
      .then(() => setIsWorking(isWorking => false));
  }

  // User clicks the event in the list. Get the index of the clicked event. Set the index to a state.
  // Setting the state then opens up more detailed view of the event.
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

    sessionStorage.setItem(LOCAL_STORAGE_KEYS.eventIndex, index.toString());
  }

  const handleEventDetailsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEventIndex(eventIndex => -1);

    sessionStorage.setItem(LOCAL_STORAGE_KEYS.eventIndex, "-1");
  }

  // User clicks either next or previous buttons
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

  // On events update, see if places are needed to be fetched and if so fetch the needed places and set to state .
  useEffect(() => {
    const updatePlaces = async () => {
      let neededIds = getNeededPlaceIds(events.data, places)

      fetchPlaces(neededIds).then(places => assertPlaces(places)).then(assertedPlaces => {
        let newPlaces = [...places, ...assertedPlaces];

        localStorage.setItem(LOCAL_STORAGE_KEYS.places, JSON.stringify(newPlaces));

        setPlaces(places => newPlaces);
      })

    }

    updatePlaces();
  }, [events]);

  // On places update, see if place images need to be fetched. Fetch and update the state with needed place images.
  useEffect(() => {
    const updateImages = async () => {
      let neededImageIds = getNeededImageIds(placeImages, places);

      fetchImages(neededImageIds)
        .then(images => assertImages(images))
        .then(images => {
          let newImages = [...placeImages, ...images];

          localStorage.setItem(LOCAL_STORAGE_KEYS.images, JSON.stringify(newImages));

          setPlaceImages(placeImages => newImages);
        })
    }

    updateImages();
  }, [places]);

  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: "auto"});
  }, [eventIndex]);

  return (
    <div className="wrapper">
      <AppLanguageContext.Provider value={appLanguage}>
        {
          eventIndex === -1
            ?
            <div id="events-container">
              <LanguageSelect appLanguage={appLanguage} setAppLanguage={setAppLanguage}></LanguageSelect>

              <Search languages={languages} topics={topics} audiences={audiences} queryParameters={queryParameters} setQueryParameters={setQueryParameters} onClick={handleSearchClick}></Search>

              <EventList events={events.data} isWorking={isWorking} onClick={handleEventClick}></EventList>

              <Navigation meta={events.meta} isWorking={isWorking} onClick={handleNavigationClick}></Navigation>
            </div>
            :
            <EventDetails event={events.data[eventIndex]} places={places} placeImages={placeImages} onClick={handleEventDetailsClick}></EventDetails>
        }
      </AppLanguageContext.Provider>
    </div>
  )
}

export default hot(App);
