; Script generated by the HM NIS Edit Script Wizard.
!define VERSION "3.0.20.2"
!define PRISM_VERSION "1.0b3"
!define INSTALL_VERSION "v0.5"
!define FULL_VERSION "${VERSION}-${PRISM_VERSION}-${INSTALL_VERSION}"

; HM NIS Edit Wizard helper defines
!define PRODUCT_NAME "GTDInbox"
!define PRODUCT_VERSION "${VERSION}"
!define PRODUCT_PUBLISHER "Inbox Foundry"
!define PRODUCT_WEB_SITE "http://www.gtdinbox.com"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\prism.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; MUI 1.67 compatible ------
!include "MUI.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "ICONS\gtdinbox.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Welcome page
!insertmacro MUI_PAGE_WELCOME
; License page
!insertmacro MUI_PAGE_LICENSE "GTDInbox-Extension\LICENCE"
; Directory page
!insertmacro MUI_PAGE_DIRECTORY
; Instfiles page
Page custom nsDialogsPage
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "English"

Var Dialog
Var Label1
Var Label2
Var Label3
Var Text
Var Url
!include "nsDialogs.nsh"
Function nsDialogsPage
  StrCpy $Url "https://mail.google.com"
  nsDialogs::Create 1018
  Pop $Dialog
  ${If} $Dialog == error
    Abort
  ${EndIf}
  ${NSD_CreateLabel} 0 0 100% 36u "By default, GTDInbox uses the default http://mail.google.com \
    as your GMail url.  However, below you may edit this URL to specify \
    your Google Apps email, if so desired."
  Pop $Label1
  ${NSD_CreateLabel} 0 20u 100% 8u "(i.e. append /a/DOMAIN.COM if you are using Google Apps)"
  Pop $Label2
  ${NSD_CreateLabel} 0 38u 10% 8u "Mail URL:"
  Pop $Label3
  ${NSD_CreateText} 40u 36u 70% 12u "https://mail.google.com"
  Pop $Text
  ${NSD_OnChange} $Text nsDialogsPageTextChange
  nsDialogs::Show
FunctionEnd

Function nsDialogsPageTextChange
  ${NSD_GetText} $Text $Url
FunctionEnd

; MUI end ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "GTDInboxSetup-${FULL_VERSION}.exe"
InstallDir "$PROGRAMFILES\Prism"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

Section "MainSection" sec01
  SetOutPath "$INSTDIR"
  SetOverwrite try
  File "icons\gtdinbox.ico"

  ;  PRISM application data is recursively copied from yourAppPgmFiles to "$APPDATA\yourApp\Prism"
  SetOutPath "$INSTDIR\"
  SetOverwrite ifnewer
  File /r "prism.${PRISM_VERSION}.en-US.win32\prism\*"

  ;  PRISM webApp data is recursively copied from yourAppAppData to "$APPDATA\WebApps"
  SetOutPath "$INSTDIR\extensions\{bcd47b5a-43be-433f-9051-7ce2cdf94ac0}\"
  File /r /x .git /x .gitignore "GTDInbox-Extension\*"

  ;  PRISM webApp data is recursively copied from yourAppAppData to "$APPDATA\WebApps"
  SetOutPath "$APPDATA\WebApps\GTDInbox@prism.app\"
  File /r "webapps\*"

  ;  Write the webapp.ini file
  ClearErrors
  FileOpen $0 "$APPDATA\WebApps\GTDInbox@prism.app\webapp.ini" w
  IfErrors abort
  FileWrite $0 "[Parameters]$\r$\n"
  FileWrite $0 "id=GTDInbox@prism.app$\r$\n"
  FileWrite $0 "name=GTDInbox$\r$\n"
  FileWrite $0 "uri=$Url$\r$\n"
  FileWrite $0 "icon=webapp$\r$\n"
  FileWrite $0 "status=true$\r$\n"
  FileWrite $0 "location=false$\r$\n"
  FileWrite $0 "sidebar=false$\r$\n"
  FileWrite $0 "navigation=true$\r$\n"
  FileWrite $0 "trayicon=false$\r$\n"
  FileClose $0
  Goto done

  abort:
  Abort

  done:

  ;  set the context for $SMPROGRAMS and other shell folder to the 'current' user
  CreateShortcut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\prism.exe" "-override $\"$APPDATA\WebApps\GTDInbox@prism.app\override.ini$\" -webapp GTDInbox@prism.app" "$INSTDIR\gtdinbox.ico"

SectionEnd

Section -AdditionalIcons
  WriteIniStr "$INSTDIR\${PRODUCT_NAME}.url" "InternetShortcut" "URL" "${PRODUCT_WEB_SITE}"
  CreateDirectory "$SMPROGRAMS\GTDInbox"
  CreateShortCut "$SMPROGRAMS\GTDInbox\Website.lnk" "$INSTDIR\${PRODUCT_NAME}.url"
  CreateShortCut "$SMPROGRAMS\GTDInbox\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKCU "Software\${PRODUCT_NAME}" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\${PRODUCT_NAME}" "ProgramDir" "$SMPROGRAMS\GTDInbox"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\prism.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\prism.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd


Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) was successfully removed from your computer."
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?  NOTE: This includes completely removing Prism." IDYES +2
  Abort
FunctionEnd

Section Uninstall
  ReadRegStr $INSTDIR HKCU "Software\${PRODUCT_NAME}" "InstallDir"
  ReadRegStr $Text HKCU "Software\${PRODUCT_NAME}" "InstallDir"

  RMDir /r "$INSTDIR\*.*"
  RMDir /r "$APPDATA\WebApps\GTDInbox@prism.app\*.*"
  RMDir /r "$Text\*.*"
  
  Delete "$DESKTOP\${PRODUCT_NAME}.lnk"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  DeleteRegKey HKCU "Software\${PRODUCT_NAME}"
  SetAutoClose true
SectionEnd