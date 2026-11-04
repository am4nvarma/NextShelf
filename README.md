# 📚 NextShelf

**Discover books. Build your library. Find your next read.**

NextShelf is an open-source book discovery and reading application built with React Native and Expo.

The goal is to create a lightweight, user-friendly platform where readers can discover books, explore authors, organize their personal libraries, and eventually enjoy a personalized reading experience with the help of AI.

The project is being developed with a focus on performance, accessibility, privacy, and support for low-end Android devices.

## ✨ Features

### Currently implemented
- 📖 Discover books using the Open Library API.
- 🔍 Search for books by title, author, or keyword.
- 📚 Paginated book loading.
- 🖼️ Book covers with fallback placeholders.
- 📄 Detailed book information.
- ✍️ Author information.
- 🧭 Navigation between discovery and book details.
- ⚡ Debounced search to reduce unnecessary API requests.
- 🚀 Optimized book cards and FlatList rendering.

### Planned features
- 🔐 User authentication with Supabase.
- 🎯 Genre-based onboarding.
- ❤️ Personal library and favourites.
- 📚 Reading progress and reading status.
- 🤖 Conversational AI book discovery companion.
- 📥 Legal PDF importing and downloading.
- 📖 PDF reading functionality.
- 📴 Offline reading support.
- 💡 Personalized book recommendations.
- 🔄 Multiple book data providers.
- 📱 Further optimization for low-end Android devices.

*Planned features are under development and are not yet available.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application framework |
| Expo | Development and build tooling |
| TypeScript | Type safety |
| Expo Router | File-based navigation |
| Open Library API | Book discovery and metadata |
| React Hooks | State and lifecycle management |

### Planned technologies

- Supabase – Authentication and database.
- Zustand – Application state management.
- TanStack Query – Server state and caching.
- AsyncStorage – Local persistence.
- AI API – Conversational book discovery.

## 📂 Project Structure

```text
NextShelf/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── book/
│       └── [id].tsx
│
├── components/
│   └── BookCard.tsx
│
├── screens/
│   └── DiscoveryScreen.tsx
│
├── services/
│   └── bookApi.ts
│
├── types/
│   └── book.ts
│
├── App.tsx
└── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Git
- Android Studio (for Android development)
- Expo development environment

### Installation

Clone the repository:

```bash
git clone https://github.com/am4nvarma/NextShelf.git
```

Navigate into the project:

```bash
cd NextShelf
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

For a native Android development build, use the appropriate Expo development-build workflow.

## 📚 Book Data

NextShelf currently uses the [Open Library API](https://openlibrary.org/developers/api).

Open Library provides book metadata, author information, search results, and cover images.

The long-term plan is to integrate multiple book data providers to improve reliability, coverage, and reading options.

## 🎯 Project Vision

NextShelf aims to become more than a book search application.

The long-term vision is to build an open-source reading ecosystem that combines:

- Book discovery.
- Personal reading libraries.
- Intelligent recommendations.
- Conversational AI assistance.
- Legal digital book access.
- Offline reading.
- Privacy-conscious design.

Performance and usability on budget Android devices are important design priorities.

## 🌱 Open Source

NextShelf is being developed as an open-source project.

The intention is to make the application accessible, transparent, and suitable for distribution through F-Droid, subject to its requirements and a future compatibility review.

**License:** MIT License

## 🤝 Contributions

Contributions, suggestions, bug reports, and feedback will be welcome as the project matures.

## 📌 Development Status

NextShelf is currently in active development.

The discovery experience, Open Library integration, book details, navigation, search, and pagination are implemented. Authentication, personal libraries, AI features, and reading functionality are planned.

---

**NextShelf — Your next favourite book is waiting. 📚**
