# Rapport AI: Financial Advice Assistant

## Project Overview

Rapport AI is an advanced web application built with Next.js that provides comprehensive financial advice and tools. Leveraging cutting-edge AI technologies, the application helps users generate detailed financial reports, transcribe audio inputs, and navigate through various financial domains including mortgages, pensions, and general financial planning.

## Key Features

- **AI-Powered Financial Planning**: 
  - Generate comprehensive financial planning reports
  - Analyze financial situations with AI-driven insights
  - Automated document generation with customizable templates
  - Smart section enhancement and refinement
  - Interactive wizard interface for guided planning

- **Multi-Domain Financial Tools**:
  - Mortgage (Hypotheek) planning and analysis with step-by-step wizard
  - Pension planning and assessment
  - General financial advice and planning
  - Interactive forms with real-time validation

- **Advanced Document Generation**:
  - Dynamic report generation with standardized templates
  - Customizable section generation and enhancement
  - Name replacement functionality for personalization
  - PDF export capabilities
  - Block-based editing for fine-tuned control

- **Audio Integration**:
  - Convert audio inputs to text for comprehensive analysis
  - Seamless integration of transcribed data into reports
  - Support for name replacement and context preservation
  - Real-time audio recording and processing

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand with persistent storage and hydration
- **AI Integration**: OpenAI API with GPT-4
- **Audio Processing**: RecordRTC for voice recording and transcription
- **Language**: TypeScript with strict type checking

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
OPENAI_MODEL=gpt-4
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
  - `api/`: Backend API routes for report generation, analysis, and transcription
  - Feature-specific pages (financieel, hypotheek, pensioen)
  - Core layout and global styles

- `src/components/`: React components
  - Wizard interfaces (FinancialWizard.tsx, HypotheekWizard.tsx)
  - Form components (FinancialPlanningForm.tsx, HypotheekForm.tsx)
  - Report components (AdviceReport.tsx, FinancialPlanningReport.tsx)
  - Navigation and routing (Navigation.tsx, NavigationManager.tsx)
  - Audio handling (AudioRecorder.tsx, TranscriptInput.tsx)
  - UI components built with shadcn/ui
  - State hydration (StoreHydration.tsx)

- `src/lib/`: Core utilities
  - Document generation (documentGenerator.ts)
  - OpenAI integration (openai.ts)
  - Standard text templates (standardTexts.ts)
  - Utility functions (utils.ts)

- `src/stores/`: State Management
  - Customer data (useCustomerStore.ts)
  - Navigation state (useNavigationStore.ts)
  - Report data (UseReportStore.ts)
  - Transcript management (UseTranscriptStore.ts)
  - Global state hydration (StoreHydration.tsx)

- `src/types/`: TypeScript definitions
  - Financial planning types (FinancialPlanning.ts)
  - Customer profile types (klantProfiel.ts)
  - Section definitions (Section.ts)
  - Transcript types (Transcript.ts)
  - RecordRTC types (recordrtc.d.ts)

- `src/prompts/`: AI prompt configurations
  - Base prompts and templates
  - Section-specific prompts
  - Prompt building utilities

## Environment Variables

Required environment variables in `.env.local`:
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Preferred OpenAI model (default: gpt-4)

Optional environment variables:
- `MAX_TOKENS`: Maximum tokens for API responses (default: 4000)
- `TEMPERATURE`: Temperature setting for AI responses (default: 0.7)

## Features in Detail

### Financial Planning Wizard
- Step-by-step guided financial planning process
- Interactive forms with real-time validation
- AI-powered analysis and recommendations
- Dynamic report generation with customizable sections

### Mortgage Planning
- Comprehensive mortgage advice wizard
- Property and financial assessment
- Custom report templates with AI enhancement
- Interactive mortgage calculator and analysis

### Pension Planning
- Retirement planning analysis
- Pension gap assessment
- Future financial projections
- Customized advice generation

### Document Generation
- AI-enhanced report sections
- Block-based editing capabilities
- Name replacement for personalization
- PDF export functionality
- Standard text template integration

### Audio Processing
- Real-time audio recording
- Automatic transcription
- Integration with report generation
- Context-aware processing

## Deployment

The application is optimized for deployment on Vercel, but can be deployed to any platform supporting Next.js applications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]
