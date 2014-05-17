var evtSource = new EventSource("/events"); var ME;
evtSource.onmessage = function(e) { ME = e; console.log("message: " + e.data); }