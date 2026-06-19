# Study Planner - Launch & Scalability Roadmap

This document outlines the final launch checklist and future feature scaling recommendations based on the architectural blueprints.

## 1. Production Release Checklist (Google Play Store)

1. **Developer Account**: Create Google Play Developer account and setup the app listing.
2. **App Bundle Generation**: Build the signed AAB file (`./gradlew bundleRelease`) instead of APK for the Play Store.
3. **Store Assets**: 
   - 512x512 High-res icon
   - 1024x500 Feature graphic
   - 2-8 App screenshots per device type
4. **Store Description**: Draft short description (80 chars) and long description (up to 4000 chars).
5. **Content Rating**: Complete the Play Console content rating questionnaire.
6. **Pricing & Distribution**: Configure free/paid status and select target countries.
7. **Alpha Testing**: Submit to closed testing track (test with 5-10 real users).
8. **Fix & Rebuild**: Address issues found in Alpha, generate new AAB if needed.
9. **Beta Testing**: Submit to open testing track for a broader audience.
10. **Production Review**: Submit for final production review (allow 3-7 days for Google).
11. **Staged Rollout**: After approval, execute a staged rollout (10% -> 25% -> 50% -> 100%).
12. **Monitoring**: Monitor crash rates via Firebase Crashlytics and Play Console vitals.

---

## 2. Scalability Recommendations (Future Features)

As the application user base grows, the following features and architectural approaches are recommended:

| Future Feature | Recommended Approach | Why |
| :--- | :--- | :--- |
| **Group Study Rooms** | WebSocket via `socket.io-client` | Enables real-time multi-user syncing and collaboration without HTTP polling overhead. |
| **Video Study Sessions** | Daily.co or Agora RN SDK | Fully managed WebRTC infrastructure prevents the need to build complex video-streaming servers. |
| **Offline-First Mode** | WatermelonDB + Sync Engine | Provides a robust SQLite-based local database capable of complex relational queries with built-in cloud sync logic. |
| **Multi-Language (i18n)**| `react-i18next` + Language Detector | Industry standard for translations with built-in Right-To-Left (RTL) layout support. |
| **Flashcard Feature** | Extend existing Materials module | Can easily link to existing subjects and utilize the established file/content storage architecture. |
| **Teacher/Parent Portal**| Separate web portal/app | Distinct user experience and permissions requirements that would clutter the primary student interface. |
| **Analytics Events** | Mixpanel or Amplitude SDK | Provides deep user behavior insights and funnel tracking beyond what basic Firebase Analytics offers. |
