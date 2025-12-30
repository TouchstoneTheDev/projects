import 'package:flutter/foundation.dart';
import '../models/resume_data.dart';
import '../models/personal_info.dart';
import '../models/work_experience.dart';
import '../models/education.dart';
import '../models/skill.dart';
import '../models/project.dart';
import '../models/certification.dart';
import '../models/language.dart';
import '../services/storage_service.dart';

class ResumeProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();
  ResumeData _resumeData = ResumeData();

  ResumeData get resumeData => _resumeData;
  PersonalInfo get personalInfo => _resumeData.personalInfo;
  List<WorkExperience> get workExperiences => _resumeData.workExperiences;
  List<Education> get educations => _resumeData.educations;
  List<Skill> get skills => _resumeData.skills;
  List<Project> get projects => _resumeData.projects;
  List<Certification> get certifications => _resumeData.certifications;
  List<Language> get languages => _resumeData.languages;

  // Load data from storage
  Future<void> loadData() async {
    final loadedData = await _storageService.loadResumeData();
    if (loadedData != null) {
      _resumeData = loadedData;
      notifyListeners();
    }
  }

  // Save data to storage
  Future<void> saveData() async {
    await _storageService.saveResumeData(_resumeData);
  }

  // Update personal info
  void updatePersonalInfo(PersonalInfo info) {
    _resumeData.personalInfo = info;
    notifyListeners();
    saveData();
  }

  // Work Experience methods
  void addWorkExperience() {
    _resumeData.workExperiences.add(
      WorkExperience(id: DateTime.now().millisecondsSinceEpoch.toString()),
    );
    notifyListeners();
    saveData();
  }

  void updateWorkExperience(int index, WorkExperience experience) {
    if (index >= 0 && index < _resumeData.workExperiences.length) {
      _resumeData.workExperiences[index] = experience;
      notifyListeners();
      saveData();
    }
  }

  void removeWorkExperience(int index) {
    if (index >= 0 && index < _resumeData.workExperiences.length) {
      _resumeData.workExperiences.removeAt(index);
      notifyListeners();
      saveData();
    }
  }

  // Education methods
  void addEducation() {
    _resumeData.educations.add(
      Education(id: DateTime.now().millisecondsSinceEpoch.toString()),
    );
    notifyListeners();
    saveData();
  }

  void updateEducation(int index, Education education) {
    if (index >= 0 && index < _resumeData.educations.length) {
      _resumeData.educations[index] = education;
      notifyListeners();
      saveData();
    }
  }

  void removeEducation(int index) {
    if (index >= 0 && index < _resumeData.educations.length) {
      _resumeData.educations.removeAt(index);
      notifyListeners();
      saveData();
    }
  }

  // Skills methods
  void addSkill() {
    _resumeData.skills.add(
      Skill(id: DateTime.now().millisecondsSinceEpoch.toString()),
    );
    notifyListeners();
    saveData();
  }

  void updateSkill(int index, Skill skill) {
    if (index >= 0 && index < _resumeData.skills.length) {
      _resumeData.skills[index] = skill;
      notifyListeners();
      saveData();
    }
  }

  void removeSkill(int index) {
    if (index >= 0 && index < _resumeData.skills.length) {
      _resumeData.skills.removeAt(index);
      notifyListeners();
      saveData();
    }
  }

  // Projects methods
  void addProject() {
    _resumeData.projects.add(
      Project(id: DateTime.now().millisecondsSinceEpoch.toString()),
    );
    notifyListeners();
    saveData();
  }

  void updateProject(int index, Project project) {
    if (index >= 0 && index < _resumeData.projects.length) {
      _resumeData.projects[index] = project;
      notifyListeners();
      saveData();
    }
  }

  void removeProject(int index) {
    if (index >= 0 && index < _resumeData.projects.length) {
      _resumeData.projects.removeAt(index);
      notifyListeners();
      saveData();
    }
  }

  // Certifications methods
  void addCertification() {
    _resumeData.certifications.add(
      Certification(id: DateTime.now().millisecondsSinceEpoch.toString()),
    );
    notifyListeners();
    saveData();
  }

  void updateCertification(int index, Certification certification) {
    if (index >= 0 && index < _resumeData.certifications.length) {
      _resumeData.certifications[index] = certification;
      notifyListeners();
      saveData();
    }
  }

  void removeCertification(int index) {
    if (index >= 0 && index < _resumeData.certifications.length) {
      _resumeData.certifications.removeAt(index);
      notifyListeners();
      saveData();
    }
  }

  // Languages methods
  void addLanguage() {
    _resumeData.languages.add(
      Language(id: DateTime.now().millisecondsSinceEpoch.toString()),
    );
    notifyListeners();
    saveData();
  }

  void updateLanguage(int index, Language language) {
    if (index >= 0 && index < _resumeData.languages.length) {
      _resumeData.languages[index] = language;
      notifyListeners();
      saveData();
    }
  }

  void removeLanguage(int index) {
    if (index >= 0 && index < _resumeData.languages.length) {
      _resumeData.languages.removeAt(index);
      notifyListeners();
      saveData();
    }
  }
}
