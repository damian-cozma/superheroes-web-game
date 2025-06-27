# The Game of SuperHeroes

https://github.com/user-attachments/assets/1b594ed9-3528-4c9e-badb-abb8c31628eb

## Functionalități principale

### 1. Story Mode
Modul principal de explorare și învățare:
- Navigare prin lumi structurate pe **nivele**.
- Interacțiuni cu **NPC-uri** (supereroi) apăsând `E`.
- **Colectare de monede** pe parcursul explorării.
- Acces la un **test/quiz** la finalul fiecărui nivel.
  - Pentru a avansa este necesar:
    - să se obțină un punctaj minim la quiz;
    - să se colecteze cel puțin **5 monede**.

### 2. Endless Mode
Mod de joc continuu și competitiv:
- Jocul se rulează automat (auto-scroll), utilizatorul controlează doar săriturile (`jump`).
- Dacă jucătorul cade în **void**, pierde.
- Se salvează automat **scorul final** în leaderboard.

### 3. Leaderboard
Clasament public cu cei mai buni jucători:
- Afișare scoruri în ordine **descrescătoare**.
- Vizualizare date:
  - **în panou interactiv (UI)**;
  - **ca flux RSS** pentru integrare externă.

### 4. Admin Mode
Disponibil doar pentru utilizatorii cu **privilegii de admin**:
- **Promovare** altor useri la rolul de admin.
- **Ștergere** useri din sistem.

---

## Arhitectură generală

### Frontend
- Consumă API-uri REST de la server.
- Responsiv și compatibil desktop/mobile.

### Backend
- Server REST API scris în Node.js.
- Utilizează **model-repository-controller** pentru gestionarea logicii de business și accesul la baza de date.
- Suportă:
  - Autentificare/autorizare cu **JWT (JSON Web Token)**.
  - Gestionarea sesiunilor de joc.
  - Stocarea scorurilor și progresului userilor.

---

## Hosting & Infrastructură

### Găzduire
- Hostat pe **Amazon EC2** (Elastic Compute Cloud).
- **Elastic IP** pentru adresă IP statică.

### Stocare fișiere
- **Amazon S3** pentru fișiere statice (ex: imagini, fișiere frontend build).
- **CDN** (Content Delivery Network) activ pentru livrare rapidă a conținutului static.

### Domeniu & Securitate
- Domeniu gestionat prin **DuckDNS**.
- Certificat SSL gratuit emis cu **Let’s Encrypt**.
- Toate conexiunile HTTPS securizate.

---

## Diagrame C4
### Nivelul 1
![C4_LVL1_WEB drawio](https://github.com/user-attachments/assets/75eed852-d65f-49ac-a3ab-5b86edb2844d)

### Nivelul 2
![C4_LVL2_WEB drawio](https://github.com/user-attachments/assets/b6c9fc25-2881-4b81-bc21-33dfeae1e45b)

### Nivelul 3 (Back-End)
![C4_LVL3_BACKEND drawio](https://github.com/user-attachments/assets/1748871e-a261-4b54-976a-2cfa5a4a1a59)

### Nivelul 4 (Front-End)
![C4_LVL3_FRONTEND drawio](https://github.com/user-attachments/assets/2a85271c-dfda-4222-aa77-b332c60032c2)


## Page Speed Test (Bonus)

### Mobil
<img width="1278" alt="image-2" src="https://github.com/user-attachments/assets/9c5c757b-6339-4e15-9734-f6ef656c9dc9" />

### Desktop
<img width="1235" alt="image-3" src="https://github.com/user-attachments/assets/1b578ec7-79ce-4b5b-8502-2a8ea97e6e5e" />

