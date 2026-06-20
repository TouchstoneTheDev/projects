import 'package:flutter/material.dart';
import '../models/work_experience.dart';
import 'custom_text_field.dart';

class WorkExperienceCard extends StatefulWidget {
  final WorkExperience experience;
  final Function(WorkExperience) onUpdate;
  final VoidCallback onRemove;

  const WorkExperienceCard({
    super.key,
    required this.experience,
    required this.onUpdate,
    required this.onRemove,
  });

  @override
  State<WorkExperienceCard> createState() => _WorkExperienceCardState();
}

class _WorkExperienceCardState extends State<WorkExperienceCard> {
  late TextEditingController _companyController;
  late TextEditingController _positionController;
  late TextEditingController _startDateController;
  late TextEditingController _endDateController;
  late TextEditingController _descriptionController;

  @override
  void initState() {
    super.initState();
    _companyController = TextEditingController(text: widget.experience.company);
    _positionController = TextEditingController(text: widget.experience.position);
    _startDateController = TextEditingController(text: widget.experience.startDate);
    _endDateController = TextEditingController(text: widget.experience.endDate);
    _descriptionController = TextEditingController(text: widget.experience.description);

    _companyController.addListener(_updateExperience);
    _positionController.addListener(_updateExperience);
    _startDateController.addListener(_updateExperience);
    _endDateController.addListener(_updateExperience);
    _descriptionController.addListener(_updateExperience);
  }

  void _updateExperience() {
    widget.onUpdate(
      WorkExperience(
        id: widget.experience.id,
        company: _companyController.text,
        position: _positionController.text,
        startDate: _startDateController.text,
        endDate: _endDateController.text,
        description: _descriptionController.text,
        isSelected: widget.experience.isSelected,
      ),
    );
  }

  @override
  void dispose() {
    _companyController.dispose();
    _positionController.dispose();
    _startDateController.dispose();
    _endDateController.dispose();
    _descriptionController.dispose();
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
                  value: widget.experience.isSelected,
                  onChanged: (value) {
                    widget.onUpdate(
                      WorkExperience(
                        id: widget.experience.id,
                        company: widget.experience.company,
                        position: widget.experience.position,
                        startDate: widget.experience.startDate,
                        endDate: widget.experience.endDate,
                        description: widget.experience.description,
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
              label: 'Company',
              controller: _companyController,
            ),
            CustomTextField(
              label: 'Position',
              controller: _positionController,
            ),
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    label: 'Start Date',
                    hint: 'MM/YYYY',
                    controller: _startDateController,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: CustomTextField(
                    label: 'End Date',
                    hint: 'MM/YYYY or Present',
                    controller: _endDateController,
                  ),
                ),
              ],
            ),
            CustomTextField(
              label: 'Description',
              hint: 'Describe your responsibilities and achievements',
              controller: _descriptionController,
              maxLines: 4,
            ),
          ],
        ),
      ),
    );
  }
}
