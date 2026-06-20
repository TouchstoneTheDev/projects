# Resume Builder

A Flutter-based resume builder application with local storage and print functionality.

## Features

- **Personal Information Management**: Add and edit personal details including name, email, phone, address, LinkedIn, website, and professional summary
- **Work Experience**: Add multiple work experiences with company, position, duration, and detailed descriptions
- **Education**: Add multiple educational qualifications with institution, degree, field of study, year, and GPA
- **Skills**: Organize skills by categories (e.g., Programming Languages, Tools, Frameworks)
- **Projects**: Showcase projects with descriptions, technologies used, and URLs
- **Certifications**: List professional certifications with issuer and credential information
- **Languages**: Add language proficiencies
- **Checkbox Selection**: Each entry has a checkbox to include/exclude from the final resume
- **Data Persistence**: All data is automatically saved locally using SharedPreferences
- **PDF Preview**: Professional resume preview with print and share capabilities
- **Professional Template**: Clean, ATS-friendly resume format

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK (3.0.0 or higher)
- Android Studio / VS Code with Flutter extensions

### Installation

1. Clone the repository
2. Navigate to the `resume_builder` directory
3. Run `flutter pub get` to install dependencies
4. Run `flutter run` to start the application

### Dependencies

- `provider`: State management
- `shared_preferences`: Local data storage
- `printing`: PDF preview and printing
- `pdf`: PDF document generation

## Project Structure

```
resume_builder/
├── lib/
│   ├── models/           # Data models
│   │   ├── personal_info.dart
│   │   ├── work_experience.dart
│   │   ├── education.dart
│   │   ├── skill.dart
│   │   ├── project.dart
│   │   ├── certification.dart
│   │   ├── language.dart
│   │   └── resume_data.dart
│   ├── screens/          # UI screens
│   │   ├── home_screen.dart
│   │   └── preview_screen.dart
│   ├── widgets/          # Reusable widgets
│   │   ├── custom_text_field.dart
│   │   ├── section_header.dart
│   │   ├── work_experience_card.dart
│   │   ├── education_card.dart
│   │   ├── skill_card.dart
│   │   ├── project_card.dart
│   │   ├── certification_card.dart
│   │   └── language_card.dart
│   ├── services/         # Business logic and storage
│   │   ├── storage_service.dart
│   │   └── resume_provider.dart
│   └── main.dart         # Entry point
├── android/              # Android configuration
├── pubspec.yaml          # Dependencies
└── README.md
```

## Usage

1. **Add Information**: Use the "Add" buttons in each section to create new entries
2. **Edit Entries**: Fill in the form fields for each entry
3. **Select/Deselect**: Use checkboxes to include or exclude specific entries from your resume
4. **Preview**: Click the "Preview" button to see your resume in PDF format
5. **Print/Share**: Use the print and share options in the preview screen

## Building for Production

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

### Web
```bash
flutter build web --release
```

## License

This project is open source and available for educational purposes.
