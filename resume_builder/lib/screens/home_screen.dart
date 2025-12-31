import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/resume_provider.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/section_header.dart';
import '../widgets/work_experience_card.dart';
import '../widgets/education_card.dart';
import '../widgets/skill_card.dart';
import '../widgets/project_card.dart';
import '../widgets/certification_card.dart';
import '../widgets/language_card.dart';
import 'preview_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _scrollController = ScrollController();
  
  // Personal info controllers
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  late TextEditingController _linkedinController;
  late TextEditingController _websiteController;
  late TextEditingController _summaryController;

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<ResumeProvider>(context, listen: false);
    provider.loadData();
    
    _nameController = TextEditingController(text: provider.personalInfo.name);
    _emailController = TextEditingController(text: provider.personalInfo.email);
    _phoneController = TextEditingController(text: provider.personalInfo.phone);
    _addressController = TextEditingController(text: provider.personalInfo.address);
    _linkedinController = TextEditingController(text: provider.personalInfo.linkedin);
    _websiteController = TextEditingController(text: provider.personalInfo.website);
    _summaryController = TextEditingController(text: provider.personalInfo.summary);

    _nameController.addListener(_updatePersonalInfo);
    _emailController.addListener(_updatePersonalInfo);
    _phoneController.addListener(_updatePersonalInfo);
    _addressController.addListener(_updatePersonalInfo);
    _linkedinController.addListener(_updatePersonalInfo);
    _websiteController.addListener(_updatePersonalInfo);
    _summaryController.addListener(_updatePersonalInfo);
  }

  void _updatePersonalInfo() {
    final provider = Provider.of<ResumeProvider>(context, listen: false);
    provider.personalInfo.name = _nameController.text;
    provider.personalInfo.email = _emailController.text;
    provider.personalInfo.phone = _phoneController.text;
    provider.personalInfo.address = _addressController.text;
    provider.personalInfo.linkedin = _linkedinController.text;
    provider.personalInfo.website = _websiteController.text;
    provider.personalInfo.summary = _summaryController.text;
    provider.updatePersonalInfo(provider.personalInfo);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _linkedinController.dispose();
    _websiteController.dispose();
    _summaryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resume Builder'),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const PreviewScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.preview),
              label: const Text('Preview'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Theme.of(context).primaryColor,
              ),
            ),
          ),
        ],
      ),
      body: Consumer<ResumeProvider>(
        builder: (context, provider, child) {
          return SingleChildScrollView(
            controller: _scrollController,
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Personal Information Section
                SectionHeader(
                  title: 'Personal Information',
                  icon: Icons.person,
                ),
                Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Checkbox(
                              value: provider.personalInfo.isSelected,
                              onChanged: (value) {
                                provider.personalInfo.isSelected = value ?? true;
                                provider.updatePersonalInfo(provider.personalInfo);
                              },
                            ),
                            const Text('Include personal information'),
                          ],
                        ),
                        CustomTextField(
                          label: 'Full Name',
                          controller: _nameController,
                        ),
                        CustomTextField(
                          label: 'Email',
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                        ),
                        CustomTextField(
                          label: 'Phone',
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                        ),
                        CustomTextField(
                          label: 'Address',
                          controller: _addressController,
                        ),
                        CustomTextField(
                          label: 'LinkedIn',
                          hint: 'linkedin.com/in/yourprofile',
                          controller: _linkedinController,
                          keyboardType: TextInputType.url,
                        ),
                        CustomTextField(
                          label: 'Website',
                          hint: 'www.yourwebsite.com',
                          controller: _websiteController,
                          keyboardType: TextInputType.url,
                        ),
                        CustomTextField(
                          label: 'Professional Summary',
                          hint: 'Brief summary about yourself',
                          controller: _summaryController,
                          maxLines: 4,
                        ),
                      ],
                    ),
                  ),
                ),

                // Work Experience Section
                SectionHeader(
                  title: 'Work Experience',
                  icon: Icons.work,
                  onAddPressed: provider.addWorkExperience,
                ),
                if (provider.workExperiences.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No work experience added yet.\nClick "Add" to create one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...provider.workExperiences.asMap().entries.map(
                        (entry) => WorkExperienceCard(
                          experience: entry.value,
                          onUpdate: (updated) =>
                              provider.updateWorkExperience(entry.key, updated),
                          onRemove: () =>
                              provider.removeWorkExperience(entry.key),
                        ),
                      ),

                // Education Section
                SectionHeader(
                  title: 'Education',
                  icon: Icons.school,
                  onAddPressed: provider.addEducation,
                ),
                if (provider.educations.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No education added yet.\nClick "Add" to create one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...provider.educations.asMap().entries.map(
                        (entry) => EducationCard(
                          education: entry.value,
                          onUpdate: (updated) =>
                              provider.updateEducation(entry.key, updated),
                          onRemove: () => provider.removeEducation(entry.key),
                        ),
                      ),

                // Skills Section
                SectionHeader(
                  title: 'Skills',
                  icon: Icons.stars,
                  onAddPressed: provider.addSkill,
                ),
                if (provider.skills.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No skills added yet.\nClick "Add" to create one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...provider.skills.asMap().entries.map(
                        (entry) => SkillCard(
                          skill: entry.value,
                          onUpdate: (updated) =>
                              provider.updateSkill(entry.key, updated),
                          onRemove: () => provider.removeSkill(entry.key),
                        ),
                      ),

                // Projects Section
                SectionHeader(
                  title: 'Projects',
                  icon: Icons.folder,
                  onAddPressed: provider.addProject,
                ),
                if (provider.projects.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No projects added yet.\nClick "Add" to create one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...provider.projects.asMap().entries.map(
                        (entry) => ProjectCard(
                          project: entry.value,
                          onUpdate: (updated) =>
                              provider.updateProject(entry.key, updated),
                          onRemove: () => provider.removeProject(entry.key),
                        ),
                      ),

                // Certifications Section
                SectionHeader(
                  title: 'Certifications',
                  icon: Icons.card_membership,
                  onAddPressed: provider.addCertification,
                ),
                if (provider.certifications.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No certifications added yet.\nClick "Add" to create one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...provider.certifications.asMap().entries.map(
                        (entry) => CertificationCard(
                          certification: entry.value,
                          onUpdate: (updated) =>
                              provider.updateCertification(entry.key, updated),
                          onRemove: () =>
                              provider.removeCertification(entry.key),
                        ),
                      ),

                // Languages Section
                SectionHeader(
                  title: 'Languages',
                  icon: Icons.language,
                  onAddPressed: provider.addLanguage,
                ),
                if (provider.languages.isEmpty)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No languages added yet.\nClick "Add" to create one.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                else
                  ...provider.languages.asMap().entries.map(
                        (entry) => LanguageCard(
                          language: entry.value,
                          onUpdate: (updated) =>
                              provider.updateLanguage(entry.key, updated),
                          onRemove: () => provider.removeLanguage(entry.key),
                        ),
                      ),

                const SizedBox(height: 80),
              ],
            ),
          );
        },
      ),
    );
  }
}
