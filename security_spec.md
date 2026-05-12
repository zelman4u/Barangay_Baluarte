# Security Specification: Barangay Baluarte MIS

## 1. Data Invariants
- A **Case** cannot exist without a complainant and a respondent.
- A **Staff** profile must be approved by the Super Admin to access sensitive modules.
- **Treasury** transactions must be immutable once "Completed".
- **Resident** PII (email, phone) is strictly restricted to BHWs and Admins.

## 2. The Dirty Dozen (Vulnerability Test Cases)
1. **Identity Spoofing**: Resident updates their own profile to `role: 'super_admin'`.
2. **Access Leak**: BHW reading Treasury payroll data.
3. **Orphaned Writes**: Creating a case for a non-existent resident.
4. **PII Exposure**: Regular resident reading other residents' phone numbers.
5. **State Shortcut**: Resident marking their own unpaid transaction as "Paid".
6. **Malicious ID**: Using a 1MB string as a Document ID.
7. **Cross-Department Leak**: Tanod accessing Health vaccination records.
8. **History Erasure**: Staff deleting their own audit log entries.
9. **Unverified Action**: Unverified staff member approving document requests.
10. **Time Spoofing**: Client-provided `created_at` in the future.
11. **Shadow Fields**: Adding a `limit: 9999` field to a transaction request.
12. **Mass Query scraping**: Using `collection('residents')` to dump the entire database.

## 3. Test Runner (Draft Rules Logic)
- `isValidId(id)`: Enforce size <= 128 and alpha-numeric.
- `isAdmin()`: Check `staff/uid/role` == 'super_admin'.
- `isOwner(userId)`: `request.auth.uid == userId`.
- `isStaffMember(dept)`: `staff/uid/department == dept`.

## 4. Relationship Map
- `Cases` -> `Lupon Staff`
- `HealthRecords` -> `BHW Staff`
- `Residents` -> `Admin Staff`
- `Citizens` -> `Own Data only`
