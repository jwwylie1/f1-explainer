const fetchSession = async (sessionKey) => {
    if (!sessionKey) return null;

    try {
        const res = await fetch(
            `https://api.openf1.org/v1/sessions?session_key=${sessionKey}`
        );
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        // safety check
        if (!data || data.length === 0) return null;

        return data[0].meeting_key
    } catch (error) {
        console.error('Error fetching messages:', error);
        // Handle the error appropriately, possibly set an error state
        throw error;
    }
};

const getMeeting = async (sessionKey) => {
  try {
    const meetingKey = await fetchSession(sessionKey)

    if (!meetingKey) {
        console.warn("No meeting key found for session: ", sessionKey);
        return null;
    }
      const res = await fetch(
          `https://api.openf1.org/v1/meetings?meeting_key=${meetingKey}`
      );
      if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      return data[0]
  } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle the error appropriately, possibly set an error state
      throw error;
  }
};

export default getMeeting