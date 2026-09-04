# Disclaimer

**Last updated:** 4 September 2026

## Not a certified medical device

Ctg-Early-Warning-System ("the Software") is an open-source, decision-support and educational
tool for interpreting cardiotocography (CTG) data against published guideline logic (FIGO, NICE,
ACOG). It is provided **as a software toolkit**, not as a finished clinical product.

The Software is **not** a certified, approved, or cleared medical device in any jurisdiction
unless a specific deploying organization has independently:

- Validated the Software's classification logic against its own clinical protocols and patient
  population;
- Obtained any regulatory clearance, certification, or approval required in its jurisdiction
  (e.g. FDA clearance in the United States, UKCA/CE marking in the UK/EU, or the equivalent local
  authority); and
- Assumed responsibility for that validated, deployed instance as the legal manufacturer or
  deploying entity.

Absent that, nothing in this repository, its documentation, or its output should be treated as a
regulatory-cleared diagnostic or monitoring device.

## No substitute for clinical judgement

Guideline-based classification (FIGO / NICE / ACOG category, or any output of this Software) is a
**decision-support input only**. It does not diagnose, does not predict outcomes, and does not
replace the assessment of a qualified clinician who has the full clinical picture — maternal
history, labor progress, prior traces, and factors no CTG classifier can see.

Clinical staff using any deployment of this Software remain fully responsible for patient care
decisions. The Software should never be the sole basis for a clinical decision.

## No warranty

The Software is provided **"as is"**, without warranty of any kind, express or implied, including
but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, or
non-infringement. See the [LICENSE](./LICENSE) (Apache License 2.0) for the full warranty
disclaimer and limitation of liability that governs use of this code.

The maintainers and contributors of this project:

- Make no representation that the classification logic is complete, error-free, or fit for use in
  a live clinical setting without independent validation;
- Are not liable for any harm, loss, or clinical outcome arising from use, misuse, or
  misinterpretation of the Software or its output;
- Do not provide medical advice through this repository, its issues, discussions, or
  documentation.

## Guideline fidelity

Classification strategies (`packages/core/src/strategies/`) are implementations of publicly
published guideline logic (FIGO, NICE, ACOG). Implementation is a best-effort translation of that
published guidance into code, reviewed per the process in
[CONTRIBUTING.md](./CONTRIBUTING.md#changing-the-classification-engine). It is not endorsed,
certified, or reviewed by FIGO, NICE, ACOG, or any other guideline body, and guideline updates may
not be reflected immediately. Deploying organizations are responsible for confirming that the
version of each strategy they run matches the guideline version they intend to follow (see
`ARCHITECTURE.md § Versioning of rules`).

## Data and privacy

This repository does not provide, and is not itself, a HIPAA-, GDPR-, or otherwise
compliance-certified hosting environment. Any organization deploying this Software with real
patient data is solely responsible for:

- Implementing the technical and organizational safeguards required by applicable law
  (encryption, access control, audit logging, data residency, retention/deletion policy, etc.);
- Executing any required data processing agreements or equivalent; and
- Its own regulatory and institutional review/approval process before processing real patient
  data.

Do not commit real patient data, PHI, or PII to this repository, its issues, or its discussions.

## Questions

For questions about a specific deployment's regulatory status or clinical validation, contact
that deploying organization directly — the maintainers of this open-source project have no
visibility into, and no responsibility for, third-party deployments.

For questions about the project itself, see [Contact](./README.md#contact) in the README.
