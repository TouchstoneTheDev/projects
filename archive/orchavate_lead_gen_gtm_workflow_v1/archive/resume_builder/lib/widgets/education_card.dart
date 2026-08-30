import 'package:flutter/material.dart';
import '../models/education.dart';
import 'custom_text_field.dart';

class EducationCard extends StatefulWidget {
  final Education education;
  final Function(Education) onUpdate;
  final VoidCallback onRemove;

  const EducationCard({
    super.key,
    required this.education,
    required this.onUpdate,
    required this.onRemove,
  });

  @override
  State<EducationCard> createState() => _EducationCardState();
}

class _EducationCardState extends State<EducationCard> {
  late TextEditingController _institutionController;
  late TextEditingController _degreeController;
  late TextEditingController _fieldController;
  late TextEditingController _yearController;
  late TextEditingController _gpaController;

  @override
  void initState() {
    super.initState();
    _institutionController = TextEditingController(text: widget.education.institution);
    _degreeController = TextEditingController(text: widget.education.degree);
    _fieldController = TextEditingController(text: widget.education.fieldOfStudy);
    _yearController = TextEditingController(text: widget.education.year);
    _gpaController = TextEditingController(text: widget.education.gpa);

    _institutionController.addListener(_updateEducation);
    _degreeController.addListener(_updateEducation);
    _fieldController.addListener(_updateEducation);
    _yearController.addListener(_updateEducation);
    _gpaController.addListener(_updateEducation);
  }

  void _updateEducation() {
    widget.onUpdate(
      Education(
        id: widget.education.id,
        institution: _institutionController.text,
        degree: _degreeController.text,
        fieldOfStudy: _fieldController.text,
        year: _yearController.text,
        gpa: _gpaController.text,
        isSelected: widget.education.isSelected,
      ),
    );
  }

  @override
  void dispose() {
    _institutionController.dispose();
    _degreeController.dispose();
    _fieldController.dispose();
    _yearController.dispose();
    _gpaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Checkbox(
                  value: widget.education.isSelected,
                  onChanged: (value) {
                    widget.onUpdate(
                      Education(
                        id: widget.education.id,
                        institution: widget.education.institution,
                        degree: widget.education.degree,
                        fieldOfStudy: widget.education.fieldOfStudy,
                        year: widget.education.year,
                        gpa: widget.education.gpa,
                        isSelected: value ?? true,
                      ),
                    );
                  },
                ),
                const Text('Include in resume'),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: widget.onRemove,
                ),
              ],
            ),
            CustomTextField(
              label: 'Institution',
              controller: _institutionController,
            ),
            CustomTextField(
              label: 'Degree',
              hint: 'e.g., Bachelor of Science',
              controller: _degreeController,
            ),
            CustomTextField(
              label: 'Field of Study',
              hint: 'e.g., Computer Science',
              controller: _fieldController,
            ),
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    label: 'Year',
                    hint: 'e.g., 2020',
                    controller: _yearController,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: CustomTextField(
                    label: 'GPA (Optional)',
                    hint: 'e.g., 3.8/4.0',
                    controller: _gpaController,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
