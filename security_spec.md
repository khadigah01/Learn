# Security Specification for Learn Academy Firestore

## Data Invariants
1. Users can read public documents or authenticated user data.
2. Meetings can be read by authenticated users, or by anyone if marked `isPublic` or accessed at `/meeting/public`.
3. Notifications belong to specific user IDs or are created by teachers/admins when scheduling meetings.
4. Career Applications can be created by any user/applicant and managed by admins/coordinators.
5. Groups can be created and updated by teachers, coordinators, and admins, and read by authenticated students.

## The Dirty Dozen Payloads Test Matrix
1. Unauthenticated write to `/users/{userId}` -> DENIED
2. Write to user profile with invalid role -> DENIED
3. Spoofed user ID in `/users/{userId}` -> DENIED
4. Creation of meeting with invalid status -> DENIED
5. Unauthenticated read of private user data -> DENIED
6. Non-admin altering group memberships without permissions -> DENIED
7. Oversized string payload in notification -> DENIED
8. Deleting meetings as non-assigned non-admin -> DENIED
9. Injecting script tag or invalid character sequence into ID -> DENIED
10. Impersonating teacher when scheduling meeting -> DENIED
11. Updating career application status as anonymous user -> DENIED
12. Updating meeting status with random invalid state -> DENIED
