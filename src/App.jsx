
import { useState, useEffect } from "react";
import "./App.css";

// Convert a date into YYYY-MM-DD format
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Make a date easy to read
function displayDate(date) {
  return new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

function App() {
  const today = new Date();

  // Calendar state
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    formatDate(today)
  );

  // Event form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventUser, setEventUser] = useState("");
  const [eventEmail, setEventEmail] = useState("");
  const [eventTime, setEventTime] = useState("09:00");

  // Event editing and searching
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Load saved events from localStorage
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("myCalendarEvents");
      const data = saved ? JSON.parse(saved) : [];

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  // Save events whenever they change
  useEffect(() => {
    localStorage.setItem(
      "myCalendarEvents",
      JSON.stringify(events)
    );
  }, [events]);

  // Current month information
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build the calendar days
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  // Previous month button
  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  // Next month button
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  // Reset event form
  function cancelEdit() {
    setEventTitle("");
    setEventUser("");
    setEventEmail("");
    setEventTime("09:00");
    setEditingId(null);
  }

  // Today button
  function goToday() {
    const now = new Date();

    setCurrentDate(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );

    setSelectedDate(formatDate(now));
    cancelEdit();
  }

  // Select a calendar date
  function selectDay(date) {
    setSelectedDate(date);
    cancelEdit();
  }

  // Add or update an event
  function saveEvent(e) {
    e.preventDefault();

    // Check required information
    if (
      eventTitle.trim() === "" ||
      eventUser.trim() === "" ||
      eventEmail.trim() === "" ||
      selectedDate === "" ||
      eventTime === ""
    ) {
      alert("Please complete all event fields.");
      return;
    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(eventEmail.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    if (editingId === null) {
      // Create a new event
      const newEvent = {
        id: crypto.randomUUID(),
        title: eventTitle.trim(),
        user: eventUser.trim(),
        email: eventEmail.trim(),
        date: selectedDate,
        time: eventTime,
      };

      setEvents([...events, newEvent]);
    } else {
      // Update an existing event
      const updatedEvents = events.map((event) => {
        if (event.id === editingId) {
          return {
            ...event,
            title: eventTitle.trim(),
            user: eventUser.trim(),
            email: eventEmail.trim(),
            date: selectedDate,
            time: eventTime,
          };
        }

        return event;
      });

      setEvents(updatedEvents);
    }

    cancelEdit();
  }

  // Edit event
  function editEvent(event) {
    setEventTitle(event.title);
    setEventUser(event.user || "");
    setEventEmail(event.email || "");
    setEventTime(event.time);
    setSelectedDate(event.date);
    setEditingId(event.id);

    const [eventYear, eventMonth] = event.date
      .split("-")
      .map(Number);

    setCurrentDate(
      new Date(eventYear, eventMonth - 1, 1)
    );
  }

  // Delete event
  function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (confirmed) {
      const remainingEvents = events.filter(
        (event) => event.id !== id
      );

      setEvents(remainingEvents);

      if (editingId === id) {
        cancelEdit();
      }
    }
  }

  // Open an event's date
  function openEventDate(date) {
    const [eventYear, eventMonth] = date
      .split("-")
      .map(Number);

    setCurrentDate(
      new Date(eventYear, eventMonth - 1, 1)
    );

    setSelectedDate(date);
    cancelEdit();
  }

  // Events for the selected day
  const selectedEvents = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Search by title, name, or email
  const searchResults = events
    .filter((event) => {
      const search = searchText.toLowerCase();

      return (
        event.title.toLowerCase().includes(search) ||
        (event.user || "").toLowerCase().includes(search) ||
        (event.email || "").toLowerCase().includes(search)
      );
    })
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    );

  // Show the next five future events
  const upcomingEvents = events
    .filter((event) => {
      const eventDateTime = new Date(
        `${event.date}T${event.time}:00`
      );

      return eventDateTime >= new Date();
    })
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time)
    )
    .slice(0, 5);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span className="logo">📅</span>
          <h1>My Calendar</h1>
        </div>

        <button type="button" onClick={goToday}>
          Today
        </button>
      </header>

      <main className="main-layout">
        {/* Monthly calendar */}
        <section className="calendar-container">
          <div className="calendar-header">
            <h2>{monthName}</h2>

            <div className="navigation">
              <button type="button" onClick={previousMonth}>
                ❮
              </button>

              <button type="button" onClick={nextMonth}>
                ❯
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {[
              "Sun", "Mon", "Tue", "Wed",
              "Thu", "Fri", "Sat"
            ].map((day) => (
              <div className="weekday" key={day}>
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    className="empty-day"
                    key={`empty-${index}`}
                  />
                );
              }

              const date = formatDate(
                new Date(year, month, day)
              );

              const dayEvents = events
                .filter((event) => event.date === date)
                .sort((a, b) =>
                  a.time.localeCompare(b.time)
                );

              const isToday =
                date === formatDate(new Date());

              const isSelected =
                date === selectedDate;

              return (
                <button
                  type="button"
                  key={date}
                  className={`calendar-day ${
                    isToday ? "today" : ""
                  } ${isSelected ? "selected" : ""}`}
                  onClick={() => selectDay(date)}
                >
                  <span className="day-number">
                    {day}
                  </span>

                  {dayEvents.slice(0, 2).map((event) => (
                    <span
                      className="event-label"
                      key={event.id}
                    >
                      {event.time} {event.title}
                    </span>
                  ))}

                  {dayEvents.length > 2 && (
                    <span className="more-events">
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Event management sidebar */}
        <aside className="sidebar">
          <h2>My Events</h2>

          <div className="event-count">
            Total Events: {events.length}
          </div>

          {/* Search */}
          <section className="search-section">
            <h3>Search Events</h3>

            <input
              type="text"
              placeholder="Search title, name, or email..."
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            {searchText.trim() !== "" && (
              <div className="search-results">
                {searchResults.length === 0 ? (
                  <p className="empty-message">
                    No matching events.
                  </p>
                ) : (
                  searchResults.map((event) => (
                    <button
                      type="button"
                      key={event.id}
                      className="search-item"
                      onClick={() =>
                        openEventDate(event.date)
                      }
                    >
                      <strong>{event.title}</strong>
                      <span>
                        {event.user || "No participant"}
                      </span>
                      <span>
                        {displayDate(event.date)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </section>

          {/* Add / Edit event */}
          <section className="form-section">
            <h3>
              {editingId === null
                ? "Add New Event"
                : "Edit Event"}
            </h3>

            <form
              className="event-form"
              onSubmit={saveEvent}
            >
              <label htmlFor="event-title">
                Event Title
              </label>

              <input
                id="event-title"
                type="text"
                placeholder="e.g. School Meeting"
                value={eventTitle}
                onChange={(e) =>
                  setEventTitle(e.target.value)
                }
                required
              />

              <label htmlFor="event-user">
                User / Participant Name
              </label>

              <input
                id="event-user"
                type="text"
                placeholder="Enter participant name"
                value={eventUser}
                onChange={(e) =>
                  setEventUser(e.target.value)
                }
                required
              />

              <label htmlFor="event-email">
                Email Address
              </label>

              <input
                id="event-email"
                type="email"
                placeholder="example@gmail.com"
                value={eventEmail}
                onChange={(e) =>
                  setEventEmail(e.target.value)
                }
                required
              />

              <label htmlFor="event-date">
                Event Date
              </label>

              <input
                id="event-date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const date = e.target.value;

                  if (!date) return;

                  setSelectedDate(date);

                  const [y, m] = date
                    .split("-")
                    .map(Number);

                  setCurrentDate(
                    new Date(y, m - 1, 1)
                  );
                }}
                required
              />

              <label htmlFor="event-time">
                Event Time
              </label>

              <input
                id="event-time"
                type="time"
                value={eventTime}
                onChange={(e) =>
                  setEventTime(e.target.value)
                }
                required
              />

              <button
                type="submit"
                className="save-btn"
              >
                {editingId === null
                  ? "+ Add Event"
                  : "Save Changes"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </section>

          {/* Events for selected date */}
          <section className="list-section">
            <h3>
              Events for {displayDate(selectedDate)}
            </h3>

            {selectedEvents.length === 0 ? (
              <p className="empty-message">
                No events on this date.
              </p>
            ) : (
              selectedEvents.map((event) => (
                <div
                  className="event-card"
                  key={event.id}
                >
                  <strong>{event.title}</strong>

                  <span>
                    👤 {event.user || "No participant"}
                  </span>

                  <span>
                    ✉️ {event.email || "No email provided"}
                  </span>

                  <span>🕒 {event.time}</span>

                  <div className="event-actions">
                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        editEvent(event)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Upcoming events */}
          <section className="list-section">
            <h3>Upcoming Events</h3>

            {upcomingEvents.length === 0 ? (
              <p className="empty-message">
                No upcoming events.
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <button
                  type="button"
                  className="upcoming-item"
                  key={event.id}
                  onClick={() =>
                    openEventDate(event.date)
                  }
                >
                  <strong>{event.title}</strong>

                  <span>
                    👤 {event.user || "No participant"}
                  </span>

                  <span>
                    {displayDate(event.date)} at {event.time}
                  </span>
                </button>
              ))
            )}
          </section>
        </aside>
      </main>
    </div>
  );
}

export default App;
