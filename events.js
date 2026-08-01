const DATA_FILE = 'events-data.json';
const statusText = document.getElementById('statusText');
const weekLabel = document.getElementById('weekLabel');
const calendarGrid = document.getElementById('calendarGrid');
const eventList = document.getElementById('eventList');
const refreshButton = document.getElementById('refreshButton');
const prevWeekButton = document.getElementById('prevWeek');
const nextWeekButton = document.getElementById('nextWeek');
let currentMonthStart = getMonthStart(new Date());

const fallbackEvents = [
  {
    title: 'Humboldt Community Market',
    date: new Date(),
    time: '10:00 AM',
    location: 'Arcata Plaza',
    source: 'Manual',
    url: 'https://www.northcoastjournal.com/events',
  },
  {
    title: 'Live Music at Humboldt Brews',
    date: addDays(getWeekStart(new Date()), 2),
    time: '7:00 PM',
    location: 'Humboldt Brews',
    source: 'Manual',
    url: 'https://www.eventbrite.com/d/ca--humboldt-county/events/',
  },
];

function getWeekStart(date) {
  const newDate = new Date(date);
  const day = newDate.getDay();
  const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
  newDate.setDate(diff);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function getMonthStart(date) {
  const newDate = new Date(date);
  newDate.setDate(1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function formatDateLong(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function updateWeekLabel() {
  weekLabel.textContent = `Month: ${formatMonthYear(currentMonthStart)}`;
}

function setStatus(message, success = true) {
  statusText.textContent = message;
  statusText.style.color = success ? '#dfdfdf' : '#ff8b8b';
}

function renderCalendar(events) {
  calendarGrid.innerHTML = '';
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  dayHeaders.forEach(label => {
    const header = document.createElement('div');
    header.className = 'event-day-header';
    header.textContent = label;
    calendarGrid.appendChild(header);
  });

  const monthStart = currentMonthStart;
  const monthStartWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = addDays(monthStart, -monthStartWeekday);
  const todayKey = getDayKey(new Date());

  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    const dayCard = document.createElement('div');
    dayCard.className = 'event-day-card';
    const dayKey = getDayKey(date);
    if (date.getMonth() !== currentMonthStart.getMonth()) {
      dayCard.classList.add('outside-month');
    }
    if (dayKey === todayKey) {
      dayCard.classList.add('is-today');
    }

    const dayTitle = document.createElement('span');
    dayTitle.className = 'event-day-number';
    dayTitle.textContent = String(date.getDate());
    dayCard.appendChild(dayTitle);

    const dayEvents = events.filter(item => getDayKey(item.date) === getDayKey(date));
    if (dayEvents.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-day';
      empty.textContent = 'No events';
      dayCard.appendChild(empty);
    } else {
      dayCard.classList.add('has-events');
      dayEvents.slice(0, 2).forEach(event => {
        const eventItem = document.createElement('a');
        eventItem.href = event.url;
        eventItem.target = '_blank';
        eventItem.rel = 'noopener';
        eventItem.className = 'event-day-link';
        eventItem.innerHTML = `<strong>${event.title}</strong><span>${event.time || 'All day'}</span>`;
        dayCard.appendChild(eventItem);
      });

      if (dayEvents.length > 2) {
        const more = document.createElement('p');
        more.className = 'event-more';
        more.textContent = `+${dayEvents.length - 2} more`;
        dayCard.appendChild(more);
      }
    }
    calendarGrid.appendChild(dayCard);
  }
}

function renderEventList(events) {
  const sorted = Array.from(events).sort((a, b) => a.date - b.date);
  eventList.innerHTML = '<h3>Monthly Event Details</h3>';
  if (sorted.length === 0) {
    eventList.innerHTML += '<p>No events were available for this month.</p>';
    return;
  }
  sorted.forEach(event => {
    const card = document.createElement('article');
    card.className = 'event-card';
    card.innerHTML = `
      <h4><a href="${event.url}" target="_blank" rel="noopener">${event.title}</a></h4>
      <p><strong>Date:</strong> ${formatDateLong(event.date)} ${event.time ? '• ' + event.time : ''}</p>
      <p><strong>Location:</strong> ${event.location || 'TBD'}</p>
      <p><strong>Source:</strong> ${event.source}</p>
    `;
    eventList.appendChild(card);
  });
}

function parseISODate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeEvent(item) {
  const date = parseISODate(item.startDateIso || item.startDate || item.date || '');
  return {
    title: item.title || 'Event',
    url: item.url || '#',
    date: date || new Date(),
    time: item.detail_time || item.time || '',
    location: item.location || item.venue || '',
    source: item.source || 'Eventbrite',
  };
}

async function fetchEvents() {
  try {
    const response = await fetch(DATA_FILE, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Unable to load ${DATA_FILE}: ${response.status}`);
    }
    const items = await response.json();
    const events = items.map(normalizeEvent).filter(event => event.date instanceof Date && !Number.isNaN(event.date.getTime()));
    setStatus(`Loaded ${events.length} events from static feed.`, true);
    return events;
  } catch (error) {
    console.error(error);
    setStatus('Unable to load static event feed. Showing fallback events.', false);
    return fallbackEvents;
  }
}

function filterMonth(events) {
  return events.filter(event => {
    return (
      event.date.getFullYear() === currentMonthStart.getFullYear() &&
      event.date.getMonth() === currentMonthStart.getMonth()
    );
  });
}

function getNearestMonthStart(events, referenceDate) {
  if (!events.length) return null;

  const sorted = Array.from(events).sort((a, b) => a.date - b.date);
  const referenceTime = referenceDate.getTime();

  // Prefer the next upcoming event month; if none remain, fall back to latest available month.
  const upcoming = sorted.find(event => event.date.getTime() >= referenceTime);
  if (upcoming) {
    return getMonthStart(upcoming.date);
  }

  return getMonthStart(sorted[sorted.length - 1].date);
}

function addMonths(date, amount) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function loadWeeklyEvents() {
  setStatus('Loading monthly events…');
  const events = await fetchEvents();

  let monthEvents = filterMonth(events);

  if (events.length > 0 && monthEvents.length === 0) {
    const nearestMonth = getNearestMonthStart(events, new Date());
    if (nearestMonth) {
      currentMonthStart = nearestMonth;
      monthEvents = filterMonth(events);
      setStatus('Showing nearest available month from the event feed.', true);
    }
  }

  updateWeekLabel();
  renderCalendar(monthEvents);
  renderEventList(monthEvents);
}

refreshButton?.addEventListener('click', loadWeeklyEvents);
prevWeekButton?.addEventListener('click', () => {
  currentMonthStart = addMonths(currentMonthStart, -1);
  loadWeeklyEvents();
});
nextWeekButton?.addEventListener('click', () => {
  currentMonthStart = addMonths(currentMonthStart, 1);
  loadWeeklyEvents();
});

document.addEventListener('DOMContentLoaded', loadWeeklyEvents);
