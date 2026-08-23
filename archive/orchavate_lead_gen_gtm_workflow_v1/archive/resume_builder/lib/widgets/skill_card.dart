import 'package:flutter/material.dart';
import '../models/skill.dart';
import 'custom_text_field.dart';

class SkillCard extends StatefulWidget {
  final Skill skill;
  final Function(Skill) onUpdate;
  final VoidCallback onRemove;

  const SkillCard({
    super.key,
    required this.skill,
    required this.onUpdate,
    required this.onRemove,
  });

  @override
  State<SkillCard> createState() => _SkillCardState();
}

class _SkillCardState extends State<SkillCard> {
  late TextEditingController _categoryController;
  late TextEditingController _itemsController;

  @override
  void initState() {
    super.initState();
    _categoryController = TextEditingController(text: widget.skill.category);
    _itemsController = TextEditingController(text: widget.skill.items);

    _categoryController.addListener(_updateSkill);
    _itemsController.addListener(_updateSkill);
  }

  void _updateSkill() {
    widget.onUpdate(
      Skill(
        id: widget.skill.id,
        category: _categoryController.text,
        items: _itemsController.text,
        isSelected: widget.skill.isSelected,
      ),
    );
  }

  @override
  void dispose() {
    _categoryController.dispose();
    _itemsController.dispose();
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
                  value: widget.skill.isSelected,
                  onChanged: (value) {
                    widget.onUpdate(
                      Skill(
                        id: widget.skill.id,
                        category: widget.skill.category,
                        items: widget.skill.items,
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
              label: 'Category',
              hint: 'e.g., Programming Languages',
              controller: _categoryController,
            ),
            CustomTextField(
              label: 'Skills',
              hint: 'e.g., Java, Python, JavaScript',
              controller: _itemsController,
              maxLines: 2,
            ),
          ],
        ),
      ),
    );
  }
}
