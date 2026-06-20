import 'package:flutter/material.dart';
import '../models/certification.dart';
import 'custom_text_field.dart';

class CertificationCard extends StatefulWidget {
  final Certification certification;
  final Function(Certification) onUpdate;
  final VoidCallback onRemove;

  const CertificationCard({
    super.key,
    required this.certification,
    required this.onUpdate,
    required this.onRemove,
  });

  @override
  State<CertificationCard> createState() => _CertificationCardState();
}

class _CertificationCardState extends State<CertificationCard> {
  late TextEditingController _nameController;
  late TextEditingController _issuerController;
  late TextEditingController _dateController;
  late TextEditingController _credentialController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.certification.name);
    _issuerController = TextEditingController(text: widget.certification.issuer);
    _dateController = TextEditingController(text: widget.certification.date);
    _credentialController = TextEditingController(text: widget.certification.credentialId);

    _nameController.addListener(_updateCertification);
    _issuerController.addListener(_updateCertification);
    _dateController.addListener(_updateCertification);
    _credentialController.addListener(_updateCertification);
  }

  void _updateCertification() {
    widget.onUpdate(
      Certification(
        id: widget.certification.id,
        name: _nameController.text,
        issuer: _issuerController.text,
        date: _dateController.text,
        credentialId: _credentialController.text,
        isSelected: widget.certification.isSelected,
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _issuerController.dispose();
    _dateController.dispose();
    _credentialController.dispose();
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
                  value: widget.certification.isSelected,
                  onChanged: (value) {
                    widget.onUpdate(
                      Certification(
                        id: widget.certification.id,
                        name: widget.certification.name,
                        issuer: widget.certification.issuer,
                        date: widget.certification.date,
                        credentialId: widget.certification.credentialId,
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
              label: 'Certification Name',
              controller: _nameController,
            ),
            CustomTextField(
              label: 'Issuing Organization',
              controller: _issuerController,
            ),
            Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    label: 'Date',
                    hint: 'MM/YYYY',
                    controller: _dateController,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: CustomTextField(
                    label: 'Credential ID (Optional)',
                    controller: _credentialController,
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
