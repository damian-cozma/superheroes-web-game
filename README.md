# The Game of SuperHeroes

https://github.com/user-attachments/assets/1b594ed9-3528-4c9e-badb-abb8c31628eb

## Main Features

### 1. Story Mode
The main exploration and learning mode:
- Navigation through worlds structured by levels.
- Interactions with NPCs (superheroes) by pressing E.
- Coin collection during exploration.
- Access to a test/quiz at the end of each level.
- To advance, the player must:
  - achieve a minimum score in the quiz;
  - collect at least 5 coins.

### 2. Endless Mode
Continuous and competitive gameplay mode:
- The game runs automatically (auto-scroll), the player only controls jumping (jump).
- If the player falls into the void, they lose.
- The final score is automatically saved in the leaderboard.

### 3. Leaderboard
Public ranking of top players:
- Scores displayed in descending order.
- Data visualization:
  - in an interactive UI panel;
  - as an RSS feed for external integration.

### 4. Admin Mode
Available only for users with admin privileges:
- Promoting other users to admin role.
- Deleting users from the system.

---

## General Architecture

### Frontend
- Consumes REST APIs from the server.
- Responsive and compatible with desktop/mobile.

### Backend
- REST API server written in Node.js.
- Uses model-repository-controller pattern for business logic and database access.
Supports:
- Authentication/authorization using JWT (JSON Web Token);
- Game session management;
- Storage of user scores and progress.

---

## Hosting & Infrastructură

### Găzduire
- Hosted on Amazon EC2 (Elastic Compute Cloud).
- Elastic IP for a static IP address.

### File Storage
- Amazon S3 for static files (e.g., images, frontend build files).
- CDN (Content Delivery Network) enabled for fast content delivery.

### Domain & Security
- Domain managed via DuckDNS.
- Free SSL certificate issued with Let’s Encrypt.
- All connections are secured via HTTPS.

---

## C4 Diagrams
### Level 1
![C4_LVL1_WEB drawio](https://github.com/user-attachments/assets/763a7609-c7a7-4e00-bd4c-eb8744b5aa03)

### Level 2
![C4_LVL2_WEB drawio](https://github.com/user-attachments/assets/c3002d93-0828-467f-ac17-455f8bfffbc2)

### Level 3.1 (Back-End)
![C4_LVL3_BACKEND drawio](https://github.com/user-attachments/assets/ff9caa83-2497-45cf-ab96-955268b97347)

### Level 3.2 (Front-End)
![C4_LVL3_FRONTEND drawio](https://github.com/user-attachments/assets/1c3ca781-11ac-4edf-b648-6b0d2d54d0fd)


## Page Speed Test (Bonus)

### Mobil
<img width="1278" alt="image-2" src="https://github.com/user-attachments/assets/9c5c757b-6339-4e15-9734-f6ef656c9dc9" />

### Desktop
<img width="1235" alt="image-3" src="https://github.com/user-attachments/assets/1b578ec7-79ce-4b5b-8502-2a8ea97e6e5e" />

