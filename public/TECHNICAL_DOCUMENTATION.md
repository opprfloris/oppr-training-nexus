
# OPPR Training Platform - Technical Documentation

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Application Structure](#application-structure)
5. [Core Features](#core-features)
6. [Database Schema](#database-schema)
7. [Authentication & Authorization](#authentication--authorization)
8. [File Management](#file-management)
9. [AI Integration](#ai-integration)
10. [Development Setup](#development-setup)
11. [Deployment Guide](#deployment-guide)
12. [Security Considerations](#security-considerations)
13. [API Reference](#api-reference)
14. [Component Architecture](#component-architecture)
15. [Performance Considerations](#performance-considerations)

---

## Executive Summary

The OPPR Training Platform is a comprehensive training management system designed for industrial and operational training scenarios. The platform enables organizations to create, manage, and deploy interactive training content with AI-assisted generation capabilities.

### Key Value Propositions

- **AI-Powered Training Creation**: Automated generation of training flows from documents
- **Visual Training Designer**: Drag-and-drop interface for creating training sequences
- **Project-Based Management**: Organized approach to training deployment
- **Integrated Document Management**: Centralized storage and processing of training materials
- **QR Code Integration**: Physical-digital bridge for equipment-based training
- **Comprehensive User Management**: Role-based access control and skills tracking

---

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Application]
        B[Desktop Layout]
        C[Mobile Layout]
        D[Shared Components]
    end
    
    subgraph "State Management"
        E[React Query]
        F[Context API]
        G[Local Storage]
    end
    
    subgraph "Backend Services"
        H[Supabase Database]
        I[Supabase Auth]
        J[Supabase Storage]
        K[AI Services]
    end
    
    subgraph "External Integrations"
        L[OpenAI API]
        M[Document Processing]
        N[QR Code Generation]
    end
    
    A --> E
    A --> F
    B --> D
    C --> D
    E --> H
    F --> I
    E --> J
    K --> L
    K --> M
    D --> N
```

### Architecture Principles

1. **Component-Based Design**: Modular, reusable React components
2. **Separation of Concerns**: Clear distinction between UI, business logic, and data
3. **Responsive Design**: Adaptive layouts for desktop and mobile
4. **Progressive Enhancement**: Core functionality available without advanced features
5. **Security-First**: Authentication and authorization at every layer

---

## Technology Stack

### Frontend Technologies

- **React 18.3.1**: Core UI framework with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/UI**: High-quality component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent visual elements
- **React Router DOM**: Client-side routing and navigation
- **React Query (TanStack)**: Server state management and caching

### Backend & Infrastructure

- **Supabase**: Backend-as-a-Service providing database, auth, and storage
- **PostgreSQL**: Relational database with advanced features
- **Row Level Security (RLS)**: Database-level authorization
- **Real-time Subscriptions**: Live data updates across clients

### Development Tools

- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality enforcement
- **Bun**: Package manager and runtime

---

## Application Structure

```mermaid
graph LR
    subgraph "src/"
        A[components/] --> A1[desktop/]
        A --> A2[ui/]
        A --> A3[mobile/]
        
        B[pages/] --> B1[desktop/]
        B --> B2[mobile/]
        
        C[hooks/] --> C1[useTrainingDefinition.ts]
        C --> C2[useAIFlowGeneration.ts]
        C --> C3[useDocumentProcessor.ts]
        
        D[contexts/] --> D1[AuthContext.tsx]
        D --> D2[AISettingsContext.tsx]
        
        E[services/] --> E1[aiFlowGenerationService.ts]
        E --> E2[trainingDefinitionService.ts]
        
        F[types/] --> F1[training-definitions.ts]
        F --> F2[training-projects.ts]
        
        G[utils/] --> G1[blockUtils.ts]
        G --> G2[flowValidation.ts]
    end
```

### Directory Structure Explanation

- **components/**: Reusable UI components organized by platform (desktop/mobile)
- **pages/**: Route-level components representing full pages
- **hooks/**: Custom React hooks for business logic and state management
- **contexts/**: React context providers for global state
- **services/**: API services and external integrations
- **types/**: TypeScript type definitions
- **utils/**: Pure utility functions and helpers

---

## Core Features

### 1. Training Definition Builder

The training definition builder is the core feature allowing users to create interactive training flows.

```mermaid
flowchart TD
    A[Start Creation] --> B[Choose Method]
    B --> C[Manual Creation]
    B --> D[AI-Assisted Creation]
    
    C --> E[Add Steps]
    D --> F[Upload Document]
    F --> G[AI Analysis]
    G --> H[Generate Flow]
    
    E --> I[Configure Step]
    H --> I
    I --> J[Add Questions]
    J --> K[Set Media]
    K --> L[Define Navigation]
    L --> M[Validate Flow]
    M --> N[Publish Version]
```

**Key Components:**
- `TrainingDefinitionBuilderMinimal`: Main builder interface
- `FlowCanvas`: Visual flow editor with drag-and-drop
- `BlockPalette`: Available step types and components
- `AIFlowGenerator`: AI-powered content generation

### 2. Training Projects

Projects represent deployments of training definitions to specific contexts.

```mermaid
graph TB
    A[Training Definition] --> B[Create Project]
    B --> C[Select Floor Plan]
    C --> D[Place Markers]
    D --> E[Assign Content]
    E --> F[Configure Parameters]
    F --> G[Assign Users]
    G --> H[Activate Project]
```

**Features:**
- Floor plan integration with interactive markers
- User assignment and progress tracking
- Real-time collaboration
- Content versioning and updates

### 3. Document Management (Oppr Docs)

Centralized document storage and processing system.

```mermaid
graph LR
    A[Upload Document] --> B[Process Content]
    B --> C[Extract Text]
    B --> D[Extract Images]
    B --> E[Generate Metadata]
    C --> F[Store in Database]
    D --> F
    E --> F
    F --> G[Available for Training]
```

**Capabilities:**
- Multi-format document support (PDF, DOC, images)
- OCR text extraction
- Folder organization
- Bulk upload and management
- Search and filtering

### 4. AI Integration

AI-powered features for training content generation and analysis.

```mermaid
graph TB
    A[Document Input] --> B[Content Analysis]
    B --> C[Topic Extraction]
    B --> D[Complexity Assessment]
    B --> E[Question Generation]
    
    C --> F[Training Flow Creation]
    D --> F
    E --> F
    
    F --> G[Step Blocks]
    F --> H[Question Banks]
    F --> I[Assessment Items]
```

**AI Services:**
- Document analysis and summarization
- Automatic question generation
- Training flow optimization
- Content difficulty assessment

---

## Database Schema

```mermaid
erDiagram
    profiles {
        uuid id PK
        text email
        text role
        text first_name
        text last_name
        timestamp created_at
        timestamp updated_at
    }
    
    training_definitions {
        uuid id PK
        text title
        text description
        jsonb content
        text status
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }
    
    training_projects {
        uuid id PK
        text project_id UK
        text title
        text description
        uuid training_definition_id FK
        uuid floor_plan_id FK
        text status
        timestamp created_at
        timestamp updated_at
    }
    
    document_folders {
        uuid id PK
        text name
        text path
        uuid parent_folder_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    documents {
        uuid id PK
        uuid folder_id FK
        text original_name
        text display_name
        text file_path
        integer file_size
        text file_type
        text mime_type
        text[] tags
        timestamp created_at
    }
    
    machine_qr_entities {
        uuid id PK
        text qr_identifier UK
        text machine_name
        text location
        text department
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    floor_plans {
        uuid id PK
        text name
        text description
        text image_url
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    profiles ||--o{ training_definitions : creates
    training_definitions ||--o{ training_projects : spawns
    floor_plans ||--o{ training_projects : uses
    document_folders ||--o{ documents : contains
    document_folders ||--o{ document_folders : parent_of
```

### Key Relationships

1. **User Management**: Profiles serve as the central user entity
2. **Content Hierarchy**: Training definitions spawn multiple projects
3. **Document Organization**: Hierarchical folder structure with documents
4. **Physical Integration**: Floor plans and QR entities for spatial training
5. **Audit Trail**: Comprehensive timestamping and user tracking

---

## Authentication & Authorization

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client App
    participant S as Supabase Auth
    participant D as Database
    
    U->>C: Login Request
    C->>S: Authenticate Credentials
    S->>S: Validate User
    S->>C: Return JWT Token
    C->>C: Store Session
    C->>D: Request with Auth Header
    D->>D: Validate RLS Policies
    D->>C: Return Authorized Data
    C->>U: Display Content
```

### Role-Based Access Control

- **Admin**: Full system access and user management
- **Manager**: Training creation and project management
- **Operator**: Training consumption and progress tracking
- **Viewer**: Read-only access to assigned content

### Row Level Security Policies

- Users can only access their own profile data
- Training definitions visible based on creator and sharing settings
- Project access controlled by assignment and role
- Document access governed by folder permissions

---

## File Management

```mermaid
graph TB
    A[File Upload] --> B[Client Validation]
    B --> C[Supabase Storage]
    C --> D[Generate Public URL]
    D --> E[Store Metadata]
    E --> F[Process Content]
    
    F --> G[Text Extraction]
    F --> H[Image Processing]
    F --> I[Thumbnail Generation]
    
    G --> J[Database Storage]
    H --> J
    I --> J
```

### Supported File Types

- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, PNG, GIF, SVG
- **Presentations**: PPT, PPTX
- **Spreadsheets**: XLS, XLSX

### Storage Strategy

- Files stored in Supabase Storage buckets
- Metadata and extracted content in PostgreSQL
- CDN distribution for optimal performance
- Automatic backup and versioning

---

## AI Integration

```mermaid
graph TB
    subgraph "AI Services"
        A[Document Analysis]
        B[Content Generation]
        C[Question Creation]
        D[Flow Optimization]
    end
    
    subgraph "External APIs"
        E[OpenAI GPT]
        F[Document Processing]
        G[Image Analysis]
    end
    
    subgraph "Local Processing"
        H[Text Extraction]
        I[Metadata Generation]
        J[Content Structuring]
    end
    
    A --> E
    B --> E
    C --> E
    A --> F
    A --> G
    
    H --> A
    I --> A
    J --> B
```

### AI Capabilities

1. **Document Analysis**
   - Content summarization
   - Topic extraction
   - Complexity assessment
   - Key concept identification

2. **Training Generation**
   - Automatic step creation
   - Question generation
   - Assessment design
   - Progress tracking setup

3. **Content Optimization**
   - Learning path optimization
   - Difficulty progression
   - Engagement enhancement
   - Personalization recommendations

---

## Development Setup

### Prerequisites

- Node.js 18+ or Bun runtime
- Git for version control
- Supabase account and project

### Installation Steps

```bash
# Clone repository
git clone <repository-url>
cd oppr-training-platform

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
bun dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Development Workflow

1. **Feature Development**: Create feature branches from main
2. **Code Quality**: ESLint and TypeScript checking
3. **Component Testing**: Isolated component development
4. **Integration Testing**: Full workflow validation
5. **Performance Monitoring**: Bundle size and runtime optimization

---

## Deployment Guide

### Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Supabase Configuration

1. **Database Setup**: Run migration scripts
2. **Storage Buckets**: Configure file storage
3. **Auth Settings**: Set up authentication providers
4. **RLS Policies**: Apply security policies
5. **Functions**: Deploy edge functions if needed

### Performance Optimization

- Code splitting for reduced bundle size
- Image optimization and lazy loading
- Caching strategies for API responses
- CDN configuration for static assets

---

## Security Considerations

### Data Protection

- End-to-end encryption for sensitive data
- Secure file upload and storage
- Input sanitization and validation
- XSS and CSRF protection

### Access Control

- JWT token-based authentication
- Role-based authorization
- Resource-level permissions
- Session management and timeout

### Compliance

- GDPR compliance for user data
- SOC 2 compliance through Supabase
- Regular security audits
- Incident response procedures

---

## API Reference

### Authentication Endpoints

```typescript
// Login
POST /auth/login
{
  email: string,
  password: string
}

// Register
POST /auth/register
{
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  role: string
}
```

### Training Definitions API

```typescript
// Get all training definitions
GET /api/training-definitions

// Create training definition
POST /api/training-definitions
{
  title: string,
  description: string,
  content: StepBlock[]
}

// Update training definition
PUT /api/training-definitions/:id
{
  title?: string,
  description?: string,
  content?: StepBlock[]
}
```

### Document Management API

```typescript
// Upload document
POST /api/documents/upload
FormData: file, folder_id?, tags?

// Get documents
GET /api/documents?folder_id=uuid&search=string

// Process document
POST /api/documents/:id/process
```

---

## Component Architecture

```mermaid
graph TB
    subgraph "Page Components"
        A[DesktopLayout]
        B[TrainingDefinitions]
        C[TrainingProjects]
        D[OpprDocs]
    end
    
    subgraph "Feature Components"
        E[TrainingDefinitionBuilder]
        F[FlowCanvas]
        G[DocumentUploader]
        H[ProjectEditor]
    end
    
    subgraph "UI Components"
        I[Button]
        J[Card]
        K[Dialog]
        L[Table]
    end
    
    subgraph "Custom Hooks"
        M[useTrainingDefinition]
        N[useDocumentProcessor]
        O[useAIFlowGeneration]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> J
    G --> K
    H --> L
    
    E --> M
    F --> N
    G --> O
```

### Component Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props Interface**: Clear, typed interfaces for component communication
4. **State Locality**: Keep state as close to usage as possible
5. **Performance Optimization**: Memoization and lazy loading where appropriate

---

## Performance Considerations

### Bundle Optimization

- Tree shaking for unused code elimination
- Dynamic imports for code splitting
- Lazy loading of routes and components
- Image optimization and format selection

### Runtime Performance

- React.memo for component memoization
- useMemo and useCallback for expensive operations
- Virtual scrolling for large lists
- Debounced search and filtering

### Network Optimization

- React Query for intelligent caching
- Batch API requests where possible
- Compression for file uploads
- CDN utilization for static assets

### Database Performance

- Efficient PostgreSQL queries
- Proper indexing strategy
- Connection pooling
- Query result caching

---

## Monitoring and Analytics

### Performance Monitoring

- Bundle size tracking
- Core Web Vitals monitoring
- Error boundary implementation
- User interaction analytics

### Business Metrics

- Training completion rates
- User engagement metrics
- Content effectiveness analysis
- System usage patterns

---

## Future Roadmap

### Planned Features

1. **Mobile App**: Native mobile application
2. **Offline Support**: Progressive Web App capabilities
3. **Advanced Analytics**: Learning analytics dashboard
4. **Integration APIs**: Third-party system integration
5. **White-label Solution**: Customizable branding options

### Technical Improvements

1. **Microservices Architecture**: Service decomposition
2. **Real-time Collaboration**: Multi-user editing
3. **Advanced AI**: Machine learning recommendations
4. **Scalability**: Horizontal scaling capabilities
5. **Internationalization**: Multi-language support

---

## Conclusion

The OPPR Training Platform represents a modern, scalable solution for industrial training management. Built with cutting-edge technologies and best practices, it provides a solid foundation for growth and adaptation to changing business needs.

The platform's modular architecture, comprehensive security model, and AI-powered features position it as a leader in the training technology space. With continued development and enhancement, it will continue to serve as an essential tool for organizations seeking to improve their training effectiveness and operational excellence.

---

*Document Version: 1.0*  
*Last Updated: December 2024*  
*Maintained by: OPPR Development Team*
