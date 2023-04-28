# Wyzwanie

## Uruchamianie aplikacji

Najpierw należy przejść do katalogu aplikacji.

```bash
cd wyzwanie
```

Do uruchomienia aplikacji wymagany jest Docker.
Po jego zainstalowaniu i uruchomieniu należy wykonać dwie komendy:

1. Zbudować obrazy

   ```bash
   docker compose build
   ```

2. Uruchomić je

   > Uwaga! W przypadku posiadania uruchomionego serwisu MongoDB na komputerze, należy go wyłączyć za pomocą komendy **net stop mongodb**, przed uruchomieniem obrazów, inaczej nie uruchomi się obraz MongoDB, przez co aplikacja nie będzie działać.

   ```bash
   docker compose up
   ```

Po tym jak się wykonają, na [http://localhost:3000/](http://localhost:3000/) powinna działać aplikacja.
