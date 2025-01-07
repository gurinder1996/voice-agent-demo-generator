# Development Roadmap

## High Priority

### Call Button Improvements
- [ ] Fix call cancellation behavior
  - Implement immediate call cancellation without browser console errors
  - Ensure clean teardown of call resources when cancelled
  - Add proper error handling for cancellation states
  - Remove current workarounds for button disabled states
- [ ] Add global end call button
  - Implement persistent end call button that remains visible across all routes
  - Position button in a consistent, easily accessible location (e.g., top navigation bar)
  - Ensure button state correctly reflects current call status
  - Add visual indicator for active call state

### OpenAI Streaming Integration
- [ ] Implement streaming support for OpenAI outputs
  - Add streaming API support in OpenAI client implementation
  - Modify generated prompt component to handle streaming updates
  - Add loading indicators for streaming state
  - Implement proper error handling for stream interruptions
  - Ensure smooth UI updates during streaming

### UI/UX Enhancements
- [ ] Add loading states and skeleton placeholders
  - Implement skeleton loading for prompt cards
  - Add loading states for action buttons
  - Ensure consistent loading behavior across all dynamic elements
  - Prevent layout shifts during content loading

### Visual Polish
- [ ] Fix button hover states
  - Implement proper disabled cursor styling for call buttons
  - Review and standardize hover states across all interactive elements

## Future Improvements

### Performance
- [ ] Optimize initial page load
- [ ] Implement proper code splitting
- [ ] Add resource caching strategies

### User Experience
- [ ] Add proper error boundaries (esp. during connecting state)
- [ ] Improve error messages and recovery flows
- [ ] Add tooltips for better feature discovery

## Notes
- Priority should be given to fixing the call cancellation behavior as it affects core functionality
- Loading states should be implemented to improve perceived performance and user experience
- Visual polish can be addressed after core functionality is stable
