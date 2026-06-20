import 'package:flutter_test/flutter_test.dart';
import 'package:resume_builder/models/personal_info.dart';
import 'package:resume_builder/models/work_experience.dart';
import 'package:resume_builder/models/education.dart';
import 'package:resume_builder/models/skill.dart';
import 'package:resume_builder/models/resume_data.dart';

void main() {
  group('Model Tests', () {
    test('PersonalInfo serialization and deserialization', () {
      final personalInfo = PersonalInfo(
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        isSelected: true,
      );

      final json = personalInfo.toJson();
      final restored = PersonalInfo.fromJson(json);

      expect(restored.name, personalInfo.name);
      expect(restored.email, personalInfo.email);
      expect(restored.phone, personalInfo.phone);
      expect(restored.isSelected, personalInfo.isSelected);
    });

    test('WorkExperience serialization and deserialization', () {
      final experience = WorkExperience(
        id: '1',
        company: 'Tech Corp',
        position: 'Software Engineer',
        startDate: '01/2020',
        endDate: '12/2023',
        description: 'Developed applications',
        isSelected: true,
      );

      final json = experience.toJson();
      final restored = WorkExperience.fromJson(json);

      expect(restored.id, experience.id);
      expect(restored.company, experience.company);
      expect(restored.position, experience.position);
      expect(restored.isSelected, experience.isSelected);
    });

    test('Education serialization and deserialization', () {
      final education = Education(
        id: '1',
        institution: 'University',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        year: '2020',
        gpa: '3.8',
        isSelected: true,
      );

      final json = education.toJson();
      final restored = Education.fromJson(json);

      expect(restored.id, education.id);
      expect(restored.institution, education.institution);
      expect(restored.degree, education.degree);
      expect(restored.isSelected, education.isSelected);
    });

    test('Skill serialization and deserialization', () {
      final skill = Skill(
        id: '1',
        category: 'Programming',
        items: 'Java, Python, Dart',
        isSelected: true,
      );

      final json = skill.toJson();
      final restored = Skill.fromJson(json);

      expect(restored.id, skill.id);
      expect(restored.category, skill.category);
      expect(restored.items, skill.items);
      expect(restored.isSelected, skill.isSelected);
    });

    test('ResumeData complete serialization', () {
      final resumeData = ResumeData(
        personalInfo: PersonalInfo(name: 'John Doe', email: 'john@example.com'),
        workExperiences: [
          WorkExperience(id: '1', company: 'Tech Corp', position: 'Developer'),
        ],
        educations: [
          Education(id: '1', institution: 'University', degree: 'BS'),
        ],
        skills: [
          Skill(id: '1', category: 'Programming', items: 'Java, Python'),
        ],
      );

      final jsonString = resumeData.toJsonString();
      final restored = ResumeData.fromJsonString(jsonString);

      expect(restored.personalInfo.name, resumeData.personalInfo.name);
      expect(restored.workExperiences.length, resumeData.workExperiences.length);
      expect(restored.educations.length, resumeData.educations.length);
      expect(restored.skills.length, resumeData.skills.length);
    });
  });
}
