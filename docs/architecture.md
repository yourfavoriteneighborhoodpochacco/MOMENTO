# Questions and problems I have to solve for MOMENTO

### Scoring
- What goes in, what comes out, and why
- How to normalize different signals (crowd report = 0-1, time pattern = 0-1) so that they're all combinable
- What it means to weight a recent crowd report more heavily than a historical pattern
- Why exponential decay, as the intuition is that a crowd reort from 2 hours ago tells you almost nothing, but one from 5 minutes ago is highly reliable. Linear decay doesn't capture the curve the same way


### Heuristics
- What a heuristic model is versus what a trained model is
- Why heuristics are valid for Phase 1 and what their failure modes are
- How you'd eventually replace a heuristic with observed data without breaking the scoring function

### WebSockets vs. Polling
- HTTP is request/response
- Polling is just repeated HTTP
- WebSockets flip the model. Server can push. 
- When a user submits a crowd report, every other user viewing that location should see the update. This describes a push problem and not a pull problem.

### The Spatial Model
- For the grid/zone model, I want to divide the map into cells and aggregate activity per cell. This is good for density maps but hard to give actionable info.
- For the location model, I'll ive discrete named places with attributes. They're easier to explain and easier to seed which is why I'll choose a location model over a grid model.
- GeoJSON is the data format that connects PostgreSQL locations to my MapLibre map. 

### Computing vs. Storing
- Compare the availability score fresh on every API request. It's always accuarte but it may be slow for such a large-scale product.
- Store pre-computed scores and update them when new crowd reports come in. This gives me the fastest reads, but risks staleness
- For MOMENTO, a hybrid would be better suited fo rhtis project by storing the score and invalidating and recomputing when a WebSocket event comes in

### Optimistic UI
- When a user taps "crowded", should users wait for the server to respond before updating the marker color? Instead I might want to update immediately and roll back if the server fails.

### Hugging Face
- If a user wants to go to a certain location, they may find that this location is crowded. Instead of the user manually searching for various similar locations, I'd want to utilize AI models to help the user find similar locations that could substitute for the location they want to visit.