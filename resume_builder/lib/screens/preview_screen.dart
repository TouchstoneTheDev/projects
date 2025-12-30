import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:printing/printing.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import '../services/resume_provider.dart';

class PreviewScreen extends StatelessWidget {
  const PreviewScreen({super.key});

  Future<pw.Document> _generatePdf(ResumeProvider provider) async {
    final pdf = pw.Document();
    
    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (context) {
          final widgets = <pw.Widget>[];

          // Personal Information
          if (provider.personalInfo.isSelected) {
            if (provider.personalInfo.name.isNotEmpty) {
              widgets.add(
                pw.Text(
                  provider.personalInfo.name,
                  style: pw.TextStyle(
                    fontSize: 28,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              );
              widgets.add(pw.SizedBox(height: 8));
            }

            final contactInfo = <String>[];
            if (provider.personalInfo.email.isNotEmpty) {
              contactInfo.add(provider.personalInfo.email);
            }
            if (provider.personalInfo.phone.isNotEmpty) {
              contactInfo.add(provider.personalInfo.phone);
            }
            if (provider.personalInfo.address.isNotEmpty) {
              contactInfo.add(provider.personalInfo.address);
            }

            if (contactInfo.isNotEmpty) {
              widgets.add(
                pw.Text(
                  contactInfo.join(' • '),
                  style: const pw.TextStyle(fontSize: 10),
                ),
              );
              widgets.add(pw.SizedBox(height: 4));
            }

            if (provider.personalInfo.linkedin.isNotEmpty) {
              widgets.add(
                pw.Text(
                  'LinkedIn: ${provider.personalInfo.linkedin}',
                  style: const pw.TextStyle(fontSize: 10),
                ),
              );
            }

            if (provider.personalInfo.website.isNotEmpty) {
              widgets.add(
                pw.Text(
                  'Website: ${provider.personalInfo.website}',
                  style: const pw.TextStyle(fontSize: 10),
                ),
              );
            }

            if (provider.personalInfo.summary.isNotEmpty) {
              widgets.add(pw.SizedBox(height: 12));
              widgets.add(
                pw.Text(
                  provider.personalInfo.summary,
                  style: const pw.TextStyle(fontSize: 11),
                  textAlign: pw.TextAlign.justify,
                ),
              );
            }

            widgets.add(pw.SizedBox(height: 20));
          }

          // Work Experience
          final selectedExperiences =
              provider.workExperiences.where((e) => e.isSelected).toList();
          if (selectedExperiences.isNotEmpty) {
            widgets.add(
              pw.Text(
                'WORK EXPERIENCE',
                style: pw.TextStyle(
                  fontSize: 16,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.blue900,
                ),
              ),
            );
            widgets.add(pw.Divider(thickness: 2));
            widgets.add(pw.SizedBox(height: 8));

            for (var exp in selectedExperiences) {
              if (exp.position.isNotEmpty || exp.company.isNotEmpty) {
                widgets.add(
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Expanded(
                        child: pw.Text(
                          exp.position,
                          style: pw.TextStyle(
                            fontSize: 12,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ),
                      pw.Text(
                        '${exp.startDate}${exp.endDate.isNotEmpty ? ' - ${exp.endDate}' : ''}',
                        style: const pw.TextStyle(fontSize: 10),
                      ),
                    ],
                  ),
                );
              }

              if (exp.company.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    exp.company,
                    style: pw.TextStyle(
                      fontSize: 11,
                      fontStyle: pw.FontStyle.italic,
                    ),
                  ),
                );
              }

              if (exp.description.isNotEmpty) {
                widgets.add(pw.SizedBox(height: 4));
                widgets.add(
                  pw.Text(
                    exp.description,
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                );
              }

              widgets.add(pw.SizedBox(height: 12));
            }
          }

          // Education
          final selectedEducations =
              provider.educations.where((e) => e.isSelected).toList();
          if (selectedEducations.isNotEmpty) {
            widgets.add(
              pw.Text(
                'EDUCATION',
                style: pw.TextStyle(
                  fontSize: 16,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.blue900,
                ),
              ),
            );
            widgets.add(pw.Divider(thickness: 2));
            widgets.add(pw.SizedBox(height: 8));

            for (var edu in selectedEducations) {
              if (edu.degree.isNotEmpty || edu.institution.isNotEmpty) {
                widgets.add(
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Expanded(
                        child: pw.Text(
                          '${edu.degree}${edu.fieldOfStudy.isNotEmpty ? ' in ${edu.fieldOfStudy}' : ''}',
                          style: pw.TextStyle(
                            fontSize: 12,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ),
                      pw.Text(
                        edu.year,
                        style: const pw.TextStyle(fontSize: 10),
                      ),
                    ],
                  ),
                );
              }

              if (edu.institution.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    edu.institution,
                    style: pw.TextStyle(
                      fontSize: 11,
                      fontStyle: pw.FontStyle.italic,
                    ),
                  ),
                );
              }

              if (edu.gpa.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    'GPA: ${edu.gpa}',
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                );
              }

              widgets.add(pw.SizedBox(height: 12));
            }
          }

          // Skills
          final selectedSkills =
              provider.skills.where((s) => s.isSelected).toList();
          if (selectedSkills.isNotEmpty) {
            widgets.add(
              pw.Text(
                'SKILLS',
                style: pw.TextStyle(
                  fontSize: 16,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.blue900,
                ),
              ),
            );
            widgets.add(pw.Divider(thickness: 2));
            widgets.add(pw.SizedBox(height: 8));

            for (var skill in selectedSkills) {
              if (skill.category.isNotEmpty || skill.items.isNotEmpty) {
                widgets.add(
                  pw.Row(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.SizedBox(
                        width: 120,
                        child: pw.Text(
                          '${skill.category}:',
                          style: pw.TextStyle(
                            fontSize: 11,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ),
                      pw.Expanded(
                        child: pw.Text(
                          skill.items,
                          style: const pw.TextStyle(fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                );
                widgets.add(pw.SizedBox(height: 6));
              }
            }

            widgets.add(pw.SizedBox(height: 6));
          }

          // Projects
          final selectedProjects =
              provider.projects.where((p) => p.isSelected).toList();
          if (selectedProjects.isNotEmpty) {
            widgets.add(
              pw.Text(
                'PROJECTS',
                style: pw.TextStyle(
                  fontSize: 16,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.blue900,
                ),
              ),
            );
            widgets.add(pw.Divider(thickness: 2));
            widgets.add(pw.SizedBox(height: 8));

            for (var project in selectedProjects) {
              if (project.name.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    project.name,
                    style: pw.TextStyle(
                      fontSize: 12,
                      fontWeight: pw.FontWeight.bold,
                    ),
                  ),
                );
              }

              if (project.technologies.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    'Technologies: ${project.technologies}',
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                );
              }

              if (project.description.isNotEmpty) {
                widgets.add(pw.SizedBox(height: 4));
                widgets.add(
                  pw.Text(
                    project.description,
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                );
              }

              if (project.url.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    'URL: ${project.url}',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                );
              }

              widgets.add(pw.SizedBox(height: 12));
            }
          }

          // Certifications
          final selectedCertifications =
              provider.certifications.where((c) => c.isSelected).toList();
          if (selectedCertifications.isNotEmpty) {
            widgets.add(
              pw.Text(
                'CERTIFICATIONS',
                style: pw.TextStyle(
                  fontSize: 16,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.blue900,
                ),
              ),
            );
            widgets.add(pw.Divider(thickness: 2));
            widgets.add(pw.SizedBox(height: 8));

            for (var cert in selectedCertifications) {
              if (cert.name.isNotEmpty) {
                widgets.add(
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Expanded(
                        child: pw.Text(
                          cert.name,
                          style: pw.TextStyle(
                            fontSize: 11,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ),
                      pw.Text(
                        cert.date,
                        style: const pw.TextStyle(fontSize: 10),
                      ),
                    ],
                  ),
                );
              }

              if (cert.issuer.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    cert.issuer,
                    style: const pw.TextStyle(fontSize: 10),
                  ),
                );
              }

              if (cert.credentialId.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    'Credential ID: ${cert.credentialId}',
                    style: const pw.TextStyle(fontSize: 9),
                  ),
                );
              }

              widgets.add(pw.SizedBox(height: 10));
            }
          }

          // Languages
          final selectedLanguages =
              provider.languages.where((l) => l.isSelected).toList();
          if (selectedLanguages.isNotEmpty) {
            widgets.add(
              pw.Text(
                'LANGUAGES',
                style: pw.TextStyle(
                  fontSize: 16,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.blue900,
                ),
              ),
            );
            widgets.add(pw.Divider(thickness: 2));
            widgets.add(pw.SizedBox(height: 8));

            for (var lang in selectedLanguages) {
              if (lang.name.isNotEmpty) {
                widgets.add(
                  pw.Text(
                    '${lang.name}${lang.proficiency.isNotEmpty ? ' - ${lang.proficiency}' : ''}',
                    style: const pw.TextStyle(fontSize: 11),
                  ),
                );
                widgets.add(pw.SizedBox(height: 6));
              }
            }
          }

          return widgets;
        },
      ),
    );

    return pdf;
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<ResumeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Resume Preview'),
        centerTitle: true,
      ),
      body: PdfPreview(
        build: (format) async {
          final pdf = await _generatePdf(provider);
          return pdf.save();
        },
        canChangePageFormat: false,
        canChangeOrientation: false,
        canDebug: false,
        pdfFileName: '${provider.personalInfo.name.replaceAll(' ', '_')}_Resume.pdf',
      ),
    );
  }
}
