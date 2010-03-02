;NSIS Modern User Interface 

;-------------------------------- 
; Start 

Var Dialog
Var Label1
Var Label2
Var Label3
Var Text
Var Url

!include "nsDialogs.nsh"
!include "MUI2.nsh" 
!include LogicLib.nsh

!define MUI_PRODUCT "GTDInbox" 
!define GTD_VERSION "3.0.17" 
!define PRISM_VERSION "1.0b3"
!define INSTALL_VERSION "0.2"
!define MUI_VERSION "${GTD_VERSION}"

!define MUI_BRANDINGTEXT "Managing Email Just Got Easier" 
CRCCheck On 

;!include "${NSISDIR}\Contrib\Modern UI\System.nsh" 

;-------------------------------- 
;General 

;Name and file 
Name "GTDInbox" 
OutFile "GTDInboxSetup-${INSTALL_VERSION}-${GTD_VERSION}-${PRISM_VERSION}.exe" 

;Default installation folder 
InstallDir "$PROGRAMFILES\Prism" 

;Get installation folder from registry if available 
InstallDirRegKey HKCU "Software\Prism" "" 

;Request application privileges for Windows Vista 
RequestExecutionLevel admin 

;-------------------------------- 
;Interface Settings 

!define MUI_ABORTWARNING 
!define MUI_ICON "gtdinbox.ico"; There's some in the NSIS folder
;!define MUI_UNICON "---PATH TO SETUP ICON HERE---"
!define MUI_HEADERIMAGE "logo-preview.png"
!define MUI_WELCOMEPAGE  
!define MUI_UNINSTALLER 
!define MUI_UNCONFIRMPAGE 
!define MUI_FINISHPAGE   

;Pages 

!insertmacro MUI_PAGE_WELCOME 
!insertmacro MUI_PAGE_DIRECTORY 
Page custom nsDialogsPage
!insertmacro MUI_PAGE_INSTFILES 

# These indented statements modify settings for MUI_PAGE_FINISH 
!define MUI_FINISHPAGE_NOAUTOCLOSE 
!define MUI_FINISHPAGE_RUN 
!define MUI_FINISHPAGE_RUN_CHECKED 
!define MUI_FINISHPAGE_RUN_TEXT "Start GTDInbox" 
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchLink" 

!insertmacro MUI_PAGE_FINISH		 


;-------------------------------- 
;Languages 
!insertmacro MUI_LANGUAGE "English" 
;--------------------------------  

;-------------------------------- 
;Installer Sections 

Function nsDialogsPage
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


Section "Install Section" SecInstall 

;  set the context for $SMPROGRAMS and other shell folder to the 'current' user 
SetShellVarContext current 

;  PRISM application data is recursively copied from yourAppPgmFiles to "$APPDATA\yourApp\Prism" 
SetOutPath "$INSTDIR\" 
File /r "prism.${PRISM_VERSION}.en-US.win32\prism\*"

;  PRISM webApp data is recursively copied from yourAppAppData to "$APPDATA\WebApps" 
SetOutPath "$APPDATA\WebApps\GTDInbox@prism.app\" 
File /r "webapps\*"
ClearErrors
FileOpen $0 "$APPDATA\WebApps\GTDInbox@prism.app\webapp.ini" w
IfErrors done
FileWrite $0 "[Parameters]$\r$\n"
FileWrite $0 "id=GTDInbox@prism.app$\r$\n"
FileWrite $0 "name=GTDInbox$\r$\n"
FileWrite $0 "uri=$Url$\r$\n"
FileWrite $0 "icon=webapp$\r$\n"
FileWrite $0 "status=false$\r$\n"
FileWrite $0 "location=false$\r$\n"
FileWrite $0 "sidebar=false$\r$\n"
FileWrite $0 "navigation=true$\r$\n"
FileWrite $0 "trayicon=false$\r$\n"
FileClose $0
done:


;  PRISM webApp data is recursively copied from yourAppAppData to "$APPDATA\WebApps" 
SetOutPath "$INSTDIR\extensions\{bcd47b5a-43be-433f-9051-7ce2cdf94ac0}\" 
File /r /x .git /x .gitignore "GTDInbox-Extension\*"

;windirExists: 
;Store installation folder 
WriteRegStr HKCU "Software\Prism" "" $INSTDIR 

;Create Shortcut links 
CreateShortcut "$DESKTOP\${MUI_PRODUCT}.lnk" "$INSTDIR\prism.exe" "-override $\"$APPDATA\WebApps\GTDInbox@prism.app\override.ini$\" -webapp GTDInbox@prism.app" "$INSTDIR\gtdinbox.ico"

;Create uninstaller 
;write uninstall information to the registry 
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${MUI_PRODUCT}" "DisplayName" "${MUI_PRODUCT} (remove only)" 
WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${MUI_PRODUCT}" "UninstallString" "$INSTDIR\Uninstall.exe"  
WriteUninstaller "$INSTDIR\Uninstall.exe" 



SectionEnd 

;-------------------------------- 
;Uninstaller Section 

Section "Uninstall" 

;  set the context for $SMPROGRAMS and other shell folder to the 'current' user 
SetShellVarContext current 

;ADD YOUR OWN FILES HERE... 

Delete "$DESKTOP\${MUI_PRODUCT}.lnk"  
Delete "$INSTDIR\Uninstall.exe" 

;Delete Files  
RMDir /r "$INSTDIR\*.*"   

RMDir "$INSTDIR"   
RMDir "$INSTDIR" 
RmDir "$APPDATA\WebApps\GTDInbox@prism.app" 

;Delete Uninstaller And Unistall Registry Entries 
DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\${MUI_PRODUCT}" 
DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\${MUI_PRODUCT}"   
DeleteRegKey /ifempty HKCU "Software\Prism" 

SectionEnd 


Function LaunchLink 
SetShellVarContext current	 

ExecShell "" "$DESKTOP\${MUI_PRODUCT}.lnk" 
FunctionEnd 
