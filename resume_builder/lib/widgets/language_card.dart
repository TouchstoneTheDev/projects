import 'package:flutter/material.dart';
import '../models/language.dart';
import 'custom_text_field.dart';

class LanguageCard extends StatefulWidget {
  final Language language;
  final Function(Language) onUpdate;
  final VoidCallback onRemove;

  const LanguageCard({
    super.key,
    required this.language,
    required this.onUpdate,
    required this.onRemove,
  });

  @override
  State<LanguageCard> createState() => _LanguageCardState();
}

class _LanguageCardState extends State<LanguageCard> {
  late TextEditingController _nameController;
  late TextEditingController _proficiencyController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.language.name);
    _proficiencyController = TextEditingController(text: widget.language.proficiency);

    _nameController.addListener(_updateLanguage);
    _proficiencyController.addListener(_updateLanguage);
  }

  void _updateLanguage() {
    widget.onUpdate(
      Language(
        id: widget.language.id,
        name: _nameController.text,
        proficiency: _proficiencyController.text,
        isSelected: widget.language.isSelected,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _proficiencyController.dispose();
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
                  value: widget.language.isSelected,
                  onChanged: (value) {
                    widget.onUpdate(
                      Language(
                        id: widget.language.id,
                        name: widget.language.name,
                        proficiency: widget.language.proficiency,
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
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    label: 'Language',
                    hint: 'e.g., English',
                    controller: _nameController,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: CustomTextField(
                    label: 'Proficiency',
                    hint: 'e.g., Native, Fluent',
                    controller: _proficiencyController,
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
