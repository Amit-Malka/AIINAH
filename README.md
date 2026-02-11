# DMEO APP AIINAH - AI Medical Avatar & Live Health Dashboard

A Next.js application featuring a real-time interactive AI Avatar (HeyGen) combined with a live medical telemetry dashboard. Designed for telehealth and patient monitoring scenarios.

## Key Features

*   **Real-time AI Avatar Streaming**: Interactive chat interface powered by HeyGen's streaming API.
*   **"Floating Tablet" UI**: Immersive desktop design stimulating a dedicated medical device.
*   **Live Medical Dashboard**: Real-time visualization of simulated health data including:
    *   ECG Heart Rate Monitor
    *   Sleep Analysis
    *   Stress Level Monitoring
    *   Voice Tone Analysis with Recharts
*   **Responsive "Soft UI" Design**: Modern, clean aesthetic using Tailwind CSS.

## Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Framer Motion
*   **Visualization**: Recharts
*   **AI/Streaming**: HeyGen Streaming API
*   **Icons**: Lucide React

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env.local` file in the root directory and add the following keys:
    ```env
    NEXT_PUBLIC_HEYGEN_API_KEY=your_heygen_api_key_here
    ```
    *Note: Ensure you have a valid HeyGen API Enterprise Token.*

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

*   `src/app/chat`: Main application interface containing the Avatar stream and Dashboard.
*   `src/components/chat`: Components related to the AI Avatar interaction (`AvatarStream`).
*   `src/components/dashboard`: Dashboard widgets and layout components.
*   `src/types`: TypeScript definitions for health data and application state.
*   `src/lib`: Configuration and mock data generators.
