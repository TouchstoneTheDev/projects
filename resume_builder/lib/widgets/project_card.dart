import 'package:flutter/material.dart';
import '../models/project.dart';
import 'custom_text_field.dart';

class ProjectCard extends StatefulWidget {
  final Project project;
  final Function(Project) onUpdate;
  final VoidCallback onRemove;

  const ProjectCard({
    super.key,
    required this.project,
    required this.onUpdate,
    required this.onRemove,
  });

  @override
  State<ProjectCard> createState() => _ProjectCardState();
}

class _ProjectCardState extends State<ProjectCard> {
  late TextEditingController _nameController;
  late TextEditingController _descriptionController;
  late TextEditingController _technologiesController;
  late TextEditingController _urlController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.project.name);
    _descriptionController = TextEditingController(text: widget.project.description);
    _technologiesController = TextEditingController(text: widget.project.technologies);
    _urlController = TextEditingController(text: widget.project.url);

    _nameController.addListener(_updateProject);
    _descriptionController.addListener(_updateProject);
    _technologiesController.addListener(_updateProject);
    _urlController.addListener(_updateProject);
  }

  void _updateProject() {
    widget.onUpdate(
      Project(
        id: widget.project.id,
        name: _nameController.text,
        description: _descriptionController.text,
        technologies: _technologiesController.text,
        url: _urlController.text,
        isSelected: widget.project.isSelected,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _technologiesController.dispose();
    _urlController.dispose();
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
                  value: widget.project.isSelected,
                  onChanged: (value) {
                    widget.onUpdate(
                      Project(
                        id: widget.project.id,
                        name: widget.project.name,
                        description: widget.project.description,
                        technologies: widget.project.technologies,
                        url: widget.project.url,
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
              label: 'Project Name',
              controller: _nameController,
            ),
            CustomTextField(
              label: 'Description',
              hint: 'Describe the project',
              controller: _descriptionController,
              maxLines: 3,
            ),
            CustomTextField(
              label: 'Technologies',
              hint: 'e.g., Flutter, Firebase, REST API',
              controller: _technologiesController,
            ),
            CustomTextField(
              label: 'URL (Optional)',
              hint: 'https://github.com/username/project',
              controller: _urlController,
              keyboardType: TextInputType.url,
            ),
          ],
        ),
      ),
    );
  }
}
