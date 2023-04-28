# Wyzwanie

## Uruchamianie aplikacji

Najpierw należy przejść do katalogu aplikacji.

```bash
cd wyzwanie
```

### Sposób 1

Jeśli **nie ma zablokowanych portów od zewnętrznych baz danych** (a w sali 111 są, **w takim przypadku proszę skorzystać z sposobu nr 2**), to można w `/backend/.env` odkomentować pierwszy `DATABASE_URL` i skomentować drugie. Powinno to wyglądać w ten sposób:

```txt
PORT=8000

# This was inserted by `prisma init`:
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings


# Atlas connection to database
DATABASE_URL="mongodb+srv://Mejsiej:sometimesitdobelikethat1@cluster0.fwxaxgl.mongodb.net/wyzwanie?retryWrites=true&w=majority"

# Docker connection string
# DATABASE_URL="mongodb://root:prisma@127.0.0.1:27017/wyzwanie?retryWrites=true&w=majority&authSource=admin"

# JWT secret
JWT_SECRET=d9abe5471e2347b367ac1e4927ce7ce44c5e738d54413281cc96b93c7372aadb857eed8d7c6db242147be6f0f12b03642fde6ad5a018ce1afb349cd2b8289248
```

Potem, należy uruchomić backend.

```bash
cd backend
npm i
npm run build
npm run start
```

Na koniec, trzeba uruchomić frontend

```bash
cd frontend
npm i
npm run dev
```

Po aktywacji frontend'u, na [http://localhost:3000/](http://localhost:3000/) powinna działać aplikacja.

### Sposób 2

Jeśli porty od zewnętrznych baz danych są zablokowane, do uruchomienia aplikacji wymagany jest [Docker](https://www.docker.com/).
Po jego zainstalowaniu i uruchomieniu należy wykonać dwie komendy:

1. Zbudować obrazy (w zależności od prędkości łącza internetowego może to zająć do 3-4 minut)

   ```bash
   docker compose build
   ```

2. Uruchomić je

   > Uwaga! W przypadku posiadania uruchomionego serwisu MongoDB na komputerze (np. jeśli ma się MongoDB Compass, to serwis Mongo będzie aktywny), należy go wyłączyć przed uruchomieniem obrazów za pomocą komendy **net stop mongodb**, inaczej nie uruchomi się obraz MongoDB, przez co aplikacja nie będzie działać.

   ```bash
   docker compose up
   ```

Po tym jak się wykonają, na [http://localhost:3000/](http://localhost:3000/) powinna działać aplikacja.
