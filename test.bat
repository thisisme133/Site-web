@echo off
setlocal enabledelayedexpansion

:: Dossier source
set "SRC=C:\Users\Chris\Desktop\Site-web-codex-fix-reservation-tracking-issue-w8b1em\app"

:: Dossier final (dans SRC)
set "DST=%SRC%\final"

if not exist "%DST%" mkdir "%DST%"

:: Version normalisée de DST avec \ à la fin pour le test
set "DSTNORM=%DST%\"

echo Traitement en cours...

for /r "%SRC%" %%F in (*) do (
    set "full=%%~fF"

    :: Vérifier si le fichier est dans le dossier final ou un sous-dossier de final
    echo !full! | find /i "!DSTNORM!" >nul
    if errorlevel 1 (
        :: Pas dans "final" → on traite

        set "base=%%~nF"
        set "ext=%%~xF"

        :: Appeler la sous-routine pour obtenir un nom unique
        call :MakeUniqueName "base" "ext" "name"

        echo Copie : %%F → %DST%\!name!
        copy "%%F" "%DST%\!name!" >nul
    )
)

echo.
echo Terminé !
pause
goto :eof


:: ----------------------------------------------------
:: Sous-routine :MakeUniqueName
:: %1 = nom de variable contenant la base (sans extension)
:: %2 = nom de variable contenant l’extension
:: %3 = nom de variable de sortie (nom de fichier final)
:: ----------------------------------------------------
:MakeUniqueName
setlocal enabledelayedexpansion

set "base=!%~1!"
set "ext=!%~2!"

set "name=!base!!ext!"
set /a idx=1

:loop_unique
if exist "%DST%\!name!" (
    set "name=!base!_!idx!!ext!"
    set /a idx+=1
    goto :loop_unique
)

endlocal & set "%~3=%name%"
goto :eof
