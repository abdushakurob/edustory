# StoryMind AI - Intelligent Learning Platform

A production-grade MVP that transforms educational documents into engaging, AI-powered learning experiences using Next.js, Prisma, PostgreSQL, and Google Gemini AI.

## 🎯 Core Features

### 1. **Subject-Based Learning Organization**
- Create multiple isolated subjects (Biology, Physics, etc.)
- Each subject has its own documents, stories, questions, and progress
- Choose from themed learning environments (Academic, City, World, Lab, Courtroom)

### 2. **Intelligent Document Processing**
- Upload: PDFs, DOCX, PowerPoint, and images (PNG, JPG)
- Automatic text extraction and OCR for images
- Smart chunking into manageable sections
- Full text preservation for AI context

### 3. **AI-Powered Story Generation**
- Converts academic content into narrative explanations
- Maintains 100% accuracy to source material
- Generates key points and summaries
- Story-based learning with metaphors

### 4. **Interactive Quiz System**
- Auto-generates 3-5 comprehension questions per section
- Multiple question types: multiple choice, short answer, true/false
- Pedagogically varied difficulty levels
- Personalized AI feedback for incorrect answers
- Full answer history with tracking

### 5. **Professional UI/UX**
- Clean, minimal academic design
- Card-based layout
- Responsive on all devices
- Smooth animations and transitions
- Accessible color palette

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: React, Lucide Icons
- **State Management**: Zustand
- **Notifications**: React Hot Toast

### Backend
- **API**: Next.js API Routes & Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local filesystem (cloud-ready abstraction)
- **Authentication**: JWT + HTTP-only cookies

### AI & Processing
- **AI Model**: Google Gemini 1.5 Flash
- **File Processing**: pdf-parse, docx, sharp (images)
- **Prompt Engineering**: Subject-scoped, context-aware prompts

## 📁 Project Structure

```
edustory/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── upload/              # File upload handler
│   │   ├── stories/             # Story generation
│   │   └── questions/           # Question generation
│   ├── actions/                 # Server actions
│   │   ├── subjects.ts          # Subject management
│   │   ├── documents.ts         # Document & section handling
│   │   └── stories.ts           # Story & quiz logic
│   ├── (pages)/
│   │   ├── page.tsx             # Landing page
│   │   ├── login/               # Sign in
│   │   ├── register/            # Sign up
│   │   ├── dashboard/           # Subject list
│   │   └── subject/[id]/        # Subject detail & documents
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── middleware.ts            # Auth middleware
├── components/                   # React components
│   ├── auth/                    # Auth components
│   ├── subjects/                # Subject management
│   ├── documents/               # File upload
│   └── stories/                 # Story & quiz UI
├── lib/                          # Utilities
│   ├── auth/                    # Auth helpers
│   │   ├── password.ts          # Password hashing
│   │   ├── jwt.ts               # JWT handling
│   │   └── session.ts           # Session management
│   ├── ai/
│   │   └── gemini.ts            # Gemini integration
│   ├── file/
│   │   ├── storage.ts           # File operations
│   │   └── extraction.ts        # Text extraction
│   └── db.ts                    # Prisma client
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                       # Static files
│   └── uploads/                 # User uploads (by subject)
├── .env.local                   # Local env vars
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── next.config.js               # Next.js config
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API key

### Installation

1. **Clone & Setup**
```bash
cd /Users/icekidsmart/Desktop/edustory
npm install
```

2. **Configure Environment**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values:
# - DATABASE_URL: PostgreSQL connection string
# - NEXTAUTH_SECRET: Random 32+ char string
# - NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY: Your Gemini API key
```

3. **Setup Database**
```bash
# Create migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🗄️ Database Schema

### Core Models

**User**
- Stores authentication and profile
- Has many subjects and quiz attempts

**Subject**
- Isolated learning context per subject
- Contains documents, stories, questions
- Supports theme selection

**Document**
- Uploaded file metadata
- Stores extracted text
- References multiple sections

**Section**
- Logical chunk of a document
- Linked to a single story
- Associated with quiz questions

**Story**
- AI-generated narrative explanation
- Key points and summary
- Subject-scoped context

**Question**
- Quiz question with metadata
- Multiple question types
- Pedagogically crafted

**AnswerAttempt**
- User quiz responses
- Correctness tracking
- AI-generated feedback

**AIContext**
- System prompts per subject
- Context window management

## 🤖 AI Prompts

All Gemini prompts are **subject-scoped** and include:

1. **System Prompt**: Defines role, constraints, theme
2. **Context Window**: Only relevant subject + section data
3. **Accuracy Enforcement**: Explicit instruction to stay within content
4. **Quality Standards**: Pedagogical rigor, narrative coherence

### Key Prompt Features
- ✅ Enforces accuracy (no hallucination)
- ✅ Uses theme metaphors without losing rigor
- ✅ Generates varied question types
- ✅ Creates personalized, story-based feedback
- ✅ Subject isolation (no cross-subject context)

## 📄 Supported File Types

| Type | Extension | Processing |
|------|-----------|-----------|
| PDF | .pdf | pdf-parse |
| Word | .docx | docx library |
| PowerPoint | .ppt, .pptx | Placeholder (extensible) |
| Image | .png, .jpg, .jpeg | Gemini Vision + OCR |

## 🔐 Authentication

- **Method**: Email + Password
- **Hashing**: bcryptjs (12 rounds)
- **Sessions**: JWT tokens in HTTP-only cookies
- **Expiry**: 30 days
- **Protection**: Middleware for auth routes

## 🎓 Learning Flow

```
1. User creates Subject
   ↓
2. Upload Document
   ↓
3. Document → Sections (auto-chunked)
   ↓
4. User clicks "Generate AI Story"
   ↓
5. Gemini creates narrative + key points
   ↓
6. User clicks "Generate Practice Questions"
   ↓
7. Gemini creates 3-5 varied questions
   ↓
8. User answers → AI validates + provides feedback
   ↓
9. Progress tracked in subject
```

## 📊 Performance Considerations

- **Pagination**: Document lists (if needed)
- **Caching**: Story generation results
- **Async**: Question generation happens in background
- **Upload Limits**: 50MB max file size
- **Chunking**: ~1500 char sections (tunable)

## 🛡️ Security

- ✅ HTTP-only cookie sessions
- ✅ CSRF protection via SameSite cookies
- ✅ Server-side authorization checks
- ✅ Subject isolation (no cross-subject data leaks)
- ✅ Password hashing with bcryptjs
- ✅ JWT verification on protected routes

## 🚢 Deployment Ready

The MVP is designed for production with:

- **Environment separation**: .env.local vs production
- **Error handling**: Graceful fallbacks
- **Logging**: Server-side error logging
- **Database**: Prisma migrations
- **Static hosting**: Vercel, AWS, etc.

### Example: Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "Initial StoryMind AI MVP"
git push origin main

# Connect to Vercel and deploy
# Set environment variables in Vercel dashboard
# Database URL, Gemini API key, etc.
```

## 📝 Development Notes

### Adding New File Types
1. Update extraction.ts
2. Add handler in `/api/upload`
3. Test and validate

### Customizing AI Prompts
1. Edit `lib/ai/gemini.ts`
2. Modify `SYSTEM_PROMPT_TEMPLATE`
3. Test prompt quality

### Extending Database
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <description>`
3. Update server actions

## 🐛 Known Limitations

- PowerPoint extraction requires additional library
- Image handling optimized for JPG/PNG
- Single-user focus (no collaboration yet)
- No real-time collaboration

## 🤝 Contributing

This MVP is optimized for judges & stakeholders to immediately see:
- ✅ Clean, functional UI
- ✅ Real AI integration
- ✅ Working quiz system
- ✅ Proper database design
- ✅ Production architecture

## 📄 License

This project is built as a hackathon MVP.

---

**Built with ❤️ for intelligent learning**
# edustory
