# Quick Start Guide - Flutter Resume Builder

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Flutter SDK** (3.0.0 or higher)
   - Download from: https://flutter.dev/docs/get-started/install
   - Add Flutter to your PATH

2. **Dart SDK** (comes with Flutter)

3. **IDE** (choose one):
   - Android Studio with Flutter plugin
   - VS Code with Flutter extension
   - IntelliJ IDEA with Flutter plugin

4. **Platform-specific requirements**:
   - **Android**: Android Studio and Android SDK
   - **iOS**: Xcode (macOS only)
   - **Web**: Chrome browser

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd resume_builder
```

### 2. Get Dependencies
```bash
flutter pub get
```

This will download all required packages:
- provider (state management)
- shared_preferences (local storage)
- printing (PDF preview)
- pdf (PDF generation)

### 3. Verify Flutter Setup
```bash
flutter doctor
```

This command checks your environment and displays a report of the status of your Flutter installation.

### 4. Run the Application

#### For Android:
```bash
flutter run
```
Or use Android Studio/VS Code to run on a connected device or emulator.

#### For iOS (macOS only):
```bash
flutter run -d ios
```

#### For Web:
```bash
flutter run -d chrome
```

#### For specific device:
```bash
# List available devices
flutter devices

# Run on specific device
flutter run -d <device_id>
```

## First Time Usage

### Step 1: Personal Information
1. Launch the app
2. Fill in your personal details:
   - Full Name
   - Email
   - Phone
   - Address
   - LinkedIn profile
   - Website
   - Professional Summary

### Step 2: Add Work Experience
1. Tap the "Add" button in the Work Experience section
2. Fill in details:
   - Company name
   - Position
   - Start date (e.g., "01/2020")
   - End date (e.g., "12/2023" or "Present")
   - Description of responsibilities
3. Check/uncheck the checkbox to include/exclude
4. Repeat for additional work experiences

### Step 3: Add Education
1. Tap the "Add" button in the Education section
2. Fill in details:
   - Institution name
   - Degree (e.g., "Bachelor of Science")
   - Field of Study
   - Year of graduation
   - GPA (optional)
3. Check/uncheck to include/exclude

### Step 4: Add Skills
1. Tap the "Add" button in the Skills section
2. Fill in:
   - Category (e.g., "Programming Languages")
   - Skills list (e.g., "Java, Python, Dart")
3. Repeat for different skill categories

### Step 5: Add Projects (Optional)
1. Tap the "Add" button in the Projects section
2. Fill in:
   - Project name
   - Description
   - Technologies used
   - URL (optional)

### Step 6: Add Certifications (Optional)
1. Tap the "Add" button in the Certifications section
2. Fill in:
   - Certification name
   - Issuing organization
   - Date received
   - Credential ID (optional)

### Step 7: Add Languages (Optional)
1. Tap the "Add" button in the Languages section
2. Fill in:
   - Language name
   - Proficiency level (e.g., "Native", "Fluent", "Intermediate")

### Step 8: Preview and Print
1. Tap the "Preview" button in the top-right corner
2. Review your resume in PDF format
3. Use the print icon to print
4. Use the share icon to save or share the PDF
5. The PDF filename will be: `YourName_Resume.pdf`

## Tips and Tricks

### Data Persistence
- All data is automatically saved as you type
- No need to manually save
- Data persists across app restarts
- Stored locally on your device

### Checkbox Selection
- Uncheck any entry to temporarily hide it from your resume
- Great for customizing resumes for different job applications
- Checkbox states are also saved

### Editing Entries
- Simply tap any text field to edit
- Changes are saved immediately
- No need to press a save button

### Deleting Entries
- Tap the red trash icon on any card to delete it
- Deletion is immediate and permanent

### Adding Multiple Entries
- You can add as many entries as needed in each section
- Scroll down to see all sections
- No limit on number of entries

## Building for Production

### Android APK
```bash
flutter build apk --release
```
Output: `build/app/outputs/flutter-apk/app-release.apk`

### Android App Bundle (for Play Store)
```bash
flutter build appbundle --release
```
Output: `build/app/outputs/bundle/release/app-release.aab`

### iOS (macOS only)
```bash
flutter build ios --release
```

### Web
```bash
flutter build web --release
```
Output: `build/web/` directory

## Troubleshooting

### Issue: Dependencies not downloading
**Solution:**
```bash
flutter clean
flutter pub get
```

### Issue: Build errors
**Solution:**
```bash
flutter clean
flutter pub get
flutter pub upgrade
flutter run
```

### Issue: "flutter: command not found"
**Solution:**
- Add Flutter to your PATH
- On Linux/macOS: Add `export PATH="$PATH:[PATH_TO_FLUTTER]/flutter/bin"` to your `.bashrc` or `.zshrc`
- On Windows: Add Flutter bin directory to System Environment Variables

### Issue: Android licenses not accepted
**Solution:**
```bash
flutter doctor --android-licenses
```
Accept all licenses when prompted.

### Issue: SharedPreferences not working
**Solution:**
- Ensure you're running on a real device or properly configured emulator
- Check that the app has necessary permissions

## Support

For issues or questions:
1. Check the main README.md
2. Check the IMPLEMENTATION.md for technical details
3. Review Flutter documentation: https://flutter.dev/docs
4. Check package documentation on pub.dev

## Next Steps

After getting familiar with the app:
1. Customize the resume template in `preview_screen.dart`
2. Add custom themes in `main.dart`
3. Extend with additional sections as needed
4. Implement additional features (see IMPLEMENTATION.md)

Happy resume building! 🎉
