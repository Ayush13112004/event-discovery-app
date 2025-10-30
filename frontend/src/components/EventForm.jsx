import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useNavigate } from 'react-router-dom';

// This function handles the form submission logic.
// It can be defined outside the component.
async function createEventAction(previousState, formData) {
  const data = {
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
    date: formData.get('date'),
    maxParticipants: parseInt(formData.get('maxParticipants')),
  };

  try {
    const response = await fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json();
      // Return an error state
      return { success: false, message: errData.message || 'Failed to create event' };
    }

    const newEvent = await response.json();
    // Return a success state
    return { success: true, message: 'Event created!', eventId: newEvent.id };

  } catch (err) {
    // Return a network error state
    return { success: false, message: err.message };
  }
}

// A helper component to use the useFormStatus hook
// This *must* be a separate component inside the <form>
function SubmitButton() {
  const { pending } = useFormStatus(); // This hook gets the form's pending state
  return (
    <button type="submit" className="btn" disabled={pending}>
      {pending ? 'Creating...' : 'Create Event'}
    </button>
  );
}

function EventForm() {
  const navigate = useNavigate();
  
  // Initial state for the form
  const initialState = { success: false, message: null, eventId: null };
  
  // useFormState hook
  // It returns the current state and an "action" to pass to the form
  const [state, formAction] = useFormState(createEventAction, initialState);

  // Effect to redirect after successful submission
  React.useEffect(() => {
    if (state.success === true) {
      // Redirect to homepage after success
      navigate('/');
    }
  }, [state.success, navigate]);

  return (
    <div className="event-form-page">
      <h2>Create a New Event</h2>
      
      {/* Pass the 'formAction' to the <form> element.
        React 19 handles the rest.
      */}
      <form action={formAction} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input type="text" id="location" name="location" required />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date and Time *</label>
          <input type="datetime-local" id="date" name="date" required />
        </div>
        <div className="form-group">
          <label htmlFor="maxParticipants">Max Participants *</label>
          <input type="number" id="maxParticipants" name="maxParticipants" defaultValue="50" min="1" required />
        </div>

        {/* Display error message directly from the form state */}
        {state.message && !state.success && (
          <p className="error">Error: {state.message}</p>
        )}

        {/* Use the helper component for the submit button */}
        <SubmitButton />
      </form>
    </div>
  );
}

export default EventForm;