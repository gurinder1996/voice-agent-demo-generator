# AI Sales Bot Prompt Creator Blueprint

## Overview
This Make.com blueprint is designed to create personalized AI sales representative prompts based on user input from a Google Form. The process automates the creation of detailed, context-specific sales scripts for AI representatives.

## Process Flow

### 1. Google Forms Integration
- Watches for new responses in a specific Google Form
- Form ID: `1_57eCyB8ee_e08UTMhimb5zzWBZ3Rp4wdUFuFgeD4pE`
- Connected to a Google account (justin@firebringerai.com)
- Processes one response at a time (limit: 1)

### 2. Form Data Collection
The form collects the following information:
1. AI Representative Name
2. Company Name
3. Industry/Company Type
4. Target Audience
5. Specific Challenges or Goals
6. Product/Service Offered
7. Call Objective
8. Common Objections
9. Additional Information (optional)

### 3. OpenAI GPT Integration
- Uses the OpenAI GPT model (gpt-4o-mini)
- Configuration:
  - Temperature: 1 (maximum creativity)
  - Max Tokens: 2048
  - Top P: 1
  - Number of Completions: 1
  - Response Format: text

### 4. Prompt Generation Process
The system uses a two-part prompt structure:

1. **System Prompt**
   - Provides the base template for an AI sales representative
   - Includes general guidelines for:
     - Professional communication
     - Sales methodology (SPIN Selling)
     - Permission-based approach
     - Handling objections
     - Call structure
     - Example dialogues

2. **User Input Processing**
   - Takes the form responses and formats them into a structured input
   - Maps the following fields from the form:
     ```
     AI Representative name: {{6.answers.`04dd9312`.textAnswers.answers[].value}}
     Company Name: {{6.answers.`21114a40`.textAnswers.answers[].value}}
     Industry: {{6.answers.`6f1f0302`.textAnswers.answers[].value}}
     Target Audience: {{6.answers.`7289a141`.textAnswers.answers[].value}}
     Problems solved: {{6.answers.`23bf4f03`.textAnswers.answers[].value}}
     Product/service offered: {{6.answers.`4efb9ad8`.textAnswers.answers[].value}}
     Call Objective: {{6.answers.`1d387fd1`.textAnswers.answers[].value}}
     Common Objections: {{6.answers.`6b96c286`.textAnswers.answers[].value}}
     ```

## Output
The blueprint generates a personalized sales script that includes:
- Customized introduction and company details
- Industry-specific pain points and solutions
- Tailored objection handling responses
- Specific call objectives and next steps
- Natural dialogue examples relevant to the business context

## Usage
1. Users fill out the Google Form with their specific business details
2. The blueprint automatically processes new form submissions
3. GPT generates a personalized sales script based on the template and user input
4. The output can be used to train AI sales representatives for specific business contexts
