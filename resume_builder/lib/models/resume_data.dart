import 'dart:convert';
import 'personal_info.dart';
import 'work_experience.dart';
import 'education.dart';
import 'skill.dart';
import 'project.dart';
import 'certification.dart';
import 'language.dart';

class ResumeData {
  PersonalInfo personalInfo;
  List<WorkExperience> workExperiences;
  List<Education> educations;
  List<Skill> skills;
  List<Project> projects;
  List<Certification> certifications;
  List<Language> languages;

  ResumeData({
    PersonalInfo? personalInfo,
    List<WorkExperience>? workExperiences,
    List<Education>? educations,
    List<Skill>? skills,
    List<Project>? projects,
    List<Certification>? certifications,
    List<Language>? languages,
  })  : personalInfo = personalInfo ?? PersonalInfo(),
        workExperiences = workExperiences ?? [],
        educations = educations ?? [],
        skills = skills ?? [],
        projects = projects ?? [],
        certifications = certifications ?? [],
        languages = languages ?? [];

  Map<String, dynamic> toJson() => {
        'personalInfo': personalInfo.toJson(),
        'workExperiences':
            workExperiences.map((e) => e.toJson()).toList(),
        'educations': educations.map((e) => e.toJson()).toList(),
        'skills': skills.map((e) => e.toJson()).toList(),
        'projects': projects.map((e) => e.toJson()).toList(),
        'certifications':
            certifications.map((e) => e.toJson()).toList(),
        'languages': languages.map((e) => e.toJson()).toList(),
      };

  factory ResumeData.fromJson(Map<String, dynamic> json) => ResumeData(
        personalInfo: PersonalInfo.fromJson(json['personalInfo'] ?? {}),
        workExperiences: (json['workExperiences'] as List?)
                ?.map((e) => WorkExperience.fromJson(e))
                .toList() ??
            [],
        educations: (json['educations'] as List?)
                ?.map((e) => Education.fromJson(e))
                .toList() ??
            [],
        skills: (json['skills'] as List?)
                ?.map((e) => Skill.fromJson(e))
                .toList() ??
            [],
        projects: (json['projects'] as List?)
                ?.map((e) => Project.fromJson(e))
                .toList() ??
            [],
        certifications: (json['certifications'] as List?)
                ?.map((e) => Certification.fromJson(e))
                .toList() ??
            [],
        languages: (json['languages'] as List?)
                ?.map((e) => Language.fromJson(e))
                .toList() ??
            [],
      );

  String toJsonString() => jsonEncode(toJson());

  factory ResumeData.fromJsonString(String jsonString) {
    return ResumeData.fromJson(jsonDecode(jsonString));
  }
}
