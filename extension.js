const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// Your tasks and launch configuration
const tasksConfig = {
    "version": "2.0.0",
    "command": "",
    "args": [],
    "tasks": [
        {
            "label": "mkdir",
            "type": "shell",
            "command": "cmd",
            "args": [
                "/C",
                "if not exist .\\build mkdir .\\build"
            ]
        },
        {
            "label": "build-ion",
            "type": "shell",
            "command": "ion -o build/debug.c main",
            "group": "build"
        },
        {
            "label": "build-gcc",
            "type": "shell",
            "command": "gcc",
            "args": [
                "-g",
                "build/debug.c",
                "-o",
                "build/debug.exe"
            ],
            "group": "build"
        },
        {
            "label": "Build",
            "dependsOn": [
                "mkdir",
                "build-ion",
                "build-gcc",
            ]
        }
    ]
};

const launchConfig = {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "GDB Debug",
            "type": "cppdbg",
            "request": "launch",
            "program": "${workspaceFolder}/build/debug.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${workspaceFolder}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ],
            "miDebuggerPath": "",
            "preLaunchTask": "Build",
            "miDebuggerArgs": "",
            // "logging": {
            //     "trace": true,
            //     "traceResponse": true,
            //     "engineLogging": true
            // },
            "linux": {
                "MIMode": "gdb"
            },
            "osx": {
                "MIMode": "gdb"
            },
            "windows": {
                "MIMode": "gdb"
            }
        }
    ]
};

/**
 * Checks and shows the popup for setting up the Ion project.
 * @param {vscode.TextDocument} document The text document.
 */
async function checkAndShowPopup(document) {
    if (!document.fileName.endsWith('.ion')) {
        return;
    }

    const workspacePath = vscode.workspace.getWorkspaceFolder(document.uri).uri.fsPath;
    const vscodeFolderPath = path.join(workspacePath, '.vscode');
    const launchJsonPath = path.join(vscodeFolderPath, 'launch.json');
    const tasksJsonPath = path.join(vscodeFolderPath, 'tasks.json');

    let gdbPath = vscode.workspace.getConfiguration('IonGDB').get('Path');

    // Check if gdbPath is set
    if (!gdbPath || !fs.existsSync(gdbPath)) {
        let response = await vscode.window.showInformationMessage('Path to GDB is not set or invalid. Please set it first.', 'Open Settings');

        if (response === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'IonGDB.Path');
        }

        return;
    }

    // Get the root path of the workspace. In multi-root workspaces, this takes the first folder.
    let workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
    if (!workspaceRoot) {
        // No workspace is opened
        return;
    }

    if (!fs.existsSync(vscodeFolderPath) || !fs.existsSync(launchJsonPath) || !fs.existsSync(tasksJsonPath)) {
        let response = await vscode.window.showInformationMessage('Do you want to setup the current workspace as an ion project?', 'Yes', 'No');
        if (response === 'Yes') {
            setupIonProject(workspacePath);
        }
    }
}

/**
 * Sets up the Ion project in the given directory.
 * @param {string} vscodeFolderPath The path to the .vscode folder.
 */
async function setupIonProject(workspacePath) {
    const vscodeFolderPath = path.join(workspacePath, '.vscode');
    const launchJsonPath = path.join(vscodeFolderPath, 'launch.json');
    const tasksJsonPath = path.join(vscodeFolderPath, 'tasks.json');

    // If .vscode folder exists, remove it
    if (fs.existsSync(vscodeFolderPath)) {
        fs.rmdirSync(vscodeFolderPath, { recursive: true });
    }

    // Create .vscode folder
    fs.mkdirSync(vscodeFolderPath);

    // Create launch.json with the gdb path from configuration
    let modifiedLaunchConfig = Object.assign({}, launchConfig); // create a shallow copy
    let gdbPath = vscode.workspace.getConfiguration('IonGDB').get('Path');


    modifiedLaunchConfig.configurations[0].miDebuggerPath = gdbPath;

    // Check if gdbPath is set and valid
    if (!gdbPath || !fs.existsSync(gdbPath) || !fs.existsSync(modifiedLaunchConfig.configurations[0].miDebuggerPath)) {
        let response = await vscode.window.showInformationMessage('Path to GDB is not set or invalid. Please set it first.', 'Open Settings');

        if (response === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'IonGDB.Path');
        }
        return;
    }

    fs.writeFileSync(launchJsonPath, JSON.stringify(modifiedLaunchConfig, null, 4));

    if (!fs.existsSync(launchJsonPath)) {
        await vscode.window.showErrorMessage('Unable to create launch.json');
        return;
    }

    // Create tasks.json
    fs.writeFileSync(tasksJsonPath, JSON.stringify(tasksConfig, null, 4));

    if (!fs.existsSync(tasksJsonPath)) {
        await vscode.window.showErrorMessage('Unable to create task.json');
        return;
    }

    await vscode.window.showInformationMessage('Successfully configured ion project');
}

/**
 * The activate function of the extension.
 * @param {vscode.ExtensionContext} context The extension context.
 */
function activate(context) {
    // Check and show popup for already open '.ion' file
    if (vscode.window.activeTextEditor) {
        checkAndShowPopup(vscode.window.activeTextEditor.document);
    }

    // Listen for opened files
    let disposableOnOpen = vscode.workspace.onDidOpenTextDocument(document => {
        checkAndShowPopup(document);
    });
    context.subscriptions.push(disposableOnOpen);
}

exports.activate = activate;
