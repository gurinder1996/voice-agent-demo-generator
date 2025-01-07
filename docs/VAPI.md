# VAPI Integration

This document outlines the plan for integrating VAPI voice agent calls into the Sales Prompt Creator.

## Overview
Users with VAPI accounts will be able to initiate voice calls with AI agents directly from the interface using their VAPI API key. This feature will be accessible via a call button placed alongside existing prompt actions.

## Implementation Requirements

### 1. Configuration
- Add VAPI API key configuration
  - Store in environment variables
  - Add to user settings/configuration UI
  - Implement secure storage

### 2. UI Components
- New CallButton component following existing ActionButton pattern
- States to handle:
  - Idle (default)
  - Initializing call
  - Active call
  - Error states
  - Call ending
- Visual indicators:
  - Microphone icon (using Lucide icons like other buttons)
  - Loading spinner during initialization
  - Active call indicator
  - Error state

### 3. Integration Points
The CallButton will be added to:
1. `components/generated-prompt.tsx` - Left of existing action buttons
2. `components/prompt-history.tsx` - Left of existing action buttons

### 4. Required Information

To complete this integration, we need:

#### From VAPI:
- API documentation for initializing calls
- WebRTC/WebSocket setup requirements
- Authentication flow documentation
- Error codes and handling
- Call lifecycle management
- Audio stream handling documentation

#### From Project:
- Environment variable configuration
- User settings management approach
- Current error handling patterns
- State management patterns

### 5. State Management

The call button will manage the following states:
```typescript
type CallState = 
  | 'idle'
  | 'initializing'
  | 'active'
  | 'error'
  | 'ending';

interface CallError {
  code: string;
  message: string;
  // Additional error details from VAPI
}
```

### 6. Error Handling

Common error scenarios to handle:
- Invalid/missing API key
- Network connectivity issues
- Microphone permission denied
- Call initialization failures
- Connection drops during active call

### 7. User Experience

The call flow should be:
1. User clicks call button
2. System checks for API key configuration
3. If not configured, prompt for API key
4. Initialize call with loading indicator
5. Request microphone permissions if needed
6. Connect call when ready
7. Show active call state
8. Allow ending call via second click
9. Handle errors with clear user feedback

## Next Steps

1. Obtain VAPI documentation and example code
2. Create CallButton component
3. Implement basic UI integration
4. Add API key configuration
5. Implement call initialization
6. Add error handling
7. Test and refine user experience

## Additional Context Needed

- VAPI pricing/usage limits
- Browser compatibility requirements
- Mobile support considerations
- Call quality requirements
- Rate limiting details
- Webhook integration options (if any)
