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
import Working from './EventList/Working';
import Image from './models/Image';
import Place from './models/Place';
import QueryParameters from './models/QueryParameters';

const emptyQueryParameters: QueryParameters = {
  isFree: false,
  start: "",
  end: "",
  language: "none"
}

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

const EVENTS_URL = "https://api.hel.fi/linkedevents/v1/event/?format=json";
const LANGUAGE_URL = "https://api.hel.fi/linkedevents/v1/language/";
const BASE_URL = "https://api.hel.fi/linkedevents/v1/";


async function fetchImage(id: number | undefined): Promise<Object> {
  if (!id) {
    return {};
  }

  let imageObjectUrl = BASE_URL + "image/" + id.toString();

  const response = await fetch(imageObjectUrl);

  const image: Object = await response.json();

  return image;
}

function assertImage(fetchedImage: Object): Image {
  let image = {...fetchedImage} as Image;

  return image;
}

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

async function fetchEvents(url: string, queryParameters = emptyQueryParameters): Promise<Object> {
  if(queryParameters.start.length > 0) {
    url = url + "&start=" + queryParameters.start;
  }

  if(queryParameters.end.length > 0) {
    url = url + "&end=" + queryParameters.end;
  }

  if(queryParameters.isFree) {
    url = url + "&is_free=true"
  }

  if(queryParameters.language !== "none") {
    url = url + "&language=" + queryParameters.language;
  }

  let response = await fetch(url);

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  let events = await response.json();

  return events;
}

function assertEvents(fetchedEvents: Object): Events {
  let events = { ...fetchedEvents } as Events;

  return events;
}

async function fetchPlace(url: string): Promise<Object> {
  let response = await fetch(url);

  let place = await response.json();

  return place;
}

function assertPlace(fetchedPlace: Object): Place {
  let place = {...fetchedPlace} as Place;

  return place;
}

async function fetchLinkedPlaces(fetchedEvents: Events): Promise<Events> {
  let newEvents = {...fetchedEvents} as Events;

  // Fetch all the locations/places of the events

  let promises = newEvents.data.map(async event => fetchPlace(event.location['@id']));

  let fetchedPlaces = Promise.all(promises);
  
  fetchedPlaces
  .then(places => places.map(place => assertPlace(place)))
  .then(places => {
    // Fetch all the place images

    let promises = places.map(async place => fetchImage(place.image));

    let placeImages = Promise.all(promises);

    placeImages.then(placeImages => placeImages.map(placeImage => assertImage(placeImage)))
    .then(placeImages => {
      // Set all the place images

      places.forEach(place => {
        let placeImage = placeImages.find(placeImage => placeImage.id === place.image);

        place.linkedImage = placeImage;
      })
    })

    // Return updated places with image

    return places;
  })
  .then(places => {
    // Update the events with updated places

    places.forEach(place => {
      let index = newEvents.data.findIndex(event => event.location['@id'] === place['@id']);

      newEvents.data[index].linkedLocation = place;
    })
  })

  // return the updated events

  return newEvents;
}

function App() {
  const [languages, setLanguages] = useState<Languages>(languagesPlaceholder)
  const [events, setEvents] = useState<Events>(eventsPlaceholder);
  const [isWorking, setIsWorking] = useState<boolean>(true);
  const [eventIndex, setEventIndex] = useState<number>(-1);

  // A "cache" for place images
  //const [placeImages, setPlaceImages] = useState<Image[]>([]);

  // A "cache" for places
  //const [places, setPlaces] = useState<Place[]>([]);

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

  const getEvents = async (url = EVENTS_URL) => {
    setIsWorking(isWorking => true);

    fetchEvents(url, queryParameters)
      .then(fetchedEvents => assertEvents(fetchedEvents))
      .then(events => fetchLinkedPlaces(events))
      /*
      .then(events => {
        let newImages = [...placeImages];

        console.log("getEvents: newImages: " + JSON.stringify(newImages))

        console.log("getEvents: events.data: " + JSON.stringify(events.data))

        let data = events.data;

        data.forEach(event => {
          console.log("event: " + JSON.stringify(event));

          if (event.linkedLocation) {
            console.log("event.linkedLocation: " + JSON.stringify(event.linkedLocation));

            let imageId = event.linkedLocation.image;

            let index = newImages.findIndex(image => image.id === imageId);

            if (index === -1) {
              fetchImage(imageId)
                .then(image => assertImage(image))
                .then(image => {
                  newImages.push(image);
                  
                  return image;
                })
                .then(image => {console.log("event.linkedLocation.linkedImage: " + JSON.stringify(image)); event.linkedLocation!.linkedImage = image})
            }
            else {
              event.linkedLocation.linkedImage = placeImages[index];
            }
          }
        });

        console.log("newImages: " + JSON.stringify(newImages));

        setPlaceImages(images => newImages);

        return events;
      })
      */
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
          <EventDetails event={events.data[eventIndex]} onClick={handleEventDetailsClick}></EventDetails>
      }
    </div>
  )
}

export default hot(App);
