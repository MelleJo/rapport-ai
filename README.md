# Rapport AI: Financial Advice Assistant

## Project Overview

Rapport AI is an advanced web application built with Next.js that provides comprehensive financial advice and tools. Leveraging cutting-edge AI technologies, the application helps users generate detailed financial reports, transcribe audio inputs, and navigate through various financial domains including mortgages, pensions, and general financial planning.

## Key Features

- **AI-Powered Financial Planning**: 
  - Generate comprehensive financial planning reports
  - Analyze financial situations with AI-driven insights
  - Automated document generation with customizable templates
  - Smart section enhancement and refinement

- **Multi-Domain Financial Tools**:
  - Mortgage (Hypotheek) planning and analysis
  - Pension planning and assessment
  - General financial advice and planning
  - Interactive forms with real-time validation

- **Advanced Document Generation**:
  - Dynamic report generation with standardized templates
  - Customizable section generation
  - Name replacement functionality
  - PDF export capabilities

- **Audio Integration**:
  - Convert audio inputs to text for comprehensive analysis
  - Seamless integration of transcribed data into reports
  - Support for name replacement and context preservation
  - Real-time audio recording and processing

## Technology Stack

- **Frontend**: Next.js 14
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **AI Integration**: OpenAI API
- **Audio Processing**: RecordRTC
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- OpenAI API Key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables in `.env.local`:
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4-1106-preview  # or your preferred model
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/`: Application routes and API endpoints
  - `api/`: Backend API routes for report generation and analysis
  - Feature-specific pages (financieel, hypotheek, pensioen)

- `src/components/`: React components
  - Core components for forms and reports
  - UI components built with shadcn/ui
  - Specialized components for audio and document handling

- `src/lib/`: Core utilities
  - Document generation
  - OpenAI integration
  - Standard text templates
  - Utility functions

- `src/types/`: TypeScript definitions
  - Financial planning types
  - Customer profile types
  - Component props and state types

- `src/prompts/`: AI prompt configurations
  - Base prompts
  - Section-specific prompts
  - Prompt building utilities

## Environment Variables

Required environment variables in `.env.local`:
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Preferred OpenAI model (default: gpt-4-1106-preview)

Optional environment variables:
- `MAX_TOKENS`: Maximum tokens for API responses
- `TEMPERATURE`: Temperature setting for AI responses

## Features in Detail

### Financial Planning
- Comprehensive financial situation analysis
- Custom report generation with AI insights
- Interactive form with dynamic sections
- Real-time data validation and processing

### Mortgage Planning
- Detailed mortgage advice generation
- Property and financial assessment
- Custom report templates
- Interactive mortgage calculator

### Pension Planning
- Retirement planning analysis
- Pension gap assessment
- Future financial projections
- Customized advice generation

## Deployment

The application is optimized for deployment on Vercel, but can be deployed to any platform supporting Next.js applications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]
