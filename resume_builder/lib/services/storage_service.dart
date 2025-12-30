import 'package:shared_preferences/shared_preferences.dart';
import '../models/resume_data.dart';

class StorageService {
  static const String _resumeDataKey = 'resume_data';

  // Save resume data to local storage
  Future<bool> saveResumeData(ResumeData resumeData) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = resumeData.toJsonString();
      return await prefs.setString(_resumeDataKey, jsonString);
    } catch (e) {
      print('Error saving resume data: $e');
      return false;
    }
  }

  // Load resume data from local storage
  Future<ResumeData?> loadResumeData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonString = prefs.getString(_resumeDataKey);
      
      if (jsonString == null || jsonString.isEmpty) {
        return null;
      }
      
      return ResumeData.fromJsonString(jsonString);
    } catch (e) {
      print('Error loading resume data: $e');
      return null;
    }
  }

  // Clear all resume data
  Future<bool> clearResumeData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_resumeDataKey);
    } catch (e) {
      print('Error clearing resume data: $e');
      return false;
    }
  }
}
