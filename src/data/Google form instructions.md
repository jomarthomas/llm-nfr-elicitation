# Instructions for Writing Non-Functional Requirements Based on ISO/IEC 25010:2023(E)

## Introduction

This document provides guidance on how to write effective non-functional requirements (NFRs) based on the ISO/IEC 25010:2023(E) quality model. The Google Form you'll be filling out contains 34 pages, one for each functional requirement (FR). For each FR, you'll need to consider which quality characteristics apply and write corresponding NFRs.

## General Instructions

1. For each functional requirement, consider which of the 9 quality characteristics and their sub-characteristics might apply.
2. Write clear, measurable NFRs for those that are relevant.
3. Not all characteristics will apply to every functional requirement - only include those that are meaningful.
4. Use the measurement examples provided to help quantify your requirements.

## Quality Characteristics Reference Guide

Below is a reference guide for each quality characteristic and examples of how to write related NFRs.

### 1. Functional Suitability

**Definition:** Capability of a product to provide functions that meet stated and implied needs of intended users when used under specified conditions.

**Sub-characteristics:**
- **1.1 Functional Completeness:** Covers all specified tasks and user objectives
- **1.2 Functional Correctness:** Provides accurate results
- **1.3 Functional Appropriateness:** Facilitates accomplishment of tasks

**Example NFRs:**
- "The system shall implement 100% of the specified functions for user role management."
- "The calculation module shall provide results with at least 99.9% accuracy."
- "The system shall provide the necessary and sufficient steps to complete the user registration process without unnecessary steps."

### 2. Performance Efficiency

**Definition:** Capability of a product to perform functions within specified time and throughput parameters and be efficient in resource use.

**Sub-characteristics:**
- **2.1 Time Behavior:** Response time and throughput rates
- **2.2 Resource Utilization:** Amount of resources used
- **2.3 Capacity:** Maximum limits of a product parameter

**Example NFRs:**
- "The system shall respond to user queries within 0.5 seconds under normal load conditions."
- "The application shall use no more than 200MB of memory during normal operation."
- "The system shall support at least 1,000 concurrent users without degradation in performance."

### 3. Compatibility

**Definition:** Capability of a product to exchange information with other products and perform functions while sharing environment and resources.

**Sub-characteristics:**
- **3.1 Co-existence:** Sharing environment without impact
- **3.2 Interoperability:** Exchange and use information with other products

**Example NFRs:**
- "The system shall operate without conflicts alongside all specified corporate software tools."
- "The system shall support at least 3 standardized data exchange formats (JSON, XML, CSV)."
- "100% of specified external interfaces shall be functional according to published API documentation."

### 4. Interaction Capability

**Definition:** Capability of a product to be interacted with by users to exchange information via the user interface.

**Sub-characteristics:**
- **4.1 Appropriateness Recognizability:** Recognition as appropriate for needs
- **4.2 Learnability:** Learn to use functions within specified time
- **4.3 Operability:** Easy to operate and control
- **4.4 User Error Protection:** Prevent operation errors
- **4.5 User Engagement:** Present functions in an inviting manner
- **4.6 Inclusivity:** Utilized by people of various backgrounds
- **4.7 User Assistance:** Used by people with wide range of capabilities
- **4.8 Self-descriptiveness:** Present appropriate information to users

**Example NFRs:**
- "The system shall provide demonstration features for at least 90% of common tasks."
- "A first-time user shall be able to complete common tasks without prior training."
- "The system shall provide undo capability for at least 95% of actions with significant consequences."
- "The system shall prevent at least 98% of common user input errors through validation."
- "The interface shall be accessible to users with visual, auditory, and motor impairments per WCAG 2.1 AA standards."

### 5. Reliability

**Definition:** Capability of a product to perform specified functions under conditions for a period without interruptions and failures.

**Sub-characteristics:**
- **5.1 Faultlessness:** Perform without fault
- **5.2 Availability:** Operational when required
- **5.3 Fault Tolerance:** Operate despite faults
- **5.4 Recoverability:** Recover data and state after failure

**Example NFRs:**
- "The system shall have a mean time between failures (MTBF) of at least 5,000 operating hours."
- "The system shall maintain 99.9% availability during business hours."
- "The system shall continue core operations when up to 20% of storage components fail."
- "The system shall recover from failure within 5 minutes with no more than 1 minute of data loss."

### 6. Security

**Definition:** Capability to protect information and data, ensuring appropriate access authorization and defense against attacks.

**Sub-characteristics:**
- **6.1 Confidentiality:** Access only by authorized users
- **6.2 Integrity:** Protected from unauthorized modification
- **6.3 Non-repudiation:** Prove actions have taken place
- **6.4 Accountability:** Trace actions to entities
- **6.5 Authenticity:** Prove identity is as claimed
- **6.6 Resistance:** Sustain operations while under attack

**Example NFRs:**
- "100% of confidential data shall be encrypted both at rest and in transit using industry-standard encryption."
- "The system shall implement input validation for 100% of user inputs to prevent SQL injection and buffer overflow attacks."
- "The system shall log 100% of authentication attempts, authorized data access, and system configuration changes."
- "The system shall maintain operation during 95% of common denial of service attack patterns."

### 7. Maintainability

**Definition:** Capability to be modified by intended maintainers with effectiveness and efficiency.

**Sub-characteristics:**
- **7.1 Modularity:** Limit changes from affecting other components
- **7.2 Reusability:** Used in more than one system
- **7.3 Analysability:** Assess impact of changes
- **7.4 Modifiability:** Modified without defects
- **7.5 Testability:** Enable objective testing

**Example NFRs:**
- "No software module shall have dependencies on more than 5 other modules."
- "At least 60% of code components shall be reusable in other parts of the system."
- "The system shall log all operations with sufficient detail to support root cause analysis of failures."
- "95% of modifications shall be implementable without requiring changes to more than 3 modules."
- "100% of modules shall have automated unit tests with at least 80% code coverage."

### 8. Flexibility

**Definition:** Capability to be adapted to changes in requirements, contexts of use, or environment.

**Sub-characteristics:**
- **8.1 Adaptability:** Adapted to different environments
- **8.2 Scalability:** Handle growing or shrinking workloads
- **8.3 Installability:** Installed successfully
- **8.4 Replaceability:** Replace another product

**Example NFRs:**
- "The system shall operate on at least 3 different operating systems without code changes."
- "The system shall scale to handle a 200% increase in workload by adding resources without architectural changes."
- "The installation process shall be completable within 30 minutes by a system administrator."
- "The system shall allow importing 100% of data from the legacy system it replaces."

### 9. Safety

**Definition:** Capability to avoid endangering human life, health, property, or environment.

**Sub-characteristics:**
- **9.1 Operational constraint:** Constrain operation to safe parameters
- **9.2 Risk Identification:** Identify events exposing to risk
- **9.3 Fail Safe:** Automatically enter safe mode on failure
- **9.4 Hazard warning:** Provide warnings of risks
- **9.5 Safe Integration:** Maintain safety during integration

**Example NFRs:**
- "The system shall prevent users from accessing unsafe operations by implementing role-based access controls."
- "The system shall identify and log 100% of security breach attempts and notify administrators."
- "The system shall automatically save and protect user data in case of power failure or crash."
- "The system shall provide clear warnings before executing operations that cannot be undone."
- "The system shall maintain all safety properties when integrated with authorized third-party components."

## Tips for Writing Effective NFRs

1. Be specific and measurable - include quantities, percentages, and time frames.
2. Consider the context of each functional requirement when choosing applicable quality characteristics.
3. Prioritize the most important quality aspects for each functional requirement.
4. Use the measurement examples from the ISO standard to guide how you quantify requirements.
5. Consider dependencies between quality characteristics (e.g., high security may impact performance).

## Example Approach for a Functional Requirement

**Functional Requirement:** "The system shall allow users to upload and process batch files."

**Potential NFRs:**
- **Performance Efficiency:** "The system shall process batch files at a rate of at least 1000 records per minute."
- **Security:** "All uploaded batch files shall be scanned for malware before processing."
- **Reliability:** "The system shall maintain the integrity of all batch data if processing is interrupted."
- **Maintainability:** "The batch processing module shall have automated tests covering at least 90% of code paths."

Remember, not all 9 quality characteristics will apply to every functional requirement. Focus on those most relevant to each FR based on user needs and system context.